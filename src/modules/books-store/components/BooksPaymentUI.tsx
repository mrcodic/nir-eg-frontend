import LoadingSpinner from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import PriceBubbles from "@/components/ui/price-bubble";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/context/BooksStoreProvider";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { CourseType, paymentType, PricingResponse } from "@/types";
import Image from "next/image";
import React from "react";
import CartCheckoutPriceDetails from "./CartCheckoutPriceDetails";

interface PaymentUIProps {
  paymentMethodValue: paymentType | null;
  setPaymentMethodValue: (value: paymentType | null) => void;
  loading: boolean;
  paymentTypes: any[];
  price?: number;
  sale?: CourseType["sale"];
  coupon?: PricingResponse;
  setCoupon?: (coupon: PricingResponse) => void;
  isSingleBook?: boolean;
  bookId?: string | number;
  name?: string;
}

export const BooksPaymentUI: React.FC<PaymentUIProps> = ({
  paymentMethodValue,
  setPaymentMethodValue,
  loading,
  paymentTypes,
  coupon,
  setCoupon,
  price,
  isSingleBook,
  bookId,
  name,
}) => {
  const { getTotalPrice, isLoading: isLoadingCart } = useCartStore();

  const totalPrice = isSingleBook ? price : getTotalPrice() || 0;

  const hasPaymentMethods = paymentTypes.length > 0;

  return (
    <>
      {loading && (
        <div className="absolute top-0 left-0 z-50 h-full w-full bg-black/40">
          <LoadingSpinner />
        </div>
      )}

      {isSingleBook && (
        <>
          <div className="mt-[16px] flex items-center gap-[12px]">
            <img src="/assets/PaymentColor.svg" className="h-[24px] w-[24px]" />
            <span className="text-[18px] font-bold text-[#121212]">
              اختر طريقة الدفع
            </span>
          </div>

          <div className="bg-gray-light my-[12px] h-px w-full" />
        </>
      )}

      <div className={isSingleBook ? "mb-4" : "mb-10"}>
        {isSingleBook && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold sm:text-2xl">{name}</h4>

            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="font-bold text-[#121212]">السعر</h5>
              {!!coupon?.promo?.value ? (
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

        {/* {hasPaymentMethods && (
          <PaymentCoupon
            coupon={coupon}
            setCoupon={setCoupon}
            bookId={isSingleBook && bookId}
            isSingleBook={isSingleBook}
            className={isSingleBook ? "mt-2 " : ""}
          />
        )} */}

        {!isSingleBook && <CartCheckoutPriceDetails />}
      </div>

      {paymentMethodValue === paymentType.fawerypay && (
        <span className="mb-2 text-sm font-bold text-red-600">
          <Image
            src={"/assets/WarningColor.svg"}
            width={30}
            height={30}
            alt="warinng"
            className="ml-2 inline-block"
          />
          بعد ما تضغط &quot;التالي&quot;، هيتعرضلك كود الدفع. خده وادفعه في أقرب
          فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه هتتفتح,
          مع العلم ان صلاحية الكود 7 ايام.
        </span>
      )}

      {isLoadingCart ? (
        <LoadingSpinner />
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
                className={`relative flex cursor-pointer overflow-hidden ${
                  paymentMethodValue === payment.value
                    ? "border-[#023E3E]"
                    : "border-gray-light"
                } bg-background z-0! items-center gap-[10px] space-x-2 rounded-lg border-2 p-2`}
              >
                <RadioGroupItem value={payment.value} id={payment.value} />
                <Label
                  className="flex items-center gap-6"
                  htmlFor={payment.value}
                >
                  {payment.icons.map((icon) => (
                    <img key={icon} src={icon} />
                  ))}
                  <span className="font-bold text-[#121212]">
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
          <span className="mb-2 text-sm font-bold text-red-600">
            لا يوجد طرق دفع متاحة
          </span>
        </div>
      )}
    </>
  );
};
