import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { clientAuthConfig } from "./auth-client.config";

// Admin auth middleware (NextAuth)
const { auth: adminAuth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Portal auth guard ─────────────────────────────────────────────────────
  if (pathname.startsWith("/portal")) {
    const isPublicPortalPage =
      pathname === "/portal/login" ||
      pathname === "/portal/login/" ||
      pathname === "/portal/verify" ||
      pathname === "/portal/verify/";

    if (!isPublicPortalPage) {
      // Check for portal session cookie
      const sessionCookie =
        request.cookies.get("portal-session-token") ??
        request.cookies.get("__Secure-portal-session-token");
      if (!sessionCookie) {
        const loginUrl = new URL("/portal/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // ── Admin auth guard (NextAuth) ───────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    return (adminAuth as any)(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
