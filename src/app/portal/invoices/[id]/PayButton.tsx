"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface PayButtonProps {
  invoiceId: string;
  email: string;
  amount: number;
  currency: string;
}

export default function PayButton({ invoiceId, email, amount, currency }: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [iframeLoads, setIframeLoads] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  // Detect Paystack redirect (2nd iframe load = payment done)
  useEffect(() => {
    if (!checkoutUrl || iframeLoads < 2) return;
    handlePaymentDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeLoads]);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize" }),
      });
      if (res.ok) {
        const data = await res.json();
        setReference(data.reference);
        setIframeLoads(0);
        setCheckoutUrl(data.authorization_url);
        setLoading(false);
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to initiate payment.");
        setLoading(false);
      }
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function handlePaymentDone() {
    if (!reference) return;
    try {
      const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      if (res.ok) {
        toast.success("Payment successful!");
        setCheckoutUrl(null);
        router.push(`/portal/invoices/${invoiceId}/success`);
      } else {
        toast.error("Payment received but verification failed. Contact support.");
        setCheckoutUrl(null);
        router.refresh();
      }
    } catch {
      toast.error("Payment received but verification failed. Contact support.");
      setCheckoutUrl(null);
      router.refresh();
    }
  }

  function closeCheckout() {
    setCheckoutUrl(null);
    setIframeLoads(0);
    setReference(null);
  }

  // Embedded Paystack checkout modal
  if (checkoutUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full h-full md:h-[90vh] md:max-w-[520px] md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <h2 className="text-sm font-semibold">Complete Payment</h2>
            <button
              onClick={closeCheckout}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 relative">
            {iframeLoads === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={checkoutUrl}
              className="w-full h-full border-0"
              title="Paystack Checkout"
              allow="payment"
              onLoad={() => setIframeLoads((n) => n + 1)}
            />
          </div>

        </div>
      </div>
    );
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
}
