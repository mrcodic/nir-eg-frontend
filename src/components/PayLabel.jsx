"use client";
import { paymentTypesObj } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentModel } from "./modals/PaymentModel";

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
    <div className="flex  flex-wrap md:flex-nowrap  justify-between items-end gap-[24px]">
      <div className="flex gap-4 flex-wrap  ">
        <div className="flex gap-4 items-center">
          <img className="w-[24px] h-[24px]" src="/assets/PaymentColor.svg" />
          <span className=" text-nowrap ">طريقة الدفع:</span>
        </div>

        <div className="flex items-center  gap-[24px]">
          <img
            className=" object-contain h-[32px]"
            src={paymentTypesObj[type].icons[0]}
          />
          <span> {paymentTypesObj[type].label}</span>
        </div>
      </div>

      <button
        onClick={backtoPayMethod}
        className=" border text-sm flex justify-center  min-h-[36px] rounded-[10px] w-[250px] border-[#012D5A] text-[#121212] items-center gap-[12px] px-1"
      >
        <span>العودة لاختيار طريقة الدفع</span>
        <img className="w-[24px] h-[24px]" src="/assets/LeftArrowColor.svg" />
      </button>
    </div>
  );
}
