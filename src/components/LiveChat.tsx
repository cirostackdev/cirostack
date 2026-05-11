"use client";

import { useEffect } from "react";

const TAWK_SRC = "https://embed.tawk.to/6a022c6fe4a0671c332c59c7/1joc7r5kp";

export function LiveChat() {
  useEffect(() => {
    const loadTawk = () => {
      if (typeof window === "undefined" || (window as any).Tawk_API) return;

      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = TAWK_SRC;
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
