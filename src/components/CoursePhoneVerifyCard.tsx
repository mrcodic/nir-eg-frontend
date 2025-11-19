"use client";

import { useState } from "react";
import OtpModal from "./modals/OtpModal";

function CoursePhoneVerifyCard({ parentPhone }: { parentPhone: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
        }}
        className="bg-[#F9FAFC] md:text-2xl 
               font-bold mx-auto -mt-8 flex flex-wrap max-md:justify-center  md:gap-x-6 gap-x-4 gap-y-1 items-center  max-w-[min(85%,760px)] w-full relative border py-3 md:py-8 px-6 md:px-10 border-[#012D5A] rounded-[8px]"
      >
        <div className="flex gap-4">
          <img
            src="../assets/Whatsapp.svg"
            className=" w-[32px] h-[32px] md:w-[48px] md:h-[48px]"
          />

          <span className=" text-[#523412] inline-block text-[14px] md:text-xl ">
            {" "}
            لا يمكنك الوصول لمحتوى الباقة دون تأكيد رقم ولي الأمر
          </span>
        </div>

        {/* <p className="mr-4  text-[#523412] inline-block">من الكورس</p> */}
        <button
          className="w-[148px] text-[10px] md:text-lg p-2 mr-auto rounded-xl text-white bg-[#012D5A] "
          onClick={async () => {
            setOpen(true);
          }}
        >
          تأكيد الرقم
        </button>
      </div>

      {open && <OtpModal open={open} setOpen={setOpen} phone={parentPhone} />}
    </>
  );
}

export default CoursePhoneVerifyCard;
