import PaymentStatusHandler from "@/modules/payment/components/PaymentStatusHandler";

export default function BooksLayout({ children }) {
  return (
    <>
      <PaymentStatusHandler />
      {children}
    </>
  );
}
