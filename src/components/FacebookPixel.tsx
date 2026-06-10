"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { META_PIXEL_ID, trackPageView } from "@/lib/meta-pixel";

export function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inject the Meta Pixel base code once on mount — only after analytics consent
  useEffect(() => {
    const initPixel = () => {
      if (typeof window === "undefined" || window.fbq) return;

      // fbq queue shim — must match Meta's official format exactly so
      // fbevents.js can iterate fbq.queue via Symbol.iterator on load
      const fbq: any = function (...args: unknown[]) {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue.push(args);
        }
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [] as unknown[][];
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
    };

    const consent = localStorage.getItem("cookie-consent");
    if (consent === "granted") {
      initPixel();
    }

    window.addEventListener("analytics-consent-granted", initPixel);
    return () => window.removeEventListener("analytics-consent-granted", initPixel);
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
