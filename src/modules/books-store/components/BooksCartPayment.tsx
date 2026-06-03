"use client";

import { Button } from "@/components/ui/button";
import { useBookPayment } from "../hooks/useBookPayments";
import { BooksPaymentUI } from "./BooksPaymentUI";

const BooksCartPayment = () => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
  } = useBookPayment({ asModal: false });

  return (
    <div className="border-primary-800 relative col-span-12 flex flex-col rounded-lg border p-6 font-bold md:text-2xl lg:col-span-5 lg:col-start-8">
      <BooksPaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        coupon={coupon}
        setCoupon={setCoupon}
      />

      {paymentTypes.length > 0 && (
        <Button onClick={handleCheckout} className="mt-10 text-lg font-bold">
          دفع
        </Button>
      )}
    </div>
  );
};

export default BooksCartPayment;
