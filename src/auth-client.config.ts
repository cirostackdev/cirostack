import type { NextAuthConfig } from "next-auth";

export const clientAuthConfig = {
  pages: {
    signIn: "/portal/login",
  },
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: "portal-session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request }: { auth: any; request: any }) {
      const pathname = request.nextUrl.pathname as string;
      const isLoginPage =
        pathname === "/portal/login" || pathname === "/portal/login/";
      const isVerifyPage =
        pathname === "/portal/verify" || pathname === "/portal/verify/";
      const isPortalRoute = pathname.startsWith("/portal");

      if (isPortalRoute && !isLoginPage && !isVerifyPage) {
        return !!auth?.user;
      }
      return true;
    },
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
