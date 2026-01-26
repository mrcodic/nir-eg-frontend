"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalProvider";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";
import OtpModal from "./OtpModal";

export default function PhoneVerificationAlertModal({ initialOpen, phone }) {
  const [open, setOpen] = useState(initialOpen);
  const { SingleCourse } = useParams();
  const modal = useModal();

  async function handleOtp() {
    setOpen(false);
    modal.setDialogContent(<OtpModal phone={phone} />);
    modal.openModal();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <div className="flex gap-2">
          <Image
            src="/assets/icons/WarningColor.svg"
            width={42}
            height={42}
            className="h-[42px] w-[42px]"
            alt="warning icon"
          />
          <div>
            <h3 className="text-[20px] font-bold text-[#121212]">
              لا يمكنك الوصول لمحتوى الباقة دون تأكيد رقم ولي الأمر{" "}
            </h3>
          </div>
        </div>
        <div className="bg-gray-light mt-4 h-px w-full" />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
          }}
          className="bg-background border-primary-800 flex w-full flex-wrap items-center justify-center gap-6 rounded-lg border p-2 py-3 font-bold md:flex-nowrap md:py-8 md:text-[24px]"
        >
          <Image
            src="/assets/Whatsapp.svg"
            width={48}
            height={48}
            className="size-12"
            alt="whatsapp icon"
          />

          <span className="inline-block text-xl text-[#523412]">
            {" "}
            إذا قمت بتأكيد رقم هاتف ولي الأمر الآن سنقوم بإرسال رمز التأكيد
            للرقم المسجل لدينا عبر تطبيق واتساب.{" "}
          </span>
          <div className="relative -top-2 -right-5"> </div>
          {/* <p className="mr-4  text-[#523412] inline-block">من الكورس</p> */}
        </div>

        <DialogFooter className="mt-5 flex flex-row! justify-start! gap-5">
          <DialogClose asChild className="">
            <Button
              onClick={handleOtp}
              className="bg-primary border-gray-light w-[148px] rounded-lg border p-4 text-sm font-bold text-white"
            >
              تأكيد الرقم
            </Button>
          </DialogClose>

          <Link href={`/bundles/${SingleCourse}`}>
            <Button className="border-primary w-[148px] rounded-lg border bg-white p-4 text-sm font-bold text-[#121212] hover:bg-white">
              رجوع{" "}
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
