import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs on the Edge runtime, so we can't use Winston directly here.
// Instead, we'll add timing headers that can be logged by API routes.
// For API routes, we'll log directly in the route handlers or via a wrapper.

export function middleware(request: NextRequest) {
  const requestStart = Date.now();
  const response = NextResponse.next();

  // Add request timing header for downstream logging
  response.headers.set("x-request-start", requestStart.toString());

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Match main pages (excluding static files)
    "/((?!_next/static|_next/image|favicon.ico|themes).*)",
  ],
};
