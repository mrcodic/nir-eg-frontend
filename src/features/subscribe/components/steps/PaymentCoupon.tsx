"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentFormData } from "@/lib/schemas/subscribe.schema";
import type { CouponPreviewResponse } from "@/types/onboarding.types";
import type { PaymentPeriod } from "@/types/subscribe.types";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useCouponPreview } from "../../hooks";

type PaymentCouponProps = {
  form: UseFormReturn<PaymentFormData>;
  planId: number;
  paymentPeriod: PaymentPeriod;
  onCouponApplied: (couponPreview: CouponPreviewResponse) => void;
  onCouponRemoved: () => void;
};

export default function PaymentCoupon({
  form,
  planId,
  paymentPeriod,
  onCouponApplied,
  onCouponRemoved,
}: PaymentCouponProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const couponPreviewMutation = useCouponPreview();

  const displayCouponError = (message: string) => {
    setCouponError(message);
    toast.error(message);
  };

  const checkCoupon = () => {
    const normalizedCouponCode = couponCode.trim();
    if (!normalizedCouponCode) return;

    setIsCouponApplied(false);

    form.setValue("coupon_code", undefined);

    onCouponRemoved();

    couponPreviewMutation.mutate(
      {
        couponCode: normalizedCouponCode,
        planId,
        paymentPeriod,
      },
      {
        onSuccess: (couponPreview) => {
          form.setValue("coupon_code", couponCode.trim());
          setCouponError("");
          setIsCouponApplied(true);
          onCouponApplied(couponPreview);
        },
        onError: (couponPreviewError) => {
          displayCouponError(
            isAxiosError(couponPreviewError) &&
              couponPreviewError?.response?.data?.message
              ? couponPreviewError?.response?.data?.message
              : "تعذر التحقق من كود الخصم. حاول مرة أخرى.",
          );
        },
      },
    );
  };

  const updateCouponCode = (couponCode: string) => {
    setCouponCode(couponCode);
    setCouponError("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon-code">كود الخصم</Label>
      <div className="flex gap-2">
        <Input
          id="coupon-code"
          value={couponCode}
          onChange={(event) => updateCouponCode(event.target.value)}
          placeholder="أدخل كود الخصم"
          disabled={couponPreviewMutation.isPending}
          aria-describedby={
            couponError
              ? "coupon-code-error"
              : isCouponApplied
                ? "coupon-code-success"
                : undefined
          }
          className={
            isCouponApplied
              ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500"
              : undefined
          }
        />
        <Button
          type="button"
          onClick={checkCoupon}
          disabled={!couponCode.trim() || couponPreviewMutation.isPending}
          className="shrink-0 h-11"
        >
          {couponPreviewMutation.isPending ? "جارٍ التحقق..." : "تفعيل"}
        </Button>
      </div>
      {couponError ? (
        <p
          id="coupon-code-error"
          role="alert"
          className="text-xs text-red-600 font-medium"
        >
          {couponError}
        </p>
      ) : isCouponApplied ? (
        <p
          id="coupon-code-success"
          role="status"
          className="text-xs text-green-600 font-medium"
        >
          تم تطبيق كود الخصم بنجاح.
        </p>
      ) : null}
    </div>
  );
}
