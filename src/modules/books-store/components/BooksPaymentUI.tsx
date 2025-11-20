import LoadingSpinner from "@/components/Loading";
import { Label } from "@/components/ui/label";
import PriceBubbles from "@/components/ui/price-bubble";
import PriceBadge from "@/components/ui/PriceBadge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/context/BooksStoreProvider";
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
        <div className="absolute z-50 top-0 left-0 bg-black/40 h-full w-full">
          <LoadingSpinner />
        </div>
      )}

      {isSingleBook && (
        <>
          <div className="mt-[16px] flex items-center gap-[12px]">
            <img src="/assets/PaymentColor.svg" className="w-[24px] h-[24px]" />
            <span className="text-[#121212] text-[18px] font-bold">
              اختر طريقة الدفع
            </span>
          </div>

          <div className="h-px w-full bg-primary-700 my-[12px]" />
        </>
      )}

      <div className={isSingleBook ? " mb-4" : "mb-10"}>
        {isSingleBook && (
          <div className="space-y-4">
            <h4 className="sm:text-2xl text-lg font-bold">{name}</h4>

            <div className="flex items-center p-2 rounded-lg justify-between gap-3 bg-background">
              <h5 className="text-[#121212] font-bold">السعر</h5>
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

      {isLoadingCart ? (
        <LoadingSpinner />
      ) : hasPaymentMethods ? (
        <RadioGroup
          value={paymentMethodValue}
          onValueChange={(value) => {
            setPaymentMethodValue(value);
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
                    : "border-primary-700"
                } p-2 gap-[10px] border-2 rounded-lg bg-background z-0! items-center space-x-2`}
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
