import Image from "next/image";

export function MixedItemsPointsWarning() {
  return (
    <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-right text-xs font-bold text-amber-600">
      <Image
        src={"/assets/icons/WarningColor.svg"}
        width={16}
        height={16}
        alt="warinng"
        className="ml-2 inline-block"
      />
      بعض المنتجات في السلة لا يمكن شراؤها باستخدام النقاط، لذلك تم إيقاف خيار
      الدفع بالنقاط.
    </p>
  );
}
