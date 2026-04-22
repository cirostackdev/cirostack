"use client";

import { ReactNode } from "react";

// In Next.js, Navbar/Footer live in app/layout.tsx.
// This component is a pass-through so existing page imports compile unchanged.
const Layout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default Layout;
