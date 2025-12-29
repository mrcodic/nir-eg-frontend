"use client";
import { paymentTypesObj } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentModel } from "../../../components/modals/PaymentModel";
import { Button } from "../../../components/ui/button";

export default function PayLabel({ type, price }) {
  const router = useRouter();
  const modal = useModal();
  const search = useSearchParams();
  const courseId = search.get("courseId");
  const bundleId = search.get("bundleId");
  const roomId = search.get("roomId");

  function backtoPayMethod() {
    router.push("/bundles");

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
            src={paymentTypesObj[type].icons[0]}
          />
          <span> {paymentTypesObj[type].label}</span>
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
