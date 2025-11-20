"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getOtp } from "@/utils/api";
import { getLocalStorage } from "@/utils/clientFun";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";
import OtpModal from "./OtpModal";

export default function ReachModal({ open, setOpen }) {
  const { toast } = useToast();
  const { SingleCourse } = useParams();
  const [otp, setOtp] = useState(false);

  async function handleOtp() {
    const res = await getOtp(getLocalStorage("student")?.parent_phone);
    if (res.status) {
      setOtp(true);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-8 max-w-2xl bg-white rounded-lg shadow-lg">
          <div className="flex gap-2">
            <img src="/assets/WarningColor.svg" className="w-[42px] h-[42px]" />
            <div>
              <h3 className="text-[#121212] text-[20px] font-bold">
                لا يمكنك الوصول لمحتوى الباقة دون تأكيد رقم ولي الأمر{" "}
              </h3>
            </div>
          </div>
          <div className="h-px w-full mt-[16px] bg-primary-700" />
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
            }}
            className=" md:text-[24px] 
   font-bold  flex flex-wrap md:flex-nowrap justify-center gap-[24px] items-center w-full bg-background   border py-3 md:py-[32px] p-2 border-[#012D5A] rounded-lg"
          >
            <img src="/assets/Whatsapp.svg" className="w-[48px] h-[48px]" />

            <span className=" text-[#523412] inline-block text-xl ">
              {" "}
              إذا قمت بتأكيد رقم هاتف ولي الأمر الآن سنقوم بإرسال رمز التأكيد
              للرقم المسجل لدينا عبر تطبيق واتساب.{" "}
            </span>
            <div className="relative   -top-2 -right-5"> </div>
            {/* <p className="mr-4  text-[#523412] inline-block">من الكورس</p> */}
          </div>

          <DialogFooter className="flex flex-row! justify-start! gap-5 mt-5 ">
            <DialogClose asChild className="">
              <Button
                onClick={handleOtp}
                className="bg-primary border border-primary-700 rounded-lg w-[148px] text-sm font-bold p-4 text-white"
              >
                تأكيد الرقم
              </Button>
            </DialogClose>
            <Link href={`/bundles/${SingleCourse}`}>
              <Button className="border border-primary rounded-lg w-[148px] bg-white hover:bg-white text-sm font-bold p-4 text-[#121212]">
                رجوع{" "}
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {otp && (
        <OtpModal
          open={otp}
          setOpen={setOtp}
          phone={getLocalStorage("student").parent_phone}
        />
      )}
    </>
  );
}
