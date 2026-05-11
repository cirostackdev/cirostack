"use client";

import { useEffect } from "react";

// Tawk.to — 100% free live chat (https://www.tawk.to)
// Set NEXT_PUBLIC_TAWK_PROPERTY_ID in your env vars (format: abc123/1def456g)
const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;

export function LiveChat() {
  useEffect(() => {
    if (!TAWK_PROPERTY_ID) return;

    const loadTawk = () => {
      if (typeof window === "undefined" || (window as any).Tawk_API) return;

      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.head.appendChild(script);
    };

    const consent = localStorage.getItem("cookie-consent");
    if (consent === "granted" || consent === null) {
      loadTawk();
    }

    window.addEventListener("analytics-consent-granted", loadTawk);
    return () => window.removeEventListener("analytics-consent-granted", loadTawk);
  }, []);

  return null;
}
