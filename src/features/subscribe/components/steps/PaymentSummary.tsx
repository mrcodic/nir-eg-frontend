import Empty from "@/components/Empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { CouponPreviewResponse } from "@/types/onboarding.types";
import type { PaymentPeriod } from "@/types/subscribe.types";
import { priceFormatter } from "@/utils/formatters";
import { usePaymentPricing } from "../../hooks";

type PaymentSummaryProps = {
  planId: number;
  paymentPeriod: PaymentPeriod;
  couponPreview: CouponPreviewResponse | null;
};

export default function PaymentSummary({
  planId,
  paymentPeriod,
  couponPreview,
}: PaymentSummaryProps) {
  const {
    data: paymentPricing,
    isError,
    isLoading,
  } = usePaymentPricing({ planId, paymentPeriod });

  if (isLoading) return <Skeleton className="h-32 w-full bg-blue-gradient" />;

  if (isError || !paymentPricing)
    return (
      <Empty
        text="حدث خطأ أثناء عرض تفاصيل الاسعار"
        isError
        iconClassName="size-20"
        textClassName="md:text-lg"
      />
    );

  const isMonthlyPricing = paymentPricing.billing_period === "month";
  const priceBeforeCoupon = paymentPricing.payable_price;
  const couponDiscountValue = couponPreview?.discount_value ?? 0;
  const hasAppliedCouponDiscount = couponDiscountValue > 0;
  const priceAfterCoupon = couponPreview?.final_price ?? priceBeforeCoupon;
  const couponDiscountAmount = priceBeforeCoupon - priceAfterCoupon;
  const couponDiscountLabel = couponPreview
    ? couponPreview.discount_type === "percent"
      ? `${couponDiscountValue}% (${priceFormatter.format(couponDiscountAmount)} جنية)`
      : `${priceFormatter.format(couponDiscountValue)} جنية`
    : null;
  const showsProratedMonthlyPrice =
    isMonthlyPricing &&
    paymentPricing.is_prorated &&
    paymentPricing.chargeable_days !== null;

  return (
    <div className="p-4 bg-blue-gradient rounded-lg border border-primary-100 space-y-2">
      {showsProratedMonthlyPrice ? (
        <div className="flex justify-between items-center flex-wrap">
          <span className="text-white font-bold sm:text-sm text-xs">
            سعر الاشتراك الشهري
          </span>
          <span className="sm:text-lg text-base font-bold text-white">
            {priceFormatter.format(paymentPricing.full_period_price)} جنية
          </span>
        </div>
      ) : null}

      {hasAppliedCouponDiscount && (
        <div className="flex justify-between items-center flex-wrap">
          <span className="text-white font-bold sm:text-sm text-xs">
            قبل الخصم
          </span>
          <span className="sm:text-lg text-base font-bold text-white">
            {priceFormatter.format(priceBeforeCoupon)} جنية
          </span>
        </div>
      )}

      {hasAppliedCouponDiscount && (
        <div className="flex justify-between items-center flex-wrap">
          <span className="text-white font-bold sm:text-sm text-xs">
            خصم الكوبون
          </span>
          <span className="sm:text-lg text-base font-bold text-white">
            {couponDiscountLabel}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap">
        <span className="text-white font-bold sm:text-base text-sm">
          إجمالي المبلغ
        </span>
        <span className="sm:text-2xl text-xl font-bold text-secondary">
          {priceFormatter.format(priceAfterCoupon)} جنية
          <span className="sm:text-base text-sm ms-1 text-white">
            / {isMonthlyPricing ? "شهر" : "سنة"}
          </span>
        </span>
      </div>

      {showsProratedMonthlyPrice && paymentPricing.chargeable_days ? (
        <p className="text-xs text-white/75">
          اشتراكك يغطي {paymentPricing.chargeable_days}{" "}
          {paymentPricing.chargeable_days === 1 ||
          paymentPricing.chargeable_days > 11
            ? "يوم"
            : "أيام"}{" "}
          متبقية من الشهر الحالي.
        </p>
      ) : null}

      <div className="flex justify-between items-center gap-2 flex-wrap">
        <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
          وفر {paymentPricing.yearly_saving_percent}% مع الدفع السنوي!{" "}
          <span className="text-white line-through ms-2">
            {priceFormatter.format(paymentPricing.yearly_saving_amount)} جنية
          </span>
        </p>
        {!isMonthlyPricing ? (
          <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
            <span className="sm:text-sm text-xs font-bold text-white">
              {priceFormatter.format(paymentPricing.monthly_equivalent)} جنية
              <span className="sm:text-10 text-[8px] ms-1 text-white">
                / شهر
              </span>
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
