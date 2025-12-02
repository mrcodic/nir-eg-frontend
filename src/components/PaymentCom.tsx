"use client";

import { usePayment } from "@/hooks/usePayment";
import { CourseType } from "@/types";
import { ChevronLeft } from "lucide-react";
import { PaymentUI } from "./ui/PaymentUI";
import { Button } from "./ui/button";

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
  } = usePayment({ courseId, bundleId, isCodeCenter, asModal: false });

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20) ",
      }}
      className="bg-background relative md:text-[24px] font-bold  flex flex-col max-w-[min(760px,85%)] w-full justify-center md:w-[760px]  border py-3 md:py-8 mx-auto  -mt-8 px-5 border-primary-800 rounded-lg  z-10"
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
      />
      {paymentTypes.length > 0 && (
        <div className="flex flex-row! justify-between gap-5 mt-5 ms-auto">
          <Button
            onClick={handleNextClick}
            className="w-32 h-11 items-center [&>svg]:size-6"
          >
            التالي
            <ChevronLeft />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentCom;
