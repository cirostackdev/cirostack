"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const NO_FOOTER_PATHS = ["/contact", "/start", "/careers/apply"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const hide = NO_FOOTER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (hide) return null;
  return <Footer />;
}
