"use client";

import { useState, useRef } from "react";
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
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
        setIframeReady(false);
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

  function closeCheckout() {
    setCheckoutUrl(null);
    setIframeReady(false);
  }

  if (checkoutUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full h-full md:h-[90vh] md:max-w-[520px] md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Complete Payment</h2>
            <button
              onClick={closeCheckout}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 relative">
            {!iframeReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={checkoutUrl}
              className="w-full h-full border-0"
              title="Paystack Checkout"
              allow="payment"
              onLoad={() => setIframeReady(true)}
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
