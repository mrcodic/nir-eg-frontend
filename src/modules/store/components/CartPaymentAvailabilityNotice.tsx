import Image from "next/image";

import { CartPaymentNotice } from "@/utils/get-cart-payment-capabilities";

const NOTICE_CONTENT: Record<Exclude<CartPaymentNotice, null>, string> = {
  "cash-only": "هذه السلة تدعم الدفع النقدي فقط.",
  "points-only": "هذه السلة تدعم الدفع بالنقاط فقط.",
  incompatible:
    "تحتوي السلة على منتجات نقدية فقط ومنتجات بالنقاط فقط. احذف أحد النوعين لإتمام الشراء.",
};

function CartPaymentAvailabilityNotice({
  notice,
}: {
  notice: Exclude<CartPaymentNotice, null>;
}) {
  const isIncompatible = notice === "incompatible";

  return (
    <p
      className={`mb-4 rounded-lg border p-3 text-right text-xs font-bold ${
        isIncompatible
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-amber-200 bg-amber-50 text-amber-600"
      }`}
    >
      <Image
        src="/assets/icons/WarningColor.svg"
        width={16}
        height={16}
        alt="تنبيه"
        className="ml-2 inline-block"
      />
      {NOTICE_CONTENT[notice]}
    </p>
  );
}

export default CartPaymentAvailabilityNotice;
