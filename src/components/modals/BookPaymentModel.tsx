import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { BooksPaymentUI } from "@/modules/books-store/components/BooksPaymentUI";
import { useBookPayment } from "@/modules/books-store/hooks/useBookPayments";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

interface PaymentModalProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  name?: string;
  bookId: string;
  price?: number;
}

export const BookPaymentModel: React.FC<PaymentModalProps> = ({
  open,
  setOpen,
  bookId,
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
  } = useBookPayment({
    bookId,
    asModal: true,
    setOpen,
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
