// import type { CouponPreviewResponse } from "@/types/onboarding.types";
// import type { IPricingPlan } from "@/types/pricing-api.types";
// import type { PaymentPeriod } from "@/types/subscribe.types";
// import { priceFormatter } from "@/utils/formatters";
// import { getMonthlyProration } from "@/utils/get-monthly-proration";
// import { usePaymentPricing } from "../../hooks";

// type PaymentSummaryProps = {
//   plan: IPricingPlan;
//   paymentPeriod: PaymentPeriod;
//   couponPreview: CouponPreviewResponse | null;
// };

// export default function PaymentSummary({
//   plan,
//   paymentPeriod,
//   couponPreview,
// }: PaymentSummaryProps) {
//   const { data } = usePaymentPricing({
//     paymentPeriod,
//     planId: plan.id,
//   });
//   const isMonthlyPayment = paymentPeriod === "monthly";
//   const fullPeriodPrice = isMonthlyPayment ? plan.price_month : plan.price_year;
//   const monthlyProration = getMonthlyProration(plan.price_month, new Date());
//   const priceBeforeCoupon = isMonthlyPayment
//     ? monthlyProration.amount
//     : fullPeriodPrice;

//   const couponDiscountValue = couponPreview?.discount_value ?? 0;
//   const hasAppliedCouponDiscount = couponDiscountValue > 0;
//   const priceAfterCoupon = couponPreview?.final_price ?? priceBeforeCoupon;
//   const couponDiscountAmount = priceBeforeCoupon - priceAfterCoupon;
//   const couponDiscountLabel = couponPreview
//     ? couponPreview.discount_type === "percent"
//       ? `${couponDiscountValue}% (${priceFormatter.format(couponDiscountAmount)} جنية)`
//       : `${priceFormatter.format(couponDiscountValue)} جنية`
//     : null;

//   const showsProratedMonthlyPrice =
//     isMonthlyPayment && monthlyProration.isProrated;
//   const yearlyDiscount = Math.min(
//     Number(
//       (
//         ((plan.price_month * 12 - plan.price_year) / (plan.price_month * 12)) *
//         100
//       ).toFixed(0),
//     ),
//     100,
//   );

//   console.log(data);
//   return (
//     <div className="p-4 bg-blue-gradient rounded-lg border border-primary-100 space-y-2">
//       {showsProratedMonthlyPrice ? (
//         <div className="flex justify-between items-center flex-wrap">
//           <span className="text-white font-bold sm:text-sm text-xs">
//             سعر الاشتراك الشهري
//           </span>
//           <span className="sm:text-lg text-base font-bold text-white">
//             {priceFormatter.format(fullPeriodPrice)} جنية
//           </span>
//         </div>
//       ) : null}
//       {hasAppliedCouponDiscount && (
//         <div className="flex justify-between items-center flex-wrap">
//           <span className="text-white font-bold sm:text-sm text-xs">
//             قبل الخصم
//           </span>

//           <span className="sm:text-lg text-base font-bold text-white">
//             {priceFormatter.format(priceBeforeCoupon)} جنية
//           </span>
//         </div>
//       )}
//       {hasAppliedCouponDiscount && (
//         <div className="flex justify-between items-center flex-wrap">
//           <span className="text-white font-bold sm:text-sm text-xs">
//             خصم الكوبون
//           </span>

//           <span className="sm:text-lg text-base font-bold text-white">
//             {couponDiscountLabel}
//           </span>
//         </div>
//       )}
//       <div className="flex justify-between items-center flex-wrap">
//         <span className="text-white font-bold sm:text-base text-sm">
//           إجمالي المبلغ
//         </span>

//         <span className="sm:text-2xl text-xl font-bold text-secondary">
//           {priceFormatter.format(priceAfterCoupon)} جنية
//           <span className="sm:text-base text-sm ms-1 text-white">
//             / {paymentPeriod === "monthly" ? "شهر" : "سنة"}
//           </span>
//         </span>
//       </div>

//       {showsProratedMonthlyPrice ? (
//         <p className="text-xs text-white/75">
//           اشتراكك الحالي يغطي {monthlyProration.chargeableDays} أيام متبقية من
//           الشهر الحالي.
//         </p>
//       ) : null}

//       {paymentPeriod === "yearly" ? (
//         <div className="flex justify-between items-center gap-2 flex-wrap">
//           <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
//             وفر {yearlyDiscount}% مع الدفع السنوي!{" "}
//             <span className="text-white line-through ms-2">
//               {priceFormatter.format(plan.price_month * 12 - plan.price_year)}{" "}
//               جنية
//             </span>
//           </p>
//           <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
//             <span className="sm:text-sm text-xs font-bold text-white">
//               {priceFormatter.format(plan.price_year / 12)} جنية
//               <span className="sm:text-10 text-[8px] ms-1 text-white">
//                 / شهر
//               </span>
//             </span>
//           </p>
//         </div>
//       ) : (
//         <div className="flex justify-between items-center gap-2 flex-wrap">
//           <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
//             وفر {yearlyDiscount}% مع الدفع السنوي!
//           </p>
//           <p className="sm:text-lg text-xs text-green-400 font-bold mt-2">
//             <span className="sm:text-sm text-xs font-bold text-white">
//               {priceFormatter.format(plan.price_month * 12)} جنية
//               <span className="sm:text-10 text-[8px] ms-1 text-white">
//                 / سنه
//               </span>
//             </span>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
