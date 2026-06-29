import PaymentStatusHandler from "@/modules/payment/components/PaymentStatusHandler";

export default function RootLayout({ children }) {
  return (
    <>
      <PaymentStatusHandler />
      {children}
    </>
  );
}
