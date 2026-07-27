import { PricingResponse } from "@/types";
import { useCallback, useState } from "react";

type UseStoreCouponParams = {
  asModal: boolean;
  cartSignature: string;
};

export function useStoreCoupon({
  asModal,
  cartSignature,
}: UseStoreCouponParams) {
  const [coupon, setCouponState] = useState<PricingResponse | null>(null);
  const [couponCartSignature, setCouponCartSignature] = useState<string | null>(
    null,
  );

  const setCoupon = useCallback(
    (nextCoupon: PricingResponse | null) => {
      setCouponState(nextCoupon);
      setCouponCartSignature(nextCoupon && !asModal ? cartSignature : null);
    },
    [asModal, cartSignature],
  );

  const activeCoupon =
    asModal || couponCartSignature === cartSignature ? coupon : null;

  return { coupon: activeCoupon, setCoupon };
}
