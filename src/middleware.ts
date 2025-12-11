import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set to true to enable password protection
const PASSWORD_PROTECTION_ENABLED = true;

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/password", "/api/auth"];

export function middleware(request: NextRequest) {
  // Skip if password protection is disabled
  if (!PASSWORD_PROTECTION_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get("site_auth");

  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect to password page
  const url = request.nextUrl.clone();
  url.pathname = "/password";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};

