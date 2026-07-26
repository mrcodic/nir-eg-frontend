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

export type PaymentPricingPreview = {
  billing_period: "month" | "year";
  chargeable_days: number | null;
  currency: string;
  full_period_price: number;
  is_prorated: boolean;
  monthly_equivalent: number;
  next_renewal_at: string;
  payable_price: number;
  period_end: string;
  period_start: string;
  plan: {
    id: number;
    name: string;
  };
  total_days: number | null;
  type: PaymentPeriod;
  yearly_saving_amount: number;
  yearly_saving_percent: number;
};

export type IPaymentOption = {
  description: string;
  enabled: boolean;
  icons: string[];
  label: string;
  value: string;
};
