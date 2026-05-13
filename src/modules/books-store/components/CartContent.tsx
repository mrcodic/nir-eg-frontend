"use client";

import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useCartStore } from "@/context/BooksStoreProvider";
import Link from "next/link";
import BookCartCard from "./BookCartCard";
import BooksCartPayment from "./BooksCartPayment";

function CartContent() {
  const { items, isLoading, isCartHydrated } = useCartStore();

  if (isLoading || !isCartHydrated)
    return <LoadingSpinner className="min-h-[min(calc(100vh-15rem),768px)]" />;

  if (!items.length)
    return (
      <Empty
        className="min-h-[min(calc(100vh-10rem),768px)]"
        text="لم تقم بإضافة كتب بعد"
      >
        <Link
          href="/books"
          className="bg-primary-800 flex h-10 w-full max-w-[364px] items-center justify-center px-6 text-white"
        >
          اذهب لمتجر الكتب
        </Link>
      </Empty>
    );

  return (
    <section>
      <h1 className="text-32 text-primary-800 font-bold">السلة</h1>

      <div className="grid grid-cols-12 items-start gap-y-16 lg:gap-6">
        <div className="col-span-12 divide-y-2 divide-gray-300 overflow-y-auto max-lg:max-h-[max(calc(100vh-300px),300px)] max-lg:pe-4 lg:col-span-7">
          {items.map((item) => (
            <BookCartCard key={item.id} item={item} className="pt-4 pb-4" />
          ))}
        </div>

        <BooksCartPayment />
      </div>
    </section>
  );
}

export default CartContent;
