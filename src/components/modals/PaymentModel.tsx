"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { usePayment } from "@/hooks/usePayment";
import { CourseType } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";
import { PaymentUI } from "../ui/PaymentUI";

interface PaymentModalProps {
  courseId?: string;
  bundleId?: string;
  roomId?: string;
  centerId?: string | number;
  price?: number;
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
      <DialogFooter className="flex max-sm:flex-wrap flex-row! justify-center gap-5 mt-5 w-full sm:justify-center sm:space-x-0">
        {paymentTypes.length > 0 && (
          <Button className="w-full" onClick={handleNextClick}>
            التالي
          </Button>
        )}

        <DialogClose asChild>
          <Button
            className="w-full text-black border-gray-light hover:bg-gray-dark hover:text-white"
            variant="outline"
          >
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};
