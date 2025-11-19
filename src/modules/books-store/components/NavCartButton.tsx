"use client";

import CountBubble from "@/components/ui/CountBubble";
import DataWithLabel from "@/components/ui/DataWithLabel";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/context/auth-context";
import { useCartStore } from "@/context/BooksStoreProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import BookCartCard from "./BookCartCard";

function NavCartButton() {
  const pathname = usePathname();
  const { profile } = useAuthContext();
  const {
    getTotalItems,
    items,
    getTotalPrice,
    initializeCart,
    isHydrated,
    isLoading,
  } = useCartStore();

  useEffect(() => {
    if (isHydrated) return;

    initializeCart();
  }, [initializeCart, isHydrated]);

  const displayCount = isHydrated ? getTotalItems() : 0;

  if (pathname !== "/books") return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="size-16 rounded-lg fixed z-100 bottom-4 left-4 shadow-md flex justify-center items-center cursor-pointer bg-background">
          <CountBubble
            count={displayCount}
            className="size-5 font-bold text-xs pt-px"
          />
          <Image
            src="/assets/cart.svg"
            width={48}
            height={48}
            alt="cart button"
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="sm:max-w-[600px] max-sm:px-2 max-sm:w-[95vw] max-h-screen overflow-y-auto"
      >
        <SheetHeader dir="rtl" className="sm:text-start text-start">
          <SheetTitle>منتجات في السلة</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">جاري تحميل السلة...</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">السلة فارغة</p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <>
            <div className="divide-y divide-gray-200 max-h-[max(calc(100vh-200px),300px)] overflow-y-auto pe-4">
              {items.map((item) => (
                <BookCartCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 space-y-6 border-t border-primary-700 pt-2">
              <DataWithLabel
                label="اجمالي السعر"
                data={getTotalPrice() + " جنية"}
                className="justify-between"
                labelClassName="text-lg"
                dataClassName="text-lg"
              />

              <Link
                href={!!profile ? "/books/cart" : "/login?redirect=/books/cart"}
                className="w-full inline-block"
              >
                <SheetClose className="w-full bg-primary-700 text-white py-2 px-4 rounded-lg">
                  الانتقال للسلة
                </SheetClose>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NavCartButton;
