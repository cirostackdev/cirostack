"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { id } = useParams<{ id: string }>();

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
