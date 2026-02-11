import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/app/actions/config-actions";
import { verifyFileInDatabase } from "@/app/actions/pdf-actions";
import { logApiRequest } from "@/lib/api-logger";
import { logError, logEvent } from "@/lib/logger";

interface RemovalRequestBody {
  filename: string;
  queue: "certified" | "regular";
  userEmail: string;
}

/**
 * POST /api/pdf/removal-request
 * 
 * Creates a HelpSpot ticket to request removal of a PDF file from the mail queue.
 * This replicates the functionality of the legacy helpspot_ticket.php script.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestStart = Date.now();

  try {
    // Parse request body
    let body: RemovalRequestBody;
    try {
      body = await request.json();
    } catch {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { filename, queue, userEmail } = body;

    // Validate required fields
    if (!filename || typeof filename !== "string") {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'filename' field" },
        { status: 400 }
      );
    }

    if (!queue || (queue !== "certified" && queue !== "regular")) {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'queue' field. Must be 'certified' or 'regular'." },
        { status: 400 }
      );
    }

    if (!userEmail || typeof userEmail !== "string" || !userEmail.includes("@")) {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'userEmail' field" },
        { status: 400 }
      );
    }

    // Security: Validate filename (no path traversal)
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Invalid filename" },
        { status: 400 }
      );
    }

    // Security: Only allow PDF files
    if (!filename.toLowerCase().endsWith(".pdf")) {
      logApiRequest(request, 400, requestStart);
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Get configuration
    const configResult = await getConfig();
    if (!configResult.success || !configResult.config) {
      logApiRequest(request, 500, requestStart);
      return NextResponse.json(
        { success: false, error: "Failed to load configuration" },
        { status: 500 }
      );
    }

    const config = configResult.config;

    // Validate HelpSpot configuration
    if (!config.helpspotEndpoint || !config.helpspotUsername || !config.helpspotPassword) {
      logApiRequest(request, 500, requestStart);
      return NextResponse.json(
        { success: false, error: "HelpSpot integration is not configured" },
        { status: 500 }
      );
    }

    // Get the UNC path for the specified queue
    const uncPath = queue === "certified" 
      ? config.uncPathCertified 
      : config.uncPathRegular;

    if (!uncPath) {
      logApiRequest(request, 500, requestStart);
      return NextResponse.json(
        { success: false, error: `UNC path not configured for ${queue} queue` },
        { status: 500 }
      );
    }

    // Security: Verify file exists in database (prevents arbitrary file removal requests)
    const fileExists = await verifyFileInDatabase(filename, uncPath);
    if (!fileExists) {
      logApiRequest(request, 404, requestStart);
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Create HelpSpot ticket
    const ticketResult = await createHelpSpotTicket({
      endpoint: config.helpspotEndpoint,
      username: config.helpspotUsername,
      password: config.helpspotPassword,
      categoryId: config.helpspotCategoryId || "7",
      userEmail,
      filename,
      queue,
    });

    if (!ticketResult.success) {
      logApiRequest(request, 500, requestStart);
      logError(new Error(ticketResult.error || "HelpSpot API error"), {
        filename,
        queue,
        userEmail,
      });
      return NextResponse.json(
        { success: false, error: ticketResult.error || "Failed to create removal request" },
        { status: 500 }
      );
    }

    // Log successful request
    logEvent("Removal request created", {
      filename,
      queue,
      userEmail,
      ticketId: ticketResult.ticketId,
    });

    logApiRequest(request, 201, requestStart);
    return NextResponse.json(
      { 
        success: true, 
        message: "Removal request submitted successfully. Please check your email for confirmation.",
        ticketId: ticketResult.ticketId,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(error instanceof Error ? error : new Error(message), {
      request: {
        method: request.method,
        url: request.url,
      },
    });

    logApiRequest(request, 500, requestStart);
    return NextResponse.json(
      { success: false, error: "Failed to process removal request" },
      { status: 500 }
    );
  }
}

/**
 * Create a HelpSpot ticket for file removal
 * Uses HTTP Basic Authentication as per the HelpSpot PHP SDK
 */
async function createHelpSpotTicket(params: {
  endpoint: string;
  username: string;
  password: string;
  categoryId: string;
  userEmail: string;
  filename: string;
  queue: string;
}): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  const { endpoint, username, password, categoryId, userEmail, filename, queue } = params;

  // Normalize endpoint URL
  let apiEndpoint = endpoint.trim();
  if (!apiEndpoint.startsWith("http://") && !apiEndpoint.startsWith("https://")) {
    apiEndpoint = "https://" + apiEndpoint;
  }
  if (apiEndpoint.endsWith("/")) {
    apiEndpoint = apiEndpoint.slice(0, -1);
  }

  const apiUrl = `${apiEndpoint}/api/index.php`;
  
  // HelpSpot API uses HTTP Basic Authentication
  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  // Build the ticket note (similar to original PHP implementation)
  const ticketNote = `Please remove the following outgoing letter from the ${queue} mail queue:\n\nFilename: ${filename}\nQueue: ${queue}\nRequested by: ${userEmail}`;

  // Build form data for HelpSpot API (method and data params only, not credentials)
  const formData = new URLSearchParams({
    method: "private.request.create",
    sEmail: userEmail,
    sTitle: "Please remove outgoing letter",
    tNote: ticketNote,
    xCategory: categoryId,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "HelpSpot authentication failed. Please check credentials in settings.",
        };
      }
      return {
        success: false,
        error: `HelpSpot API returned HTTP ${response.status}`,
      };
    }

    const xmlText = await response.text();

    // Check for errors in the XML response
    if (xmlText.includes("<error>")) {
      const errorMatch = xmlText.match(/<description>([^<]+)<\/description>/);
      const errorMessage = errorMatch ? errorMatch[1] : "Unknown HelpSpot API error";
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Extract ticket ID from response (xRequest element)
    const ticketIdMatch = xmlText.match(/<xRequest>([^<]+)<\/xRequest>/);
    const ticketId = ticketIdMatch ? ticketIdMatch[1] : undefined;

    return {
      success: true,
      ticketId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to connect to HelpSpot: ${message}`,
    };
  }
}
