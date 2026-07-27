import { StoreItem, StoreItemPaymentType } from "@/types/store.types";

export type CartPaymentNotice =
  | "cash-only"
  | "points-only"
  | "incompatible"
  | null;

export type CartPaymentCapabilities = {
  cashSupported: boolean;
  pointsSupported: boolean;
  hasPointsEligibleItem: boolean;
  couponSupported: boolean;
  checkoutBlocked: boolean;
  notice: CartPaymentNotice;
};

export function getCartPointsTotal(items: StoreItem[]): number {
  return items.reduce(
    (total, item) => total + (item.points_price || 0) * (item.quantity || 1),
    0,
  );
}

export function getCartPaymentCapabilities(
  items: StoreItem[],
  hasPointsFeature: boolean,
): CartPaymentCapabilities {
  const hasCashOnlyItem = items.some(
    (item) => item.payment_type === StoreItemPaymentType.Cash,
  );
  const hasPointsOnlyItem = items.some(
    (item) => item.payment_type === StoreItemPaymentType.Points,
  );
  const checkoutBlocked = hasCashOnlyItem && hasPointsOnlyItem;
  const cashSupported = items.length > 0 && !hasPointsOnlyItem;
  const pointsSupported =
    hasPointsFeature &&
    items.length > 0 &&
    !hasCashOnlyItem &&
    items.every((item) => item.points_price !== null);

  return {
    cashSupported,
    pointsSupported,
    hasPointsEligibleItem:
      hasPointsFeature &&
      items.some(
        (item) =>
          item.payment_type !== StoreItemPaymentType.Cash &&
          item.points_price !== null,
      ),
    couponSupported: items.some((item) => item.has_promo_code),
    checkoutBlocked,
    notice: checkoutBlocked
      ? "incompatible"
      : cashSupported && !pointsSupported
        ? "cash-only"
        : pointsSupported && !cashSupported
          ? "points-only"
          : null,
  };
}
