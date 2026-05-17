"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import { Bundle, IUser } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function BundlePurchaseButton({
  profile,
  bundle,
  className,
}: {
  profile: IUser;
  bundle: Bundle;
  className?: string;
}) {
  const modal = useModal();
  const router = useRouter();

  return (
    <Button
      className={cn("w-full max-w-43", className)}
      onClick={() => {
        if (profile) {
          modal.setDialogContent(
            <PaymentModel
              bundleId={bundle.id}
              price={Number(bundle?.price)}
              sale={bundle?.sale}
            />,
          );
          modal.openModal();
        } else {
          router.push(
            `/login?redirect=/bundles/showBundle?bundleId=${bundle.id}`,
          );
        }
      }}
    >
      اشترى الآن
    </Button>
  );
}
