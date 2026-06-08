"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PayButtonProps {
  invoiceId: string;
  email: string;
  amount: number; // in kobo
  currency: string;
}

export default function PayButton({ invoiceId, email, amount, currency }: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = useCallback(() => {
    setLoading(true);

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => {
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount,
        currency,
        ref: `inv_${invoiceId}_${Date.now()}`,
        metadata: { invoiceId },
        callback: async (response: { reference: string }) => {
          // Verify payment on server
          try {
            const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference }),
            });
            if (res.ok) {
              toast.success("Payment successful!");
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
    };
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please try again.");
      setLoading(false);
    };
    document.body.appendChild(script);
  }, [invoiceId, email, amount, currency, router]);

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
}
