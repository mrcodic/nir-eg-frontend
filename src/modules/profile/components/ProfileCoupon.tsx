"use client";

import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/CustomImage";
import { useToast } from "@/hooks/use-toast";
import useCoupon from "@/hooks/useCoupon";
import { CheckCheck, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function ProfileCoupon() {
  const { toast } = useToast();
  const { data, isLoading, error, discountValue } = useCoupon();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isCopied]);

  if (isLoading || !data || error) return null;

  return (
    <div className="flex max-sm:flex-col md:ms-auto">
      <div className="relative flex flex-col items-center justify-center bg-[#1EAD7B] p-4 max-sm:rounded-t-lg max-sm:pt-6 sm:rounded-r-lg sm:ps-8">
        <div className="absolute top-0 z-10 flex h-full justify-center gap-1.5 max-sm:inset-x-0 sm:inset-y-0 sm:right-0 sm:flex-col">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-background size-6 shrink-0 rounded-full max-sm:-translate-y-1/2 sm:translate-x-1/2"
              />
            ))}
        </div>

        <Image
          className="size-8"
          src="/assets/gifs/percentage.gif"
          width={32}
          height={32}
          alt="percentage"
          fetchPriority="high"
          priority
        />

        <p className="text-center text-sm font-bold text-white">
          حتى {data?.end_date}
        </p>
      </div>

      <div className="relative flex flex-wrap items-end gap-4 bg-white px-4 py-2 max-sm:flex-col max-sm:items-center max-sm:justify-center sm:justify-between lg:ms-auto">
        <div className="absolute top-0 border-dashed border-black max-sm:inset-x-0 max-sm:border-t-4 sm:inset-y-0 sm:-right-0.5 sm:h-full sm:border-r-4" />

        <div className="flex items-center gap-4 rounded-lg p-2 max-sm:flex-col">
          <CustomImage
            className="size-16"
            src={data?.icon_url || "/assets/gifs/percentage.gif"}
            fallback="/assets/gifs/percentage.gif"
            width={64}
            height={64}
            alt="percentage"
            fetchPriority="high"
            priority
          />

          <div>
            <p className="font-bold text-[#232027]">
              احصل على خصم {discountValue}
            </p>
            <p className="text-gray-dark text-sm font-medium">
              {data?.description || `خصم ${discountValue} على الكورس`}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2 sm:ms-auto sm:gap-4">
          <p className="animate-promo-rotate-shake w-fit rounded-lg bg-[#1EAD7B] px-2 py-1 text-center font-bold break-all text-white uppercase">
            {data?.code}
          </p>

          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(data?.code);
                setIsCopied(true);
                toast({
                  description: "تم النسخ",
                  icon: "success",
                });
              } catch (err) {
                console.error("Failed to copy:", err);
                toast({
                  description: "لم يتم النسخ",
                  icon: "error",
                });
              }
            }}
            className="bg-primary border-gray-light ms-auto size-8 rounded-lg border text-sm font-bold"
            size="icon"
          >
            {isCopied ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCoupon;
