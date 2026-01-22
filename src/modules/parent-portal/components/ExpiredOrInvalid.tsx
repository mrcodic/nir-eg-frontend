"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
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
      const res = await axios.post("/api?url=parent/request-new-link", {
        token,
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
        className="sm:w-[467px] sm:h-[344px] w-[267px] h-[244px] mx-auto"
        src="/Animations/invalid.json"
        autoplay
        loop
      />
      <h1 className="text-[32px] font-bold mt-16 text-center">
        {token ? "هذا الرابط غير متاح حاليًا" : "لا يمكن الحصول على بياناتك"}
      </h1>

      <p className="text-xl font-bold max-w-xl text-center mt-4">
        {token
          ? "الرابط الذي تحاول الوصول إليه لم يعد متاح حاليًا، اضغط هنا ليتم إرسال رسالة نصية SMS تحتوي على الرابط الجديد"
          : ""}
      </p>

      <div className="flex items-center gap-4 flex-wrap justify-center  mt-8">
        {token ? (
          <button
            onClick={handleSendNewLink}
            className="w-full md:w-[189px] bg-colorPrimary h-10 text-lg font-bold text-white rounded-lg border flex items-center justify-center gap-1 border-[#D9B45C] py-0 disabled:opacity-80"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="animate-spin size-4" />}
            إرسال رسالة نصية
          </button>
        ) : (
          <Link
            href="/"
            className="w-full flex items-center justify-center md:w-[189px] bg-colorPrimary h-10 text-lg font-bold text-white rounded-lg border border-[#D9B45C] py-0"
          >
            الرجوع للرئيسية
          </Link>
        )}
        <Link
          href={`http://t.me/More_english_support?text=محتاج مساعدة لو سمحت`}
          target="_blank"
        >
          <Button className="w-full bg-[#D9B45C]  h-10 text-lg font-bold text-white rounded-lg border flex items-center justify-center gap-1 py-0 ">
            تواصل مع الدعم الفني
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ExpiredOrInvalid;
