"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PayButtonProps {
  invoiceId: string;
  email: string;
  amount: number;
  currency: string;
}

export default function PayButton({ invoiceId, email, amount, currency }: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const scriptLoaded = useRef(false);
  const router = useRouter();

  // Pre-load the Paystack inline script on mount
  useEffect(() => {
    if (scriptLoaded.current || document.getElementById("paystack-inline-script")) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    if (!scriptLoaded.current) {
      toast.error("Payment gateway not ready. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to initiate payment.");
        setLoading(false);
        return;
      }

      const { ngnKobo, reference } = await res.json();

      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: ngnKobo,
        currency: "NGN",
        ref: reference,
        callback: async (response: { reference: string }) => {
          try {
            const verifyRes = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference }),
            });
            if (verifyRes.ok) {
              router.push(`/portal/invoices/${invoiceId}/success`);
            } else {
              toast.error("Payment received but verification failed. Contact support.");
              router.refresh();
            }
          } catch {
            toast.error("Payment received but verification failed. Contact support.");
            router.refresh();
          }
        },
        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
}
