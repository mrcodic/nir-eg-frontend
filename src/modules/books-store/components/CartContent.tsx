"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/Loading";
import { useCartStore } from "@/context/BooksStoreProvider";
import Link from "next/link";
import BookCartCard from "./BookCartCard";
import BooksCartPayment from "./BooksCartPayment";

function CartContent() {
  const { items, isLoading, isHydrated } = useCartStore();

  if (isLoading || !isHydrated)
    return <LoadingSpinner className="min-h-[min(calc(100vh-15rem),768px)]" />;

  if (!items.length)
    return (
      <Empty
        className="min-h-[min(calc(100vh-10rem),768px)]"
        text="لم تقم بإضافة كتب بعد"
      >
        <Link
          href="/books"
          className="bg-primary-800 text-white h-10 max-w-[364px] w-full flex justify-center items-center px-6"
        >
          اذهب لمتجر الكتب
        </Link>
      </Empty>
    );

  return (
    <section>
      <h1 className="text-32 font-bold text-primary-800">السلة</h1>

      <div className="grid grid-cols-12 lg:gap-6 gap-y-16 items-start">
        <div className="lg:col-span-7 col-span-12 max-lg:max-h-[max(calc(100vh-300px),300px)] overflow-y-auto max-lg:pe-4 divide-y-2 divide-gray-300">
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
