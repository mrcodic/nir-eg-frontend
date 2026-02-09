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
import BookCartCard from "./BookCartCard";

function NavCartButton() {
  const pathname = usePathname();
  const { profile } = useAuthContext();
  const {
    getTotalItems,
    items,
    getTotalPrice,
    isCartHydrated,
    isLoading,
    clearCart,
  } = useCartStore();

  const displayCount = isCartHydrated ? getTotalItems() : 0;

  if (!pathname.startsWith("/books")) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 left-4 z-[100] flex size-16 cursor-pointer items-center justify-center rounded-lg bg-[#FBF6F0] shadow-md">
          <CountBubble
            count={displayCount}
            className="size-5 pt-px text-xs font-bold"
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
        className="max-h-screen overflow-y-auto max-sm:w-[95vw] max-sm:px-2 sm:max-w-[600px]"
      >
        <SheetHeader
          dir="rtl"
          className="flex flex-row flex-wrap items-center justify-between gap-4 pt-2 text-start sm:text-start"
        >
          <SheetTitle>منتجات في السلة</SheetTitle>
          {displayCount > 0 && (
            <button
              onClick={() => clearCart()}
              className="ms-auto flex items-center gap-1 text-red-500 underline"
            >
              حذف جميع المنتجات
            </button>
          )}
          <SheetDescription className="hidden" />
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">جاري تحميل السلة...</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">السلة فارغة</p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <>
            <div className="mt-6 max-h-[max(calc(100vh-240px),300px)] divide-y divide-gray-200 overflow-y-auto pe-4">
              {items.map((item) => (
                <BookCartCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 space-y-6 border-t border-[#D9B45C] pt-2">
              <DataWithLabel
                label="اجمالي السعر"
                data={getTotalPrice() + " جنية"}
                className="justify-between"
                labelClassName="text-lg"
                dataClassName="text-lg"
              />

              <Link
                href={!!profile ? "/books/cart" : "/login?redirect=/books/cart"}
                className="inline-block w-full"
              >
                <SheetClose className="w-full rounded-lg bg-[#D9B45C] px-4 py-2 text-white">
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
