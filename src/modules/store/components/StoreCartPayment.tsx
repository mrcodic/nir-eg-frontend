"use client";

import { Button } from "@/components/ui/button";
import { useStorePayments } from "../hooks/useStorePayments";
import { StorePaymentUI } from "./StorePaymentUI";

const StoreCartPayment = () => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
    hasEnoughPoints,
  } = useStorePayments({ asModal: false });

  return (
    <div className="border-primary-800 relative col-span-12 flex flex-col rounded-lg border p-6 font-bold md:text-2xl lg:col-span-5 lg:col-start-8">
      <StorePaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        coupon={coupon}
        setCoupon={setCoupon}
      />

      {paymentTypes.length > 0 && (
        <Button
          onClick={handleCheckout}
          className="mt-10 text-lg font-bold"
          disabled={loading || (paymentMethodValue === "POINTS" && !hasEnoughPoints)}
        >
          دفع
        </Button>
      )}
    </div>
  );
};

export default StoreCartPayment;
