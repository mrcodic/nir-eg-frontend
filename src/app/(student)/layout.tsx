import PaymentStatusHandler from "@/modules/payment/components/PaymentStatusHandler";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>
      {children}
    </>
  );
}
