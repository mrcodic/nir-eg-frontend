import type { CouponPreviewResponse } from "@/types/onboarding.types";
import type { IPricingPlan } from "@/types/pricing-api.types";
import type { PaymentPeriod } from "@/types/subscribe.types";
import { priceFormatter } from "@/utils/formatters";

type PaymentSummaryProps = {
  plan: IPricingPlan;
  paymentPeriod: PaymentPeriod;
  couponPreview: CouponPreviewResponse | null;
};

export default function PaymentSummary({
  plan,
  paymentPeriod,
  couponPreview,
}: PaymentSummaryProps) {
  const yearlyDiscount = Math.min(
    Number(
      (
        ((plan.price_month * 12 - plan.price_year) / (plan.price_month * 12)) *
        100
      ).toFixed(0),
    ),
    100,
  );

  const planPrice =
    paymentPeriod === "monthly" ? plan.price_month : plan.price_year;
  const totalAmount = couponPreview?.final_price ?? planPrice;
  const hasCouponDiscount = (couponPreview?.discount_value ?? 0) > 0;
  const couponDiscount = couponPreview
    ? couponPreview.discount_type === "percent"
      ? `${couponPreview.discount_value}%`
      : `${priceFormatter.format(couponPreview.discount_value)} جنية`
    : null;

  return (
    <div className="p-4 bg-blue-gradient rounded-lg border border-primary-100 space-y-2">
      {hasCouponDiscount && (
        <div className="flex justify-between items-center flex-wrap">
          <span className="text-white font-bold sm:text-sm text-xs">
            قبل الخصم
          </span>

          <span className="sm:text-xl text-lg font-bold text-white">
            {priceFormatter.format(planPrice)} جنية
          </span>
        </div>
      )}
      {hasCouponDiscount && (
        <div className="flex justify-between items-center flex-wrap">
          <span className="text-white font-bold sm:text-sm text-xs">
            خصم الكوبون
          </span>

          <span className="sm:text-xl text-lg font-bold text-white">
            {couponDiscount}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center flex-wrap">
        <span className="text-white font-bold sm:text-base text-sm">
          إجمالي المبلغ
        </span>

        <span className="sm:text-2xl text-xl font-bold text-secondary">
          {priceFormatter.format(totalAmount)} جنية
          <span className="sm:text-base text-sm ms-1 text-white">
            / {paymentPeriod === "monthly" ? "شهر" : "سنة"}
          </span>
        </span>
      </div>

      {paymentPeriod === "yearly" ? (
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
            وفر {yearlyDiscount}% مع الدفع السنوي!{" "}
            <span className="text-white line-through ms-2">
              {priceFormatter.format(plan.price_month * 12 - plan.price_year)}{" "}
              جنية
            </span>
          </p>
          <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
            <span className="sm:text-sm text-xs font-bold text-white">
              {priceFormatter.format(plan.price_year / 12)} جنية
              <span className="sm:text-10 text-[8px] ms-1 text-white">
                / شهر
              </span>
            </span>
          </p>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
            وفر {yearlyDiscount}% مع الدفع السنوي!
          </p>
          <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
            <span className="sm:text-sm text-xs font-bold text-white">
              {priceFormatter.format(plan.price_month * 12)} جنية
              <span className="sm:text-10 text-[8px] ms-1 text-white">
                / سنه
              </span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
