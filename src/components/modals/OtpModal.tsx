"use client";

import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useModal } from "@/context/ModalProvider";
import OtpVerifyForm from "@/modules/auth/components/OtpVerifyForm";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OtpModal({ phone }: { phone: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const modal = useModal();

  const handleSuccess = async () => {
    queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
    modal.closeModal();
    router.refresh();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex gap-2">
        <Image
          src="/assets/icons/LockColor.svg"
          width={32}
          height={32}
          className="size-8"
          alt="otp modal icon"
        />
        <div>
          <h3 className="text-[20px] font-bold text-black">تأكيد رقم الهاتف</h3>
          <p className="text-gray-dark mt-1 text-base font-medium">
            سنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي
          </p>
          <span className="inline-block font-bold text-black" dir="ltr">
            {phone}
          </span>
        </div>
      </div>

      <div className="bg-gray-light mt-4 h-px w-full" />

      <OtpVerifyForm
        phone={phone}
        onSuccess={handleSuccess}
        footer={({ isSubmitting, isStart }) => (
          <DialogFooter className="mt-16 flex w-full items-center justify-start gap-6">
            <Button
              type="submit"
              disabled={!isStart || isSubmitting}
              className="bg-primary-800 border-gray-light h-8 w-36 rounded-lg border font-bold text-white"
            >
              {isSubmitting ? <SmallSpinner className="text-white" /> : "تأكيد"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={modal.closeModal}
                className="h-8 w-36 rounded-lg border bg-white font-bold text-black hover:text-white"
              >
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      />
    </div>
  );
}
