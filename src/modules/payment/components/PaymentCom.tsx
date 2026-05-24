"use client";

import { Button } from "@/components/ui/button";
import { usePayment } from "@/modules/payment/hooks/usePayment";
import { CourseType } from "@/types";
import { ChevronLeft, Loader2 } from "lucide-react";
import { PaymentUI } from "./PaymentUI";

// interface PaymentComProps {
//   courseId?: string;
//   bundleId?: string;
//   isCodeCenter?: boolean;
// }

const PaymentCom = ({
  courseId,
  bundleId,
  isCodeCenter,
  price,
  sale,
  hasCoupon,
}: {
  courseId?: string;
  bundleId?: string;
  isCodeCenter?: boolean;
  price?: number;
  sale?: CourseType["sale"];
  hasCoupon?: boolean;
}) => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleNextClick,
    coupon,
    setCoupon,
    isLoadingMethods,
  } = usePayment({
    courseId,
    bundleId,
    isCodeCenter,
    asModal: false,
    isFree: Number(price) === 0,
  });

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20) ",
      }}
      className="border-primary-800 relative z-10 mx-auto -mt-8 flex w-full max-w-[min(760px,95%)] flex-col justify-center rounded-lg border bg-white px-4 py-3 font-bold md:w-[760px] md:py-4 md:text-[24px]"
    >
      <PaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        price={price}
        sale={sale}
        coupon={coupon}
        setCoupon={setCoupon}
        courseId={courseId}
        hasCoupon={hasCoupon}
        isLoadingMethods={isLoadingMethods}
        isModal={false}
      />
      {paymentTypes.length > 0 && (
        <div className="ms-auto mt-5 flex flex-row! justify-between gap-5">
          <Button
            onClick={handleNextClick}
            className="h-11 w-32 items-center [&>svg]:size-6"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span className="text-base">تأكيد</span>
                <ChevronLeft className="size-5!" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentCom;
