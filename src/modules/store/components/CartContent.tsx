"use client";

import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useCartStore } from "@/context/StoreProvider";
import Link from "next/link";
import { useStorePayments } from "../hooks/useStorePayments";
import StoreCartPayment from "./StoreCartPayment";
import StoreItemCartCard from "./StoreItemCartCard";

function CartContent() {
  const { items, isLoading, isCartHydrated } = useCartStore();
  const payment = useStorePayments({ asModal: false });
  const appliedBookIds = new Set(payment.coupon?.applied_books ?? []);

  if (isLoading || !isCartHydrated)
    return <LoadingSpinner className="min-h-[min(calc(100vh-15rem),768px)]" />;

  if (!items.length)
    return (
      <Empty
        className="min-h-[min(calc(100vh-10rem),768px)]"
        text="لم تقم بإضافة كتب بعد"
      >
        <Link
          href="/store"
          className="bg-primary-800 hover:bg-primary-800/80 flex h-10 w-full max-w-[364px] items-center justify-center px-6 text-white transition-all"
        >
          اذهب لمتجر الكتب
        </Link>
      </Empty>
    );

  return (
    <section>
      <h1 className="text-32 text-primary-800 font-bold">السلة</h1>

      <div className="grid grid-cols-12 items-start gap-y-12">
        <div className="col-span-12 max-h-screen space-y-4 divide-y-2 divide-gray-300 overflow-y-auto border-gray-200 max-lg:max-h-[max(calc(100vh-300px),300px)] max-lg:pe-4 lg:col-span-6 lg:rounded-xl lg:border lg:p-4">
          {items.map((item) => (
            <StoreItemCartCard
              key={item.id}
              item={item}
              isCouponApplied={appliedBookIds.has(item.id)}
              className="pt-4 pb-4"
            />
          ))}
        </div>

        <StoreCartPayment payment={payment} />
      </div>
    </section>
  );
}

export default CartContent;
