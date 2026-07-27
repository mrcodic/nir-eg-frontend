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
import { CourseType, paymentType, PricingResponse } from "@/types";
import { StoreItem } from "@/types/store.types";
import Image from "next/image";
import React from "react";
import CartCheckoutPriceDetails from "./CartCheckoutPriceDetails";
import { MixedItemsPointsWarning } from "./MixedItemsPointsWarning";

interface PaymentUIProps {
  paymentMethodValue: paymentType | "POINTS" | null;
  setPaymentMethodValue: (value: paymentType | "POINTS" | null) => void;
  loading: boolean;
  paymentTypes: any[];
  price?: number;
  sale?: CourseType["sale"];
  coupon?: PricingResponse;
  setCoupon?: (coupon: PricingResponse) => void;
  isSingleItem?: boolean;
  item?: StoreItem;
  name?: string;
}

export const StorePaymentUI: React.FC<PaymentUIProps> = ({
  paymentMethodValue,
  setPaymentMethodValue,
  loading,
  paymentTypes,
  coupon,
  setCoupon,
  price,
  isSingleItem,
  item,
  name,
}) => {
  const { getTotalPrice, isLoading: isLoadingCart, items } = useCartStore();
  const { features } = useTenant();
  const { profile } = useAuthContext();

  const totalPrice = isSingleItem ? price : getTotalPrice() || 0;

  const hasPaymentMethods = paymentTypes.length > 0;

  const hasPointsEnabled = !!features?.points_system;
  const hasMixedPointsItems =
    hasPointsEnabled &&
    !isSingleItem &&
    items.some((i) => i.payment_type !== 1) &&
    items.some((i) => i.payment_type === 1);

  const totalPointsPrice = isSingleItem
    ? item?.points_price || 0
    : items.reduce(
        (sum, i) => sum + (i.points_price || 0) * (i.quantity || 1),
        0,
      );

  const hasEnoughPoints = (profile?.points || 0) >= totalPointsPrice;

  return (
    <>
      {loading && (
        <div className="absolute top-0 left-0 z-30 h-full w-full bg-black/40">
          <LoadingSpinner className="min-h-0" />
        </div>
      )}

      <div className={isSingleItem ? "mb-4" : "mb-10"}>
        {isSingleItem && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold sm:text-xl">{name}</h4>

            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="font-bold text-black">
                {paymentMethodValue === "POINTS" ? "السعر بالنقاط" : "السعر"}
              </h5>
              {paymentMethodValue === "POINTS" ? (
                <div className="text-secondary text-lg font-bold">
                  {totalPointsPrice} نقطة
                </div>
              ) : !!coupon?.promo?.value ? (
                <>
                  <PriceBadge
                    className="ms-auto"
                    price={coupon?.base_price}
                    variant={"crossed"}
                  />

                  <PriceBadge
                    price={coupon?.final_price}
                    variant={"discount"}
                  />
                </>
              ) : (
                <PriceBubbles price={totalPrice} />
              )}
            </div>
          </div>
        )}

        {hasPaymentMethods && paymentMethodValue !== "POINTS" && (
          <PaymentCoupon
            coupon={coupon}
            setCoupon={setCoupon}
            itemId={isSingleItem && item?.id}
            className={isSingleItem ? "mt-2" : "mb-4"}
          />
        )}

        {!isSingleItem &&
          (paymentMethodValue === "POINTS" ? (
            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="text-sm font-bold text-black">
                إجمالي النقاط المطلوبة
              </h5>
              <div className="text-secondary text-lg font-bold">
                {totalPointsPrice} نقطة
              </div>
            </div>
          ) : (
            <CartCheckoutPriceDetails coupon={coupon} />
          ))}
      </div>

      {!isLoadingCart && paymentMethodValue === paymentType.fawerypay && (
        <p className="mb-3 text-xs leading-6 font-bold text-red-600">
          <Image
            src={"/assets/icons/WarningColor.svg"}
            width={16}
            height={16}
            alt="warinng"
            className="ml-2 inline-block"
          />
          بعد ما تضغط &quot;التالي&quot;، هيتعرضلك كود الدفع. خده وادفعه في أقرب
          فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه هتتفتح,
          مع العلم ان صلاحية الكود 7 ايام.
        </p>
      )}

      {hasMixedPointsItems && <MixedItemsPointsWarning />}

      {paymentMethodValue === "POINTS" && !hasEnoughPoints && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
          رصيد نقاطك غير كافٍ لإتمام عملية الشراء (رصيدك الحالي:{" "}
          {profile?.points || 0} نقطة).
        </p>
      )}

      {isLoadingCart ? (
        <div className="space-y-5">
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          {paymentMethodValue !== (paymentType.code as any) && (
            <>
              <Skeleton className="bg-background h-12.5 rounded-xl" />
            </>
          )}
        </div>
      ) : hasPaymentMethods ? (
        <RadioGroup
          value={paymentMethodValue as string}
          onValueChange={(value) => {
            setPaymentMethodValue(value as any);
          }}
          dir="rtl"
          className="gap-5"
        >
          {paymentTypes.map((payment) => (
            <div
              key={payment.value}
              className="flex cursor-pointer flex-col gap-6 text-right"
            >
              <Label
                htmlFor={payment.value}
                className={`relative flex cursor-pointer overflow-hidden ${
                  paymentMethodValue === payment.value
                    ? "border-primary"
                    : "border-gray-light"
                } bg-background items-center gap-2.5 rounded-lg border-2 p-2`}
              >
                <RadioGroupItem value={payment.value} id={payment.value} />
                <Label
                  className="flex w-full items-center gap-6"
                  htmlFor={payment.value}
                >
                  {payment.icons.map((icon) => (
                    <Image
                      key={icon}
                      src={icon}
                      height={32}
                      width={96}
                      className="h-8 w-fit min-w-fit"
                      alt="payment option icon"
                    />
                  ))}

                  {payment.label && (
                    <span className="font-bold text-black">
                      {payment.label}
                    </span>
                  )}
                </Label>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div>
          <span className="mb-2 text-sm font-bold text-red-600">
            لا يوجد طرق دفع متاحة
          </span>
        </div>
      )}
    </>
  );
};
