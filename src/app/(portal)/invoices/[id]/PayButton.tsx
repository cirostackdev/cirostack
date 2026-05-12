"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, { method: "POST" });
    if (res.ok) {
      const { authorization_url } = await res.json();
      window.location.href = authorization_url;
    } else {
      toast.error("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Redirecting…" : "Pay Now"}
    </Button>
  );
}
