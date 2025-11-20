import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] p-6">
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

        <DialogFooter className="flex flex-wrap flex-row!  gap-5 mt-5 mx-auto justify-center">
          <Button
            onClick={handleCheckout}
            className="bg-primary border border-primary-700 rounded-lg w-[148px] text-sm font-bold p-2 text-white"
          >
            دفع
          </Button>

          <DialogClose asChild>
            <Button className="border border-primary hover:text-white rounded-lg w-[148px] bg-white text-sm font-bold p-2 text-[#121212]">
              إلغاء
            </Button>
          </DialogClose>
        </DialogFooter>

        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
      </DialogContent>
    </Dialog>
  );
};
