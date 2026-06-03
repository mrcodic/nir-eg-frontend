import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Label } from "@/components/ui/label";
import PriceBubbles from "@/components/ui/price-bubble";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div className="absolute top-0 left-0 z-30 h-full w-full bg-black/40">
          <LoadingSpinner className="min-h-0" />
        </div>
      )}

      <div className={isSingleBook ? "mb-4" : "mb-10"}>
        {isSingleBook && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold sm:text-xl">{name}</h4>

            <div className="bg-background flex items-center justify-between gap-3 rounded-lg p-2">
              <h5 className="font-bold text-black">السعر</h5>
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
            className={isSingleBook ? "mt-2" : "mb-4"}
          />
        )} */}

        {!isSingleBook && <CartCheckoutPriceDetails />}
      </div>

      {!isLoadingCart && paymentMethodValue === paymentType.fawerypay && (
        <p className="mb-3 text-sm leading-6 font-bold text-red-600">
          <Image
            src={"/assets/icons/WarningColor.svg"}
            width={24}
            height={24}
            alt="warinng"
            className="ml-2 inline-block"
          />
          بعد ما تضغط &quot;التالي&quot;، هيتعرضلك كود الدفع. خده وادفعه في أقرب
          فرع فورى أو تطبيق فورى احتفظ بالايصال وفي خلال 30 دقيقة الباقه هتتفتح,
          مع العلم ان صلاحية الكود 7 ايام.
        </p>
      )}

      {isLoadingCart ? (
        <div className="space-y-5">
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          <Skeleton className="bg-background h-12.5 rounded-xl" />
          {paymentMethodValue !== paymentType.code && (
            <>
              <Skeleton className="bg-background h-12.5 rounded-xl" />
            </>
          )}
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
