"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) { resolve(); return; }
    const existing = document.getElementById("paystack-inline-script");
    if (existing) {
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

export default function CheckoutModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const initialized = useRef(false);
  const invoiceId = params.id;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        await loadPaystackScript();

        const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "initialize" }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          toast.error(data?.error || "Failed to initiate payment.");
          router.back();
          return;
        }

        const { ngnKobo, reference, email } = await res.json();
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!publicKey || !(window as any).PaystackPop) {
          toast.error("Payment gateway not available.");
          router.back();
          return;
        }

        const handler = (window as any).PaystackPop.setup({
          key: publicKey,
          email,
          amount: ngnKobo,
          currency: "NGN",
          ref: reference,
          container: "paystack-checkout-container",
          callback: function (response: { reference: string }) {
            fetch(`/api/portal/invoices/${invoiceId}/pay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference }),
            }).then(function (verifyRes) {
              if (verifyRes.ok) {
                router.replace(`/portal/invoices/${invoiceId}/success`);
              } else {
                toast.error("Payment received but verification failed. Contact support.");
                router.back();
              }
            }).catch(function () {
              toast.error("Payment received but verification failed. Contact support.");
              router.back();
            });
          },
          onClose: function () {
            router.back();
          },
        });

        handler.openIframe();
      } catch (err: any) {
        toast.error(err?.message || "Could not open payment. Please try again.");
        router.back();
      }
    })();
  }, [invoiceId, router]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <button
          onClick={() => router.back()}
          className="absolute -top-10 right-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div id="paystack-checkout-container" className="w-full min-h-[520px]" />
      </div>
    </div>
  );
}
