import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Label } from "@/components/ui/label";
import PriceBubbles from "@/components/ui/price-bubble";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/context/StoreProvider";
import { useTenant } from "@/context/TenantProvider";
import { useAuthContext } from "@/context/auth-context";
import PaymentCoupon from "@/modules/payment/components/PaymentCoupon";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { paymentType } from "@/types";
import { StoreItem } from "@/types/store.types";
import { getCartPaymentCapabilities } from "@/utils/get-cart-payment-capabilities";
import Image from "next/image";
import { useMemo } from "react";
import { StorePaymentsState } from "../hooks/useStorePayments";
import CartCheckoutPriceDetails from "./CartCheckoutPriceDetails";
import CartPaymentAvailabilityNotice from "./CartPaymentAvailabilityNotice";

type StorePaymentUIProps = {
  payment: StorePaymentsState;
  item?: StoreItem;
};

export function StorePaymentUI({ payment, item }: StorePaymentUIProps) {
  const { getTotalPrice, isLoading: isLoadingCart, items } = useCartStore();
  const { features } = useTenant();
  const { profile } = useAuthContext();
  const isSingleItem = !!item;
  const totalPrice = item ? Number(item.price) : getTotalPrice();
  const paymentCapabilities = useMemo(
    () =>
      getCartPaymentCapabilities(
        item ? [item] : items,
        !!features?.points_system,
      ),
    [features?.points_system, item, items],
  );
  const couponSupported =
    paymentCapabilities.cashSupported && paymentCapabilities.couponSupported;
  const hasPaymentMethods = payment.paymentTypes.length > 0;

  return (
    <>
      {payment.loading && (
        <div className="absolute top-0 left-0 z-30 h-full w-full bg-black/40">
          <LoadingSpinner className="min-h-0" />
        </div>
      )}

      <div className={isSingleItem ? "mb-4" : "mb-10"}>
        {item && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold sm:text-xl">{item.name}</h4>

            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="font-bold text-black">
                {payment.paymentMethodValue === "POINTS"
                  ? "السعر بالنقاط"
                  : "السعر"}
              </h5>
              {payment.paymentMethodValue === "POINTS" ? (
                <div className="text-secondary text-lg font-bold">
                  {payment.totalPointsPrice} نقطة
                </div>
              ) : payment.coupon?.promo?.value ? (
                <>
                  <PriceBadge
                    className="ms-auto"
                    price={payment.coupon.base_price}
                    variant="crossed"
                  />
                  <PriceBadge
                    price={payment.coupon.final_price}
                    variant="discount"
                  />
                </>
              ) : (
                <PriceBubbles price={totalPrice} />
              )}
            </div>
          </div>
        )}

        {hasPaymentMethods &&
          couponSupported &&
          payment.paymentMethodValue !== "POINTS" && (
            <PaymentCoupon
              coupon={payment.coupon}
              setCoupon={payment.setCoupon}
              itemId={item?.id}
              className={isSingleItem ? "mt-2" : "mb-4"}
            />
          )}

        {!isSingleItem && payment.paymentNotice && (
          <CartPaymentAvailabilityNotice notice={payment.paymentNotice} />
        )}

        {!isSingleItem &&
          !payment.checkoutBlocked &&
          (payment.paymentMethodValue === "POINTS" ? (
            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="text-sm font-bold text-black">
                إجمالي النقاط المطلوبة
              </h5>
              <div className="text-secondary text-lg font-bold">
                {payment.totalPointsPrice} نقطة
              </div>
            </div>
          ) : (
            <CartCheckoutPriceDetails coupon={payment.coupon} />
          ))}
      </div>

      {!isLoadingCart &&
        payment.paymentMethodValue === paymentType.fawerypay && (
          <p className="mb-3 text-xs leading-6 font-bold text-red-600">
            <Image
              src="/assets/icons/WarningColor.svg"
              width={16}
              height={16}
              alt="تنبيه"
              className="ml-2 inline-block"
            />
            بعد ما تضغط &quot;التالي&quot;، هيتعرضلك كود الدفع. خده وادفعه في
            أقرب فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه
            هتتفتح, مع العلم ان صلاحية الكود 7 ايام.
          </p>
        )}

      {payment.paymentMethodValue === "POINTS" && !payment.hasEnoughPoints && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
          رصيد نقاطك غير كافٍ لإتمام عملية الشراء (رصيدك الحالي:{" "}
          {profile?.points || 0}
          نقطة).
        </p>
      )}

      {isLoadingCart ? (
        <div className="space-y-5">
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          {payment.paymentMethodValue !== paymentType.code && (
            <Skeleton className="bg-background h-12.5 rounded-xl" />
          )}
        </div>
      ) : hasPaymentMethods ? (
        <RadioGroup
          value={payment.paymentMethodValue ?? undefined}
          disabled={payment.checkoutBlocked}
          onValueChange={(value) =>
            payment.setPaymentMethodValue(value as paymentType | "POINTS")
          }
          dir="rtl"
          className="gap-5"
        >
          {payment.paymentTypes.map((paymentOption) => (
            <div
              key={paymentOption.value}
              className="flex flex-col gap-6 text-right"
            >
              <Label
                htmlFor={paymentOption.value}
                className={`relative flex overflow-hidden ${
                  payment.paymentMethodValue === paymentOption.value
                    ? "border-primary"
                    : "border-gray-light"
                } ${
                  payment.checkoutBlocked
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } bg-background items-center gap-2.5 rounded-lg border-2 p-2`}
              >
                <RadioGroupItem
                  value={paymentOption.value}
                  id={paymentOption.value}
                  disabled={payment.checkoutBlocked}
                />
                <Label
                  className="flex w-full items-center gap-6"
                  htmlFor={paymentOption.value}
                >
                  {paymentOption.icons.map((icon) => (
                    <Image
                      key={icon}
                      src={icon}
                      height={32}
                      width={96}
                      className="h-8 w-fit min-w-fit"
                      alt="payment option icon"
                    />
                  ))}
                  {paymentOption.label && (
                    <span className="font-bold text-black">
                      {paymentOption.label}
                    </span>
                  )}
                </Label>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <span className="mb-2 text-sm font-bold text-red-600">
          لا يوجد طرق دفع متاحة
        </span>
      )}
    </>
  );
}
