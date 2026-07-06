"use client";

import { StorePaymentModel } from "@/components/modals/StorePaymentModel";
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
          const redirectUrl = encodeURIComponent(
            `/store/${id}?open_modal=true`,
          );
          router.push(`/login?redirect=${redirectUrl}`);
        } else {
          modal.setDialogContent(
            <StorePaymentModel itemId={id} price={price} name={name} />,
          );
          modal.openModal();
        }
      }}
      className={cn("bg-primary-800 h-8 rounded-xl px-12", buttonClassName)}
    >
      شراء
    </Button>
  );
}

export default BuyBookTrigger;
