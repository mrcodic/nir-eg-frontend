"use client";

import { BookPaymentModel } from "@/components/modals/BookPaymentModel";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function BuyBookTrigger({
  id,
  price,
  buttonClassName,
  name,
}: {
  id: string;
  price: number;
  buttonClassName?: string;
  name?: string;
}) {
  const router = useRouter();

  const { profile } = useAuthContext();
  const modal = useModal();

  return (
    <Button
      onClick={() => {
        if (!profile) {
          const redirectUrl = encodeURIComponent(`/books/${id}?bookId=${id}`);
          router.push(`/login?redirect=${redirectUrl}`);
        } else {
          modal.setDialogContent(
            <BookPaymentModel bookId={id} price={price} name={name} />
          );
          modal.openModal();
        }
      }}
      className={cn("px-12 h-8 bg-primary-800 rounded-xl", buttonClassName)}
    >
      شراء
    </Button>
  );
}

export default BuyBookTrigger;
