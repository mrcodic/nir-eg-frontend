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
      <DialogFooter className="flex flex-wrap flex-row! justify-center gap-5 mt-5 mx-auto">
        {paymentTypes.length > 0 && (
          <Button
            onClick={handleNextClick}
            className="bg-primary border border-gray-light rounded-lg w-[148px] text-sm font-bold p-2 text-white"
          >
            التالي
          </Button>
        )}

        <DialogClose asChild>
          <Button className="border border-primary hover:text-white rounded-lg w-[148px] bg-white text-sm font-bold p-2 text-[#121212]">
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};
