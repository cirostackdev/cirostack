"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { META_PIXEL_ID, trackPageView } from "@/lib/meta-pixel";

export function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inject the Meta Pixel base code once on mount
  useEffect(() => {
    if (typeof window === "undefined" || window.fbq) return;

    // fbq queue shim (matches Meta's official snippet)
    const queue: unknown[][] = [];
    const fbq = (...args: unknown[]) => {
      queue.push(args);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;

    // Load the SDK script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    // Initialize with our Pixel ID
    window.fbq("init", META_PIXEL_ID);
    trackPageView();
  }, []);

  // Track page views on route changes (SPA navigation)
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      trackPageView();
    }
  }, [pathname, searchParams]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
