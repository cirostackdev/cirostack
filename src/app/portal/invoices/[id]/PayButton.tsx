"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
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

  const config = {
    reference: `inv_${invoiceId}_${Date.now()}`,
    email,
    amount,
    currency,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: { invoiceId, custom_fields: [] },
  };

  const initializePayment = usePaystackPayment(config as any);

  function handlePay() {
    setLoading(true);
    initializePayment({
      onSuccess: async (response: any) => {
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
    } as any);
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
}
