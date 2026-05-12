"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { WhatsAppPopup } from "@/components/WhatsAppPopup";
import { CookieBanner } from "@/components/CookieBanner";
import { ChatWidget } from "@/components/Chat/ChatWidget";

function useIsAdmin() {
  const pathname = usePathname();
  return pathname?.startsWith("/admin");
}

export function SiteNav() {
  const isAdmin = useIsAdmin();
  if (isAdmin) return null;
  return <Navbar />;
}

export function SiteFooterWidgets() {
  const isAdmin = useIsAdmin();
  if (isAdmin) return null;
  return (
    <>
      <ConditionalFooter />
      <WhatsAppPopup />
      <CookieBanner />
      <ChatWidget />
    </>
  );
}
