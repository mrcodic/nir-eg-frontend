"use client";

import { StorePaymentModel } from "@/components/modals/StorePaymentModel";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import { StoreItem } from "@/types/store.types";
import { useRouter } from "next/navigation";

function BuyStoreItemTrigger({
  item,
  buttonClassName,
}: {
  item: StoreItem;
  buttonClassName?: string;
}) {
  const router = useRouter();

  const { profile } = useAuthContext();
  const modal = useModal();

  return (
    <Button
      onClick={() => {
        if (!profile) {
          const redirectUrl = encodeURIComponent(
            `/store/${item?.id}?open_modal=true`,
          );
          router.push(`/login?redirect=${redirectUrl}`);
        } else {
          modal.setDialogContent(
            <StorePaymentModel item={item} />,
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

export default BuyStoreItemTrigger;
