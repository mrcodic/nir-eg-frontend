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
    <div className={cn("space-y-1", className)}>
      <Label aria-invalid={couponState?.state === "error"}>كود الخصم</Label>
      <div className="flex items-center gap-4 sm:gap-6">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="grow w-full h-8 text-sm focus:outline-hidden ps-2"
          style={{ borderBottom: "1px solid #523412" }}
          aria-invalid={couponState?.state === "error"}
          placeholder="كود الخصم"
          disabled={loading}
        />
        <Button
          onClick={handleCouponSubmit}
          disabled={loading || !value}
          className="h-8 px-3 sm:px-6 text-sm sm:text-base bg-primary-800 rounded-lg max-w-[70px] sm:max-w-[104px] w-full"
        >
          {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          تأكيد
        </Button>
      </div>

      {couponState?.state && (
        <p
          className={`text-xs ${
            couponState.state === "success" ? "text-green-500" : "text-red-500"
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
  );
}

export default PaymentCoupon;
