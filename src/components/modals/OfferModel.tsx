"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import useCoupon from "@/hooks/useCoupon";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const OfferModel = () => {
  const { toast } = useToast();
  const modal = useModal();
  const { data, discountValue, isLoading, showCoupon } = useCoupon();

  useEffect(() => {
    if (!showCoupon && !isLoading) {
      modal.closeModal();
    }
  }, [showCoupon, isLoading, modal]);

  if (isLoading) {
    return (
      <div className="flex size-full min-h-[400px] items-center justify-center">
        <FaSpinner className="text-primary-800 size-10 animate-spin" />
      </div>
    );
  }

  if (!showCoupon) return null;

  return (
    <div>
      <Image
        src={data?.icon_url || "/assets/gifs/sale-gif.gif"}
        alt="offer"
        width={160}
        height={160}
        className="mx-auto"
      />

      <div className="mx-auto mt-4 max-w-[343px]">
        <div className="relative flex items-center gap-6 rounded-t-lg bg-[#1EAD7B] px-4 pt-14 pb-7">
          <div className="absolute inset-x-0 top-0 z-10 flex w-full justify-center gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="size-8 -translate-y-1/2 rounded-full bg-white"
                />
              ))}
          </div>

          <Image
            src="/assets/gifs/percentage.gif"
            alt="percentage"
            width={72}
            height={72}
          />

          <div className="flex flex-col">
            <p className="text-lg font-medium text-[#FBF6F0]">
              حتى {data?.end_date}
            </p>
            <p className="text-32 animate-promo-rotate-shake w-fit font-bold break-all text-white uppercase">
              {data?.code}
            </p>
          </div>
        </div>

        <div className="bg-background relative px-4 py-7">
          <hr className="absolute inset-x-0 -top-0.5 border-t-[6px] border-dashed border-black" />

          <div className="flex flex-col">
            <p className="text-xl font-bold text-black">
              احصل على خصم {discountValue}
            </p>
            <p className="font-medium text-black">
              {data?.description || `خصم ${discountValue} على الكورس`}
            </p>
          </div>

          <DialogFooter className="mx-auto mt-5 grid grid-cols-1 justify-center gap-5 sm:grid-cols-2">
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(data?.code);
                  toast({
                    icon: "success",
                    description: "تم نسخ الكود",
                  });
                } catch (e) {
                  toast({
                    icon: "error",
                    description: "حصل خطأ اثناء نسخ الكود",
                  });
                }
              }}
              className="bg-primary border-gray-light w-full rounded-lg border p-2 text-sm font-bold text-white sm:w-[148px]"
            >
              نسخ الكود
            </Button>
            <DialogClose asChild>
              <Button className="border-primary w-full rounded-lg border bg-white p-2 text-sm font-bold text-black hover:text-white sm:w-[148px]">
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
};

export default OfferModel;
