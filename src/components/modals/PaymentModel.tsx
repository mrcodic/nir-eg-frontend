"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { usePayment } from "@/hooks/usePayment";
import { CourseType } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";
import { PaymentUI } from "../../modules/payment/components/PaymentUI";

interface PaymentModalProps {
  courseId?: string;
  bundleId?: string;
  roomId?: string | number;
  centerId?: string | number;
  price?: number | string;
  sale?: CourseType["sale"];
  hasCoupon?: boolean;
}

export const PaymentModel: React.FC<PaymentModalProps> = ({
  courseId,
  bundleId,
  roomId,
  centerId,
  sale,
  price,
  hasCoupon,
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
    roomId,
    centerId,
    asModal: true,
  });

  return (
    <div>
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
      <DialogFooter className="mt-5 flex w-full flex-row! justify-center gap-5 max-sm:flex-wrap sm:justify-center sm:space-x-0">
        {paymentTypes.length > 0 && (
          <Button className="w-full" onClick={handleNextClick}>
            التالي
          </Button>
        )}

        <DialogClose asChild>
          <Button
            className="border-gray-light hover:bg-gray-dark w-full text-black hover:text-white"
            variant="outline"
          >
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};
