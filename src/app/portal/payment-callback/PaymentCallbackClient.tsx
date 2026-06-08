"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const invoiceId = searchParams.get("invoiceId");

    if (window.parent !== window) {
      // Inside the checkout iframe — notify the parent modal
      if (reference) {
        window.parent.postMessage({ type: "paystack-success", reference }, window.location.origin);
      }
    } else {
      // Main-window fallback: iframe flow broke, user landed here directly.
      // Verify inline then redirect to success page.
      if (reference && invoiceId) {
        fetch(`/api/portal/invoices/${invoiceId}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        }).finally(() => {
          router.replace(`/portal/invoices/${invoiceId}/success`);
        });
      } else {
        router.replace("/portal/invoices");
      }
    }
  }, [searchParams, router]);

  return null;
}
