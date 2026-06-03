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

      <DialogFooter className="mx-auto mt-5 flex flex-row! flex-wrap justify-center gap-5 sm:justify-center">
        <Button
          onClick={handleCheckout}
          className="bg-primary border-gray-light w-[148px] rounded-lg border p-2 text-sm font-bold text-white"
        >
          دفع
        </Button>

        <DialogClose asChild>
          <Button className="border-primary w-[148px] rounded-lg border bg-white p-2 text-sm font-bold text-black hover:text-white">
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>

      <DialogTitle className="hidden" />
      <DialogDescription className="hidden" />
    </div>
  );
};
