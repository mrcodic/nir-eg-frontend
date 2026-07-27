"use client";

import PriceSummary from "@/components/ui/price-summary";
import { useCartStore } from "@/context/StoreProvider";
import { PricingResponse } from "@/types";

function CartCheckoutPriceDetails({ coupon }: { coupon?: PricingResponse }) {
  const { getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <PriceSummary
      finalPrice={coupon?.final_price ?? totalPrice}
      couponDiscount={coupon?.promo_discount}
      originalPrice={coupon?.base_price}
    />
  );
}

export default CartCheckoutPriceDetails;
