import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Received</h1>
        <p className="text-muted-foreground mb-6">Thank you! Your payment is being processed. You&apos;ll receive a confirmation email shortly.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/portal/invoices/${id}`}><Button variant="outline">View Invoice</Button></Link>
          <Link href="/portal/dashboard"><Button>Go to Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
