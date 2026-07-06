import React from "react";

export function MixedItemsPointsWarning() {
  return (
    <p className="mb-4 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-right">
      بعض المنتجات في السلة لا يمكن شراؤها باستخدام النقاط، لذلك تم إيقاف خيار الدفع بالنقاط.
    </p>
  );
}
