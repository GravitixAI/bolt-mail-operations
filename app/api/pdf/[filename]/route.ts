import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { getConfig } from "@/app/actions/config-actions";
import { verifyFileInDatabase } from "@/app/actions/pdf-actions";
import { logApiRequest } from "@/lib/api-logger";
import { logError } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const requestStart = Date.now();
  const { filename } = await params;

  // Get queue type from query params
  const searchParams = request.nextUrl.searchParams;
  const queue = searchParams.get("queue");
  const download = searchParams.get("download") === "true";

  // Validate queue parameter
  if (!queue || (queue !== "certified" && queue !== "regular")) {
    logApiRequest(request, 400, requestStart);
    return NextResponse.json(
      { error: "Missing or invalid 'queue' parameter. Must be 'certified' or 'regular'." },
      { status: 400 }
    );
  }

  // Security: Validate filename
  if (!filename || filename.includes("..") || path.isAbsolute(filename)) {
    logApiRequest(request, 400, requestStart);
    return NextResponse.json(
      { error: "Invalid filename" },
      { status: 400 }
    );
  }

  // Security: Only allow PDF files
  if (!filename.toLowerCase().endsWith(".pdf")) {
    logApiRequest(request, 400, requestStart);
    return NextResponse.json(
      { error: "Only PDF files are allowed" },
      { status: 400 }
    );
  }

  try {
    // Get configuration for UNC paths
    const configResult = await getConfig();
    if (!configResult.success || !configResult.config) {
      logApiRequest(request, 500, requestStart);
      return NextResponse.json(
        { error: "Failed to load configuration" },
        { status: 500 }
      );
    }

    const config = configResult.config;
    const uncPath = queue === "certified" 
      ? config.uncPathCertified 
      : config.uncPathRegular;

    if (!uncPath) {
      logApiRequest(request, 500, requestStart);
      return NextResponse.json(
        { error: `UNC path not configured for ${queue} queue` },
        { status: 500 }
      );
    }

    // Security: Verify file exists in database (prevents arbitrary file access)
    const fileExists = await verifyFileInDatabase(filename, uncPath);
    if (!fileExists) {
      logApiRequest(request, 404, requestStart);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Build full file path
    const filePath = path.join(uncPath, filename);

    // Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch {
      logApiRequest(request, 404, requestStart);
      return NextResponse.json(
        { error: "File not found on disk" },
        { status: 404 }
      );
    }

    // Get file stats for Content-Length
    const stats = await fs.stat(filePath);

    // Read file and stream it
    const fileBuffer = await fs.readFile(filePath);

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Length", stats.size.toString());
    
    // Content-Disposition: inline for viewing, attachment for download
    const disposition = download ? "attachment" : "inline";
    headers.set("Content-Disposition", `${disposition}; filename="${filename}"`);
    
    // Cache control - allow browser caching for 5 minutes
    headers.set("Cache-Control", "private, max-age=300");

    logApiRequest(request, 200, requestStart);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(error instanceof Error ? error : new Error(message), {
      request: {
        method: request.method,
        url: request.url,
      },
      filename,
      queue,
    });

    logApiRequest(request, 500, requestStart);
    return NextResponse.json(
      { error: "Failed to serve PDF file" },
      { status: 500 }
    );
  }
}
