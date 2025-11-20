"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useCoupon from "@/hooks/useCoupon";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";

interface PaymentModalProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const OfferModel: React.FC<PaymentModalProps> = ({ open, setOpen }) => {
  const { toast } = useToast();
  const { data, discountValue } = useCoupon();

  if (!data) return null;

  return (
    <>
      {open && (
        <DotLottieReact
          className="w-full h-screen! mx-auto fixed top-0 right-0  z-9999999999! "
          src="/Animations/Celeberation.json"
          autoplay
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[466px] p-6 ">
          <Image
            src={data?.icon_url || "/assets/sale-gif.gif"}
            alt="offer"
            width={160}
            height={160}
            className="mx-auto"
          />

          <div className="max-w-[343px] mx-auto">
            <div className="bg-[#1EAD7B] relative flex items-center gap-6 rounded-t-lg px-4 pb-7 pt-14 ">
              <div className="absolute top-0 z-10 inset-x-0 w-full flex gap-4 justify-center ">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="size-8 bg-white rounded-full -translate-y-1/2"
                    />
                  ))}
              </div>

              <Image
                src="/percentage.gif"
                alt="percentage"
                width={72}
                height={72}
              />

              <div className="flex flex-col">
                <p className="text-lg font-medium text-[#FBF6F0]">
                  حتى {data?.end_date}
                </p>
                <p className="text-[32px] font-bold text-white animate-promo-rotate-shake w-fit uppercase break-all">
                  {data?.code}
                </p>
              </div>
            </div>

            <div className="bg-background px-4 py-7 relative">
              <hr className="border-dashed border-t-[6px] border-black absolute -top-0.5 inset-x-0" />

              <div className="flex flex-col ">
                <p className="text-xl font-bold text-[#121212]">
                  احصل على خصم {discountValue}
                </p>
                <p className="text-[#121212] font-medium">
                  {data?.description || `خصم ${discountValue} على الكورس`}
                </p>
              </div>

              <DialogFooter className="flex flex-row! justify-between gap-5 mt-5 mx-auto">
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
                  className="bg-primary border border-primary-700 rounded-lg w-[148px] text-sm font-bold p-2 text-white"
                >
                  نسخ الكود
                </Button>
                <DialogClose asChild>
                  <Button className="border border-primary hover:text-white rounded-lg w-[148px] bg-white text-sm font-bold p-2 text-[#121212]">
                    إلغاء
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfferModel;
