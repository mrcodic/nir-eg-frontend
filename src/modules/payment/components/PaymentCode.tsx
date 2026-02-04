"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";
import PaymentWhatsappLink from "./PaymentWhatsappLink";

const initialState = {
  message: "",
  state: "",
};

function PaymentCode({
  courseId,
  bookId,
  isSingleBook,
  className,
}: {
  courseId?: string;
  bookId?: string | number;
  isSingleBook?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponState, setCouponState] = useState(initialState);

  const handleCouponSubmit = async () => {
    if (!value) {
      setCouponState({ message: "ادخل كود الدفع", state: "error" });
      return;
    }
    setLoading(true);
    setCouponState(initialState);

    try {
      const body = {
        code: value,
      };

      if (bookId) {
        Object.assign(body, { book_id: bookId });
      } else if (courseId) {
        Object.assign(body, { classroom_id: courseId });
      }
      // TODO: post coupon to server here
      const res = await mutateClient("/students/promo/price", { body });

      if (res.status !== 200) {
        setCouponState({ message: "حدث خطأ", state: "error" });
        return;
      }

      console.log("🚀 ~ res post coupon : ", res);

      setCouponState({ message: "تم الدفع بنجاح", state: "success" });
    } catch (error) {
      console.log("😂 Error in payment code", error);

      toast({
        description: error?.response?.data?.error.message || "حدث خطأ ما",
        icon: "error",
      });
      setCouponState({
        message: error?.response?.data?.error.message || "حدث خطأ ما",
        state: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Label aria-invalid={couponState?.state === "error"}>الكود</Label>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4 sm:gap-6">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-gray-light h-11 w-full grow border ps-2 text-sm focus:outline-hidden"
            aria-invalid={couponState?.state === "error"}
            placeholder="أدخل كود الدفع"
            disabled={loading}
          />
          <Button
            onClick={handleCouponSubmit}
            disabled={loading || !value}
            className="bg-primary-800 h-11 w-full max-w-[70px] rounded-lg px-3 text-sm sm:max-w-[104px] sm:px-6 sm:text-base"
          >
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            ادخال
          </Button>
        </div>

        {couponState?.state && (
          <p
            className={`text-xs ${
              couponState.state === "success"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {couponState.message}{" "}
          </p>
        )}
      </div>

      <PaymentWhatsappLink />

      <div className="text-primary-800 relative text-center text-base font-medium">
        <hr className="border-primary-800 absolute inset-x-0 top-1/2 mx-4 -translate-y-1/2 sm:mx-20" />
        <span className="relative z-5 bg-white px-8">او</span>
      </div>
    </div>
  );
}

export default PaymentCode;
