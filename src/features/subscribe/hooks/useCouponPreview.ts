import { axiosInstance } from "@/lib/axios-instance";
import {
  CouponPreviewRequest,
  CouponPreviewResponse,
} from "@/types/onboarding.types";
import { useMutation } from "@tanstack/react-query";

export default function useCouponPreview() {
  return useMutation({
    mutationFn: async ({
      couponCode,
      planId,
      paymentPeriod,
    }: CouponPreviewRequest): Promise<CouponPreviewResponse> => {
      const response = await axiosInstance.post<CouponPreviewResponse>(
        "/onboarding/coupon/preview",
        {
          coupon_code: couponCode,
          plan_id: planId,
          payment_period: paymentPeriod,
        },
      );

      return response.data;
    },
  });
}
