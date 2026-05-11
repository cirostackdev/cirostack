"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

export function loadGoogleAnalytics() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-PXTP0DF4VH";
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-PXTP0DF4VH");
  };
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on initial paint
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    if (consent === "granted") {
      loadGoogleAnalytics();
      window.dispatchEvent(new Event("analytics-consent-granted"));
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
    loadGoogleAnalytics();
    window.dispatchEvent(new Event("analytics-consent-granted"));
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-[60] md:left-auto md:right-6 md:max-w-md"
        >
          <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-sm shadow-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground text-sm mb-1">
                  We use cookies
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use analytics cookies to understand how visitors interact with our site and improve your experience.{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline underline-offset-2 hover:no-underline"
                  >
                    Privacy policy
                  </Link>
                </p>
              </div>
              <button
                onClick={decline}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Dismiss cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={accept} className="flex-1">
                Accept all
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={decline}
                className="flex-1"
              >
                Reject non-essential
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
