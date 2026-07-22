"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaymentFormData } from "@/lib/schemas/subscribe.schema";
import { previewOnboardingCoupon } from "@/services/onboarding.service";
import type { CouponPreviewResponse } from "@/types/onboarding.types";
import type { PaymentPeriod } from "@/types/subscribe.types";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

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

  const displayCouponError = (message: string) => {
    setCouponError(message);
    toast.error(message);
  };

  const couponPreviewMutation = useMutation({
    mutationFn: previewOnboardingCoupon,
    onSuccess: (couponPreview) => {
      form.setValue("coupon_code", couponCode.trim());
      setCouponError("");
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
  });

  const checkCoupon = () => {
    const normalizedCouponCode = couponCode.trim();
    if (!normalizedCouponCode) return;

    form.setValue("coupon_code", undefined);
    onCouponRemoved();
    couponPreviewMutation.mutate({
      couponCode: normalizedCouponCode,
      planId,
      paymentPeriod,
    });
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
          aria-describedby={couponError ? "coupon-code-error" : undefined}
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
        <p id="coupon-code-error" role="alert" className="text-sm text-red-600">
          {couponError}
        </p>
      ) : null}
    </div>
  );
}
