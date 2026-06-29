"use client";

import { useModal } from "@/context/ModalProvider";
import OtpModal from "@/components/modals/OtpModal";

function CoursePhoneVerifyCard({ parentPhone }: { parentPhone: string }) {
  const modal = useModal();

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
      }}
      className="border-primary-800 relative z-10 mx-auto -mt-8 flex w-full max-w-[min(85%,760px)] flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border bg-[#F9FAFC] px-2 py-4 font-bold max-md:justify-center md:gap-x-6 md:px-4 md:py-6 md:text-2xl"
    >
      <div className="flex items-center gap-4">
        <img src="../assets/Whatsapp.svg" className="size-8 md:size-12" />

        <span className="inline-block text-sm text-[#523412] md:text-xl">
          لا يمكنك الوصول لمحتوى الباقة دون تأكيد رقم ولي الأمر
        </span>
      </div>

      <button
        className="bg-primary-800 hover:bg-primary-800/80 mr-auto h-11 w-32 cursor-pointer rounded-xl p-2 text-[10px] text-white transition-all md:text-base"
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
