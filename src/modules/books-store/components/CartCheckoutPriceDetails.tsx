"use client";

import PriceSummary from "@/components/ui/price-summary";
import { useCartStore } from "@/context/BooksStoreProvider";
import { PricingResponse } from "@/types";

function CartCheckoutPriceDetails({ coupon }: { coupon?: PricingResponse }) {
  const { getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  const couponDiscount = coupon
    ? coupon?.promo?.type_discount === 1
      ? (coupon?.promo?.value / 100) * totalPrice
      : coupon?.promo?.value
    : 0;

  const finalPrice = coupon?.final_price || totalPrice - couponDiscount;
  // mt-14
  return (
    <PriceSummary
      totalPrice={totalPrice}
      finalPrice={finalPrice}
      couponDiscount={couponDiscount}
    />
  );
}

export default CartCheckoutPriceDetails;
