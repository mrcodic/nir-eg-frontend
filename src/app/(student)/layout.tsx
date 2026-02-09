import PaymentStatusHandler from "@/components/PaymentStatusHandler";

export default function RootLayout({ children }) {
  return (
    <>
      <PaymentStatusHandler />
      {children}
    </>
  );
}
