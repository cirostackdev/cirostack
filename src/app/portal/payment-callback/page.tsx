import { Suspense } from "react";
import PaymentCallbackClient from "./PaymentCallbackClient";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCallbackClient />
    </Suspense>
  );
}
