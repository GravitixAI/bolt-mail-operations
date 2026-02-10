import { NextRequest, NextResponse } from "next/server";
import { logRequest, logError, type UserInfo } from "./logger";

/**
 * Wrapper for API route handlers that automatically logs requests
 */
export function withLogging<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  options?: {
    getUser?: (request: NextRequest) => UserInfo | undefined;
  }
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    const startTime = Date.now();
    let response: NextResponse<T>;

    try {
      response = await handler(request);
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log the error
      logError(error instanceof Error ? error : new Error(String(error)), {
        request: {
          method: request.method,
          url: request.url,
          ip: request.headers.get("x-forwarded-for") || "unknown",
        },
      });

      // Log the failed request
      logRequest(
        {
          method: request.method,
          url: request.url,
          ip: request.headers.get("x-forwarded-for") || undefined,
          headers: Object.fromEntries(request.headers.entries()),
        },
        { statusCode: 500 },
        duration,
        options?.getUser?.(request)
      );

      throw error;
    }

    const duration = Date.now() - startTime;

    // Log the request
    logRequest(
      {
        method: request.method,
        url: request.url,
        ip: request.headers.get("x-forwarded-for") || undefined,
        headers: Object.fromEntries(request.headers.entries()),
      },
      { statusCode: response.status },
      duration,
      options?.getUser?.(request)
    );

    return response;
  };
}

/**
 * Simple function to log a request without wrapping
 * Use this when you need more control over the handler
 */
export function logApiRequest(
  request: NextRequest,
  statusCode: number,
  startTime: number,
  user?: UserInfo
) {
  const duration = Date.now() - startTime;

  logRequest(
    {
      method: request.method,
      url: request.url,
      ip: request.headers.get("x-forwarded-for") || undefined,
      headers: Object.fromEntries(request.headers.entries()),
    },
    { statusCode },
    duration,
    user
  );
}
