import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { StorePaymentUI } from "@/modules/store/components/StorePaymentUI";
import { useStorePayments } from "@/modules/store/hooks/useStorePayments";
import { StoreItem } from "@/types/store.types";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

interface PaymentModalProps {
  item: StoreItem;
}

export const StorePaymentModel: React.FC<PaymentModalProps> = ({ item }) => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
    hasEnoughPoints,
  } = useStorePayments({
    item,
    asModal: true,
  });

  return (
    <div className="">
      <StorePaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        price={Number(item?.price)}
        coupon={coupon}
        setCoupon={setCoupon}
        name={item?.name}
        item={item}
        isSingleItem
      />

      <DialogFooter className="mt-5 flex w-full flex-row! justify-center gap-5 max-sm:flex-wrap sm:justify-center sm:space-x-0">
        <Button
          onClick={handleCheckout}
          className="w-full"
          disabled={
            loading || (paymentMethodValue === "POINTS" && !hasEnoughPoints)
          }
        >
          دفع
        </Button>

        <DialogClose asChild>
          <Button className="w-full" variant="outline-gray">
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>

      <DialogTitle className="hidden" />
      <DialogDescription className="hidden" />
    </div>
  );
};
