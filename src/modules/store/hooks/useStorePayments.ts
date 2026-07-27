import { useCartStore } from "@/context/StoreProvider";
import { useTenant } from "@/context/TenantProvider";
import { useAuthContext } from "@/context/auth-context";
import usePaymentsTypesFiltered from "@/modules/payment/hooks/usePaymentsTypesFiltered";
import { paymentType } from "@/types";
import { StoreItem } from "@/types/store.types";
import {
  getCartPaymentCapabilities,
  getCartPointsTotal,
} from "@/utils/get-cart-payment-capabilities";
import {
  getStorePaymentOptions,
  StorePaymentOption,
} from "@/utils/get-store-payment-options";
import { useMemo, useState } from "react";
import { useStoreCheckout } from "./useStoreCheckout";
import { useStoreCoupon } from "./useStoreCoupon";

type UseStorePaymentsParams = {
  item?: StoreItem;
  asModal?: boolean;
};

export function useStorePayments({
  item,
  asModal = false,
}: UseStorePaymentsParams) {
  const { features } = useTenant();
  const { profile } = useAuthContext();
  const { items } = useCartStore();

  const {
    paymentTypes: cashPaymentOptions,
    isLoading: isPaymentOptionsLoading,
  } = usePaymentsTypesFiltered({ isBookStore: true });

  const [paymentMethodValue, setPaymentMethodValue] = useState<
    paymentType | "POINTS" | null
  >(null);

  const cartSignature = useMemo(
    () => items.map(({ id, quantity }) => `${id}:${quantity}`).join("|"),
    [items],
  );

  const paymentItems = useMemo(
    () => (asModal && item ? [item] : items),
    [asModal, item, items],
  );

  const paymentCapabilities = useMemo(
    () => getCartPaymentCapabilities(paymentItems, !!features?.points_system),
    [features?.points_system, paymentItems],
  );

  const totalPointsPrice = useMemo(
    () => getCartPointsTotal(paymentItems),
    [paymentItems],
  );

  const hasEnoughPoints = (profile?.points || 0) >= totalPointsPrice;

  const paymentTypes = useMemo<StorePaymentOption[]>(
    () =>
      getStorePaymentOptions({
        cashPaymentOptions,
        capabilities: paymentCapabilities,
        totalPointsPrice,
        pointsBalance: profile?.points || 0,
      }),
    [
      cashPaymentOptions,
      paymentCapabilities,
      profile?.points,
      totalPointsPrice,
    ],
  );

  const { coupon, setCoupon } = useStoreCoupon({ asModal, cartSignature });

  const activePaymentMethod = paymentTypes.some(
    (payment) => payment.value === paymentMethodValue,
  )
    ? paymentMethodValue
    : (paymentTypes[0]?.value ?? null);

  const { checkout, isCheckoutPending } = useStoreCheckout({
    asModal,
    item,
    paymentMethod: activePaymentMethod,
    checkoutBlocked: paymentCapabilities.checkoutBlocked,
    hasEnoughPoints,
  });

  const loading = isCheckoutPending || isPaymentOptionsLoading;
  const isCheckoutDisabled =
    loading ||
    !activePaymentMethod ||
    paymentCapabilities.checkoutBlocked ||
    (activePaymentMethod === "POINTS" && !hasEnoughPoints);

  return {
    paymentMethodValue: activePaymentMethod,
    setPaymentMethodValue,
    paymentTypes,
    coupon,
    setCoupon,
    totalPointsPrice,
    hasEnoughPoints,
    checkoutBlocked: paymentCapabilities.checkoutBlocked,
    paymentNotice: paymentCapabilities.notice,
    loading,
    isCheckoutDisabled,
    checkout,
  };
}

export type StorePaymentsState = ReturnType<typeof useStorePayments>;
