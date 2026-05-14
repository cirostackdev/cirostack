"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { WhatsAppPopup } from "@/components/WhatsAppPopup";
import { CookieBanner } from "@/components/CookieBanner";
import { ChatWidget } from "@/components/Chat/ChatWidget";

function useHideFrame() {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") || pathname?.startsWith("/portal");
}

export function SiteNav() {
  const hide = useHideFrame();
  if (hide) return null;
  return <Navbar />;
}

export function SiteFooterWidgets() {
  const hide = useHideFrame();
  if (hide) return null;
  return (
    <>
      <ConditionalFooter />
      <WhatsAppPopup />
      <CookieBanner />
      <ChatWidget />
    </>
  );
}
