"use client";

import { useEffect } from "react";

const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

export function LiveChat() {
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    const loadCrisp = () => {
      if (typeof window === "undefined" || (window as any).$crisp) return;

      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    };

    // Load after analytics consent if available, otherwise load immediately
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "granted" || consent === null) {
      loadCrisp();
    }

    window.addEventListener("analytics-consent-granted", loadCrisp);
    return () => window.removeEventListener("analytics-consent-granted", loadCrisp);
  }, []);

  return null;
}
