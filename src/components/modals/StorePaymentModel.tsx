import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { BooksPaymentUI } from "@/modules/store/components/BooksPaymentUI";
import { useStorePayments } from "@/modules/store/hooks/useStorePayments";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

interface PaymentModalProps {
  name?: string;
  itemId: string;
  price?: number;
}

export const StorePaymentModel: React.FC<PaymentModalProps> = ({
  itemId,
  name,
  price,
}) => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
  } = useStorePayments({
    itemId,
    asModal: true,
    isSingleBook: true,
  });

  return (
    <div className="">
      <BooksPaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        price={price}
        coupon={coupon}
        setCoupon={setCoupon}
        name={name}
        isSingleBook
      />

      <DialogFooter className="mt-5 flex w-full flex-row! justify-center gap-5 max-sm:flex-wrap sm:justify-center sm:space-x-0">
        <Button onClick={handleCheckout} className="w-full">
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
