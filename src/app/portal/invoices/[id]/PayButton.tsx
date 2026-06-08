"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`/portal/invoices/${invoiceId}/checkout`)}>
      Pay Now
    </Button>
  );
}
