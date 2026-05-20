"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import { Button } from "@/components/ui/button";
import { paymentTypesObj } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { paymentType } from "@/types";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PayLabel({ price, courseId, bundleId, roomId }) {
  const router = useRouter();
  const modal = useModal();

  function backtoPayMethod() {
    router.push(
      `/bundles${courseId ? `/${courseId}` : bundleId ? `/bundle-details/${bundleId}` : ""}`,
    );

    modal.setDialogContent(
      <PaymentModel
        courseId={courseId}
        bundleId={bundleId}
        roomId={roomId}
        price={price}
      />,
    );

    modal.openModal();
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-6 md:flex-nowrap">
      <div className="flex flex-wrap items-center gap-4">
        <h4 className="text-nowrap">طريقة الدفع:</h4>

        <div className="flex items-center gap-2">
          <img
            className="h-8 object-contain"
            src={paymentTypesObj[paymentType.code].icons[0]}
          />
          <span> {paymentTypesObj[paymentType.code].label}</span>
        </div>
      </div>

      <Button
        onClick={backtoPayMethod}
        className="text-primary-800 border-primary-800 group ms-auto rounded-lg border bg-white transition-all hover:text-white [&>svg]:size-6"
      >
        <ChevronRight />
        <span className="font-bold">العودة لاختيار طريقة الدفع</span>
      </Button>
    </div>
  );
}
