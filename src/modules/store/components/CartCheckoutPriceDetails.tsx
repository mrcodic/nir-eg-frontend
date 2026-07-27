"use client";

import PriceSummary from "@/components/ui/price-summary";
import { useCartStore } from "@/context/StoreProvider";
import { PricingResponse } from "@/types";

function CartCheckoutPriceDetails({ coupon }: { coupon?: PricingResponse }) {
  const { getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  const couponDiscount = coupon
    ? coupon?.promo?.type_discount === 1
      ? (coupon?.promo?.value / 100) * totalPrice
      : Math.min(coupon?.promo?.value, totalPrice)
    : 0;

  const finalPrice = Math.max(0, totalPrice - couponDiscount);

  return (
    <PriceSummary
      finalPrice={finalPrice}
      couponDiscount={couponDiscount}
      originalPrice={coupon ? totalPrice : undefined}
    />
  );
}

export default CartCheckoutPriceDetails;
