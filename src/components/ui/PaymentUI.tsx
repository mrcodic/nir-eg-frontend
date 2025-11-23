import LoadingSpinner from "@/components/Loading";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthContext } from "@/context/auth-context";
import PaymentCoupon from "@/modules/payment/components/PaymentCoupon";
import { CourseType, paymentType, PricingResponse } from "@/types";
import Image from "next/image";
import React from "react";
import PriceBubbles from "./price-bubble";
import PriceBadge from "./PriceBadge";

interface PaymentUIProps {
  paymentMethodValue: paymentType | null;
  setPaymentMethodValue: (value: paymentType | null) => void;
  loading: boolean;
  paymentTypes: any[];
  price?: number;
  sale?: CourseType["sale"];
  coupon?: PricingResponse;
  setCoupon?: (coupon: PricingResponse) => void;
  courseId: string;
  hasCoupon?: boolean;
  isLoadingMethods?: boolean;
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
}) => {
  const { profile } = useAuthContext();

  const isOnline = profile?.type === 4;

  const hasPaymentMethods = paymentTypes.length > 0;

  return (
    <>
      {loading && (
        <div className="absolute z-50 top-0 left-0 bg-black/40 h-full w-full">
          <LoadingSpinner />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <img src="/assets/PaymentColor.svg" className="size-6" />
        <span className="text-[#121212] text-[18px] font-bold">
          اختر طريقة الدفع
        </span>
      </div>

      <div className="h-px w-full bg-gray-light my-3" />

      <div className="space-y-2 mb-4">
        {!!price && (
          <div className="flex items-center p-2 rounded-lg justify-between gap-3 bg-background">
            <h5 className="text-[#121212] font-bold">السعر</h5>
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

      {paymentMethodValue === paymentType.fawerypay && (
        <span className="text-red-600 text-sm font-bold mb-2 ">
          <Image
            src={"/assets/WarningColor.svg"}
            width={30}
            height={30}
            alt="warinng"
            className="inline-block ml-2"
          />
          بعد ما تضغط "التالي"، هيتعرضلك كود الدفع. خده وادفعه في أقرب فرع فورى
          أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه هتتفتح, مع العلم
          ان صلاحية الكود 7 ايام.
        </span>
      )}

      {isLoadingMethods ? (
        <LoadingSpinner className="h-auto" />
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
              className="flex flex-col text-right gap-6 cursor-pointer"
            >
              <Label
                htmlFor={payment.value}
                className={`flex relative overflow-hidden cursor-pointer ${
                  paymentMethodValue === payment.value
                    ? "border-[#023E3E]"
                    : "border-gray-light"
                } p-2 gap-2.5 border-2 rounded-lg bg-background z-0! items-center space-x-2`}
              >
                <RadioGroupItem value={payment.value} id={payment.value} />
                <Label
                  className="flex gap-6 items-center"
                  htmlFor={payment.value}
                >
                  {payment.icons.map((icon) => (
                    <img key={icon} src={icon} />
                  ))}
                  <span className="text-[#121212] font-bold">
                    {payment.label}
                  </span>
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
          <span className="text-red-600 text-sm font-bold mb-2 ">
            لا يوجد طرق دفع متاحة
          </span>
        </div>
      )}
    </>
  );
};
