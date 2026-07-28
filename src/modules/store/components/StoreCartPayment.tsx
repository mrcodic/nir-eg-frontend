"use client";

import { Button } from "@/components/ui/button";
import { StorePaymentsState } from "../hooks/useStorePayments";
import { StorePaymentUI } from "./StorePaymentUI";

const StoreCartPayment = ({ payment }: { payment: StorePaymentsState }) => {
  return (
    <div className="border-primary-800 relative col-span-12 flex flex-col rounded-lg border p-6 font-bold md:text-2xl lg:col-span-5 lg:col-start-8">
      <StorePaymentUI payment={payment} />

      <Button
        onClick={payment.checkout}
        className="mt-10 text-lg font-bold"
        disabled={payment.isCheckoutDisabled && !!payment.paymentTypes.length}
      >
        دفع
      </Button>
    </div>
  );
};

export default StoreCartPayment;
