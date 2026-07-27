import { paymentType } from "@/types";
import { CartPaymentCapabilities } from "@/utils/get-cart-payment-capabilities";

export type StorePaymentOption = {
  value: paymentType | "POINTS";
  icons: string[];
  label?: string;
  soon?: boolean;
};

type GetStorePaymentOptionsParams = {
  cashPaymentOptions: StorePaymentOption[];
  capabilities: CartPaymentCapabilities;
  totalPointsPrice: number;
  pointsBalance: number;
};

export function getStorePaymentOptions({
  cashPaymentOptions,
  capabilities,
  totalPointsPrice,
  pointsBalance,
}: GetStorePaymentOptionsParams): StorePaymentOption[] {
  const pointsPaymentOption: StorePaymentOption = {
    value: "POINTS",
    label: capabilities.pointsSupported
      ? `الدفع بالنقاط (${totalPointsPrice} نقطة) - رصيدك: ${pointsBalance} نقطة`
      : "الدفع بالنقاط",
    icons: ["/assets/star-colored.svg"],
    soon: false,
  };

  if (capabilities.checkoutBlocked) {
    return [
      ...cashPaymentOptions,
      ...(capabilities.hasPointsEligibleItem ? [pointsPaymentOption] : []),
    ];
  }

  return [
    ...(capabilities.cashSupported ? cashPaymentOptions : []),
    ...(capabilities.pointsSupported ? [pointsPaymentOption] : []),
  ];
}
