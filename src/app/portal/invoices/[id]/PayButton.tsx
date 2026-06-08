"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PayButtonProps {
  invoiceId: string;
  email: string;
  amount: number;
  currency: string;
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) { resolve(); return; }
    const existing = document.getElementById("paystack-inline-script");
    if (existing) {
      // Script tag exists but may still be loading — wait for it
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function PayButton({ invoiceId, email, amount, currency }: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pre-load on mount
  useEffect(() => { loadPaystackScript().catch(() => {}); }, []);

  async function handlePay() {
    setLoading(true);
    try {
      // Ensure script is ready
      await loadPaystackScript();

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
    } catch (err) {
      console.error("[PayButton]", err);
      toast.error("Could not open payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay Now"}
    </Button>
  );
}
