"use client";

import { useState } from "react";
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
        window.location.href = data.authorization_url;
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

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Redirecting to payment…" : "Pay Now"}
    </Button>
  );
}
