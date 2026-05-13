"use client";

import { SessionProvider } from "next-auth/react";

export function PortalSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth-client">
      {children}
    </SessionProvider>
  );
}
