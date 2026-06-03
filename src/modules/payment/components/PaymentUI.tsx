import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthContext } from "@/context/auth-context";

import CustomImage from "@/components/ui/CustomImage";
import PriceBubbles from "@/components/ui/price-bubble";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseType, paymentType, PricingResponse } from "@/types";
import Image from "next/image";
import React from "react";
import PaymentCoupon from "./PaymentCoupon";
import PriceBadge from "./PriceBadge";

interface PaymentUIProps {
  paymentMethodValue: paymentType | null;
  setPaymentMethodValue: (value: paymentType | null) => void;
  loading: boolean;
  paymentTypes: any[];
  price?: number | string;
  sale?: CourseType["sale"];
  coupon?: PricingResponse;
  setCoupon?: (coupon: PricingResponse) => void;
  courseId: string;
  hasCoupon?: boolean;
  isLoadingMethods?: boolean;
  isModal?: boolean;
}

export const PaymentUI: React.FC<PaymentUIProps> = ({
  paymentMethodValue,
  setPaymentMethodValue,
  loading,
  paymentTypes,
  price,
  sale,
  coupon,
  setCoupon,
  courseId,
  hasCoupon,
  isLoadingMethods,
  isModal = true,
}) => {
  const { profile } = useAuthContext();

  const isOnline = profile?.type === 4;

  const hasPaymentMethods = paymentTypes.length > 0;
  const isFree = Number(price) === 0;

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 h-full w-full bg-black/40">
          <LoadingSpinner className="min-h-0" />
        </div>
      )}

      {!isFree && (
        <h4 className="mb-4 text-[18px] font-bold">اختر طريقة الدفع</h4>
      )}

      <div className="mb-6 space-y-2 empty:hidden">
        {isModal && !!price && (
          <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
            <h5 className="font-bold text-black">السعر</h5>
            {hasCoupon && !!coupon?.promo?.value && isOnline ? (
              <>
                <PriceBadge
                  className="ms-auto"
                  price={coupon?.base_price}
                  variant={"crossed"}
                />

                <PriceBadge price={coupon?.final_price} variant={"discount"} />
              </>
            ) : (
              <PriceBubbles sale={sale} price={price} />
            )}
          </div>
        )}

        {hasPaymentMethods && isOnline && hasCoupon && (
          <PaymentCoupon
            coupon={coupon}
            setCoupon={setCoupon}
            courseId={courseId}
          />
        )}
      </div>

      {!isFree &&
        hasPaymentMethods &&
        paymentMethodValue === paymentType.fawerypay && (
          <span className="mb-2 block text-sm leading-6 font-bold text-red-600">
            <Image
              src={"/assets/warning-fill.svg"}
              width={24}
              height={24}
              alt="warinng"
              className="ml-2 inline-block"
            />
            بعد ما تضغط &quot;التالي&quot; ، هيتعرضلك كود الدفع. خده وادفعه في
            أقرب فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه
            هتتفتح, مع العلم ان صلاحية الكود 7 ايام.
          </span>
        )}

      {isLoadingMethods ? (
        // <LoadingSpinner className="h-auto min-h-[200px]" />
        <div className="space-y-5">
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          {paymentMethodValue !== paymentType.code && (
            <>
              <Skeleton className="bg-background h-12.5 rounded-xl" />
            </>
          )}
        </div>
      ) : isFree ? (
        <div className="flex flex-col items-center gap-2">
          <CustomImage
            className="size-16"
            src={"/assets/gifs/percentage.gif"}
            fallback="/assets/gifs/percentage.gif"
            width={64}
            height={64}
            alt="percentage"
            fetchPriority="high"
            priority
          />
          <span className="mb-2 text-xl font-bold text-green-600">
            يمكنك الاشتراك فى الكورس مجانا
          </span>
        </div>
      ) : hasPaymentMethods ? (
        <RadioGroup
          value={paymentMethodValue}
          onValueChange={(value) => {
            setPaymentMethodValue(value as paymentType);
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
                className={`relative flex cursor-pointer overflow-hidden bg-transparent ${
                  paymentMethodValue === payment.value
                    ? "border-primary-800 bg-primary-50"
                    : "border-gray-light"
                } z-0! items-center gap-2.5 space-x-2 rounded-lg border-2 p-2`}
              >
                <RadioGroupItem value={payment.value} id={payment.value} />
                <Label
                  className="flex items-center gap-6"
                  htmlFor={payment.value}
                >
                  {payment.icons.map((icon) => (
                    <Image
                      key={icon}
                      src={icon}
                      height={32}
                      width={96}
                      className="min-w-fit"
                      alt="payment option icon"
                    />
                  ))}

                  {payment.label && (
                    <span className="font-bold text-black">
                      {payment.label}
                    </span>
                  )}
                </Label>
                {/* {payment.soon && (
                <div className="bg-red-600 text-white px-8 absolute top-4 -left-5 -rotate-45 h-5 text-sm">
                  قريبا
                </div>
              )} */}
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
