"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PricingResponse } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";
import PaymentWhatsappLink from "./PaymentWhatsappLink";

const initialState = {
  message: "",
  state: "",
};

function PaymentCoupon({
  coupon,
  setCoupon,
  courseId,
  bookId,
  isSingleBook,
  className,
}: {
  coupon: PricingResponse;
  setCoupon: (coupon: PricingResponse) => void;
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
      setCouponState({ message: "ادخل كود الخصم", state: "error" });
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
      const res = await axios.post("/api?url=students/promo/price", body);

      if (res.status !== 200) {
        setCouponState({ message: "حدث خطأ", state: "error" });
        return;
      }

      console.log("🚀 ~ res post coupon : ", res);

      setCoupon(res?.data?.data);
      setCouponState({ message: "تم تطبيق الكوبون بنجاح", state: "success" });
    } catch (error) {
      console.log("😂 Error in apply coupon", error);

      toast({
        description: error?.response?.data?.error.message || "حدث خطأ ما",
        icon: "error",
      });
      setCouponState({
        message: error?.response?.data?.error.message || "حدث خطأ ما",
        state: "error",
      });
      setCoupon(null);
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
            className="grow w-full h-11 text-sm focus:outline-hidden ps-2 border border-gray-light"
            aria-invalid={couponState?.state === "error"}
            placeholder="أدخل الكود"
            disabled={loading}
          />
          <Button
            onClick={handleCouponSubmit}
            disabled={loading || !value}
            className="h-11 px-3 sm:px-6 text-sm sm:text-base bg-primary-800 rounded-lg max-w-[70px] sm:max-w-[104px] w-full"
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
            {couponState.state === "success" &&
              `حصلت على خصم  ${
                coupon?.promo?.type_discount === 1
                  ? `${coupon?.promo?.value}%`
                  : `${coupon?.promo?.value} جنيه`
              }`}
          </p>
        )}
      </div>

      <PaymentWhatsappLink />

      <div className="relative text-center  text-primary-800  text-base font-medium">
        <hr className="border-primary-800 absolute top-1/2 inset-x-0 -translate-y-1/2 mx-4 sm:mx-20" />
        <span className="px-8 bg-white relative z-5">او</span>
      </div>
    </div>
  );
}

export default PaymentCoupon;
