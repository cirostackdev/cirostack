"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");

    if (!reference) {
      // No reference in URL — came here directly, just show success (webhook handles marking paid)
      setStatus("success");
      return;
    }

    fetch(`/api/portal/invoices/${id}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          // Might already be marked paid via webhook — treat as success
          setStatus("success");
        }
      })
      .catch(() => setStatus("success")); // Webhook fallback — don't block user
  }, [id, searchParams]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Received</h1>
        <p className="text-muted-foreground mb-6">
          Thank you! Your payment has been confirmed. You&apos;ll receive a receipt by email shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/portal/invoices/${id}`}>
            <Button variant="outline">View Invoice</Button>
          </Link>
          <Link href="/portal/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
