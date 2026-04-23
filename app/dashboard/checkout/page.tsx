import { Suspense } from "react";
import CheckoutForm from "./checkout-form";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
