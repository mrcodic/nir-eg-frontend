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
  const payment = useStorePayments({
    item,
    asModal: true,
  });

  return (
    <div className="">
      <StorePaymentUI payment={payment} item={item} />

      <DialogFooter className="mt-5 flex w-full flex-row! justify-center gap-5 max-sm:flex-wrap sm:justify-center sm:space-x-0">
        <Button
          onClick={payment.checkout}
          className="w-full"
          disabled={payment.isCheckoutDisabled}
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
