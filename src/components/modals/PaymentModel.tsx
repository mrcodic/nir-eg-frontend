"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { usePayment } from "@/modules/payment/hooks/usePayment";
import { CourseType } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import React from "react";
import { PaymentUI } from "../../modules/payment/components/PaymentUI";

interface PaymentModalProps {
  courseId?: string;
  bundleId?: string | number;
  roomId?: string | number;
  price?: number | string;
  sale?: CourseType["sale"];
  hasCoupon?: boolean;
}

export const PaymentModel: React.FC<PaymentModalProps> = ({
  courseId,
  bundleId,
  roomId,
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
    asModal: true,
    isFree: Number(price) === 0,
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
        isModal={true}
      />
      <DialogFooter className="mt-5 flex w-full flex-row! justify-center gap-5 max-sm:flex-wrap sm:justify-center sm:space-x-0">
        {paymentTypes.length > 0 && (
          <Button className="w-full" onClick={handleNextClick}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>تأكيد</span>
            )}
          </Button>
        )}

        <DialogClose asChild>
          <Button className="w-full" variant="outline-gray">
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};
