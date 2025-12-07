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

  return (
    <>
      {loading && (
        <div className="absolute z-50 top-0 left-0 bg-black/40 h-full w-full">
          <LoadingSpinner />
        </div>
      )}

      {isModal && (
        <h4 className=" text-[18px] font-bold mb-4">اختر طريقة الدفع</h4>
      )}

      <div className="space-y-2 mb-6 empty:hidden">
        {isModal && !!price && (
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

        {hasPaymentMethods && isOnline && hasCoupon ? (
          <PaymentCoupon
            coupon={coupon}
            setCoupon={setCoupon}
            courseId={courseId}
          />
        ) : (
          <hr className="h-px w-full border-gray-light my-3" />
        )}
      </div>

      {paymentMethodValue === paymentType.fawerypay && (
        <span className="text-red-600 block text-sm font-bold mb-2 leading-6">
          <Image
            src={"/assets/warning-fill.svg"}
            width={24}
            height={24}
            alt="warinng"
            className="inline-block ml-2"
          />
          بعد ما تضغط &quot;التالي&quot; ، هيتعرضلك كود الدفع. خده وادفعه في
          أقرب فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه
          هتتفتح, مع العلم ان صلاحية الكود 7 ايام.
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
                className={`flex relative overflow-hidden cursor-pointer bg-transparent ${
                  paymentMethodValue === payment.value
                    ? "border-primary-800 bg-primary-50"
                    : "border-gray-light"
                } p-2 gap-2.5 border-2 rounded-lg  z-0! items-center space-x-2`}
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
