"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    if (reference && window.parent !== window) {
      window.parent.postMessage({ type: "paystack-success", reference }, window.location.origin);
    }
  }, [searchParams]);

  return null;
}
