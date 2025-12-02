"use client";
import { paymentTypesObj } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentModel } from "./modals/PaymentModel";
import { Button } from "./ui/button";

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
      />
    );

    modal.openModal();
  }

  return (
    <div className="flex  flex-wrap md:flex-nowrap  justify-between items-end gap-6">
      <div className="flex gap-4 flex-wrap items-center ">
        <h4 className=" text-nowrap ">طريقة الدفع:</h4>

        <div className="flex items-center  gap-2">
          <img
            className=" object-contain h-8"
            src={paymentTypesObj[type].icons[0]}
          />
          <span> {paymentTypesObj[type].label}</span>
        </div>
      </div>

      <Button
        onClick={backtoPayMethod}
        className="bg-white ms-auto text-primary-800 rounded-lg border-primary-800 border [&>svg]:size-6 group hover:text-white transition-all"
      >
        <ChevronRight />
        <span className="font-bold ">العودة لاختيار طريقة الدفع</span>
      </Button>
    </div>
  );
}
