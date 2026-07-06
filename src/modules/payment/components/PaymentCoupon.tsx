"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PricingResponse } from "@/types";
import { Loader } from "lucide-react";
import { useState } from "react";

const initialState = {
  message: "",
  state: "",
};

function PaymentCoupon({
  coupon,
  setCoupon,
  courseId,
  itemId,
  className,
}: {
  coupon: PricingResponse;
  setCoupon: (coupon: PricingResponse) => void;
  courseId?: string;
  itemId?: string | number;
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

      if (itemId) {
        Object.assign(body, { book_id: itemId });
      } else if (courseId) {
        Object.assign(body, { classroom_id: courseId });
      }
      const res = await mutateClient("/students/promo/price", { body });

      console.log(res);

      if (!res.status) {
        setCouponState({ message: "حدث خطأ", state: "error" });
        return;
      }

      console.log("🚀 ~ res post coupon : ", res);

      setCoupon(res?.data);
      setCouponState({ message: "تم تطبيق الكوبون بنجاح", state: "success" });
    } catch (error) {
      console.log("😂 Error in apply coupon", error);

      toast({
        description:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "حدث خطأ ما",
        icon: "error",
      });
      setCouponState({
        message:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "حدث خطأ ما",
        state: "error",
      });
      setCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("", className)}>
      <Label
        aria-invalid={couponState?.state === "error"}
        className="mb-1 w-full"
      >
        كود الخصم
      </Label>

      <div className="mt-1! flex items-center gap-4 sm:gap-6">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-full grow ps-2 text-sm focus:outline-none"
          aria-invalid={couponState?.state === "error"}
          placeholder=" ادخل كود الخصم"
          disabled={loading}
        />
        <Button
          onClick={handleCouponSubmit}
          disabled={loading || !value}
          className="h-11 w-full max-w-[70px] rounded-lg px-3 text-sm sm:max-w-[104px] sm:px-6 sm:text-base"
        >
          {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          تأكيد
        </Button>
      </div>

      {couponState?.state && (
        <p
          className={`mt-1 text-xs ${
            couponState.state === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {couponState.message}{" "}
          {couponState.state === "success" &&
            `حصلت على خصم  ${
              coupon?.promo?.type_discount === 1
                ? `${coupon?.promo?.value}% `
                : `${coupon?.promo?.value} جنيه `
            }`}
          {coupon?.final_price &&
            ` -  السعر النهائي ${coupon?.final_price} جنيه`}
        </p>
      )}
    </div>
  );
}

export default PaymentCoupon;
