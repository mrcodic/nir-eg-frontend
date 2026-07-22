import { axiosInstance } from "@/lib/axios-instance";
import type {
  CouponPreviewRequest,
  CouponPreviewResponse,
} from "@/types/onboarding.types";

export async function previewOnboardingCoupon({
  couponCode,
  planId,
  paymentPeriod,
}: CouponPreviewRequest): Promise<CouponPreviewResponse> {
  const response = await axiosInstance.post<CouponPreviewResponse>(
    "/onboarding/coupon/preview",
    {
      coupon_code: couponCode,
      plan_id: planId,
      payment_period: paymentPeriod,
    },
  );

  return response.data;
}
