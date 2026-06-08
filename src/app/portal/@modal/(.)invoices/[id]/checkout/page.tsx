"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const invoiceId = params.id;
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  // Initialize transaction and get authorization_url
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch(`/api/portal/invoices/${invoiceId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "initialize" }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        setCheckoutUrl(data.authorization_url);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to initiate payment.");
        router.back();
      });
  }, [invoiceId, router]);

  // Listen for postMessage from callback page inside the iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "paystack-success") return;

      const reference = e.data.reference;
      fetch(`/api/portal/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
        .then((res) => {
          if (res.ok) {
            router.replace(`/portal/invoices/${invoiceId}/success`);
          } else {
            toast.error("Payment received but verification failed. Contact support.");
            router.back();
          }
        })
        .catch(() => {
          toast.error("Payment received but verification failed. Contact support.");
          router.back();
        });
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [invoiceId, router]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-transparent">
        <button
          onClick={() => router.back()}
          className="absolute -top-9 right-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {loading && (
          <div className="flex items-center justify-center h-[520px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {checkoutUrl && (
          <iframe
            src={checkoutUrl}
            className="w-full border-0 rounded-lg"
            style={{ height: "520px" }}
            title="Paystack Checkout"
            allow="payment"
          />
        )}
      </div>
    </div>
  );
}
