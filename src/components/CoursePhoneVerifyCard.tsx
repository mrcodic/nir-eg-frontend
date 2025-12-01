"use client";

import { useModal } from "@/context/ModalProvider";
import OtpModal from "./modals/OtpModal";

function CoursePhoneVerifyCard({ parentPhone }: { parentPhone: string }) {
  const modal = useModal();

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
      }}
      className="bg-[#F9FAFC] md:text-2xl 
               font-bold mx-auto -mt-8 flex flex-wrap max-md:justify-center  md:gap-x-6 gap-x-4 gap-y-1 items-center  max-w-[min(85%,760px)] w-full relative border px-2 md:px-4 py-4 md:py-6 border-primary-800 rounded-lg z-10"
    >
      <div className="flex gap-4 items-center">
        <img src="../assets/Whatsapp.svg" className=" size-8 md:size-12" />

        <span className=" text-[#523412] inline-block text-sm md:text-xl ">
          لا يمكنك الوصول لمحتوى الباقة دون تأكيد رقم ولي الأمر
        </span>
      </div>

      <button
        className="w-32 text-[10px] md:text-base p-2 mr-auto rounded-xl text-white bg-primary-800 h-11 "
        onClick={async () => {
          modal.setDialogContent(<OtpModal phone={parentPhone} />);
          modal.openModal();
        }}
      >
        تأكيد الرقم
      </button>
    </div>
  );
}

export default CoursePhoneVerifyCard;
