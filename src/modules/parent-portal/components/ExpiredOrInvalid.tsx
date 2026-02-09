"use client";

import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function ExpiredOrInvalid({
  token,
  className,
}: {
  token?: string | null;
  className?: string;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNewLink = async () => {
    try {
      setIsLoading(true);
      await mutateClient("/parent/request-new-link", {
        body: {
          token,
        },
      });

      toast({
        icon: "success",
        description: "تم إرسال رابط جديد إلى رقمك",
      });
    } catch (error) {
      console.log(error);
      toast({
        icon: "error",
        description:
          error?.response?.data?.error?.message ||
          "حدث خطأ أثناء إرسال رابط جديد",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <DotLottieReact
        className="mx-auto h-[244px] w-[267px] sm:h-[344px] sm:w-[467px]"
        src="/Animations/invalid.json"
        autoplay
        loop
      />
      <h1 className="mt-16 text-center text-[32px] font-bold">
        {token ? "هذا الرابط غير متاح حاليًا" : "لا يمكن الحصول على بياناتك"}
      </h1>

      <p className="mt-4 max-w-xl text-center text-xl font-bold">
        {token
          ? "الرابط الذي تحاول الوصول إليه لم يعد متاح حاليًا، اضغط هنا ليتم إرسال رسالة نصية SMS تحتوي على الرابط الجديد"
          : ""}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {token ? (
          <button
            onClick={handleSendNewLink}
            className="bg-secondary flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[#D9B45C] py-0 text-lg font-bold text-white disabled:opacity-80 md:w-[189px]"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            إرسال رسالة نصية
          </button>
        ) : (
          <Link
            href="/"
            className="bg-secondary flex h-10 w-full items-center justify-center rounded-lg border border-[#D9B45C] py-0 text-lg font-bold text-white md:w-[189px]"
          >
            الرجوع للرئيسية
          </Link>
        )}

        {/* <Link
          href={`http://t.me/More_english_support?text=محتاج مساعدة لو سمحت`}
          target="_blank"
        >
          <Button className="flex h-10 w-full items-center justify-center gap-1 rounded-lg border bg-[#D9B45C] py-0 text-lg font-bold text-white">
            تواصل مع الدعم الفني
          </Button>
        </Link> */}
      </div>
    </div>
  );
}

export default ExpiredOrInvalid;
