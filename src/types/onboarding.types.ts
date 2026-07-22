import type { PaymentPeriod } from "@/types/subscribe.types";

export type CouponPreviewRequest = {
  couponCode: string;
  planId: number;
  paymentPeriod: PaymentPeriod;
};

export type CouponDiscountType = "percent" | "fixed";

export type CouponPreviewResponse = {
  discount_value: number;
  discount_type: CouponDiscountType;
  final_price: number;
};
