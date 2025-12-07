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
    initializeCart,
    isCartHydrated,
    isLoading,
    clearCart,
  } = useCartStore();

  // useEffect(() => {
  //   if (isCartHydrated) return;

  //   initializeCart();
  // }, [initializeCart, isCartHydrated]);

  const displayCount = isCartHydrated ? getTotalItems() : 0;

  if (!pathname.startsWith("/books")) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="size-16 rounded-lg fixed z-[100] bottom-4 left-4 shadow-md flex justify-center items-center cursor-pointer bg-[#FBF6F0]">
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
        <SheetHeader
          dir="rtl"
          className="sm:text-start flex-row items-center justify-between gap-4 text-start pt-2 flex-wrap flex"
        >
          <SheetTitle>منتجات في السلة</SheetTitle>
          {displayCount > 0 && (
            <button
              onClick={() => clearCart()}
              className="flex underline ms-auto items-center gap-1 text-red-500"
            >
              حذف جميع المنتجات
            </button>
          )}
          <SheetDescription className="hidden" />
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
            <div className="divide-y mt-6 divide-gray-200 max-h-[max(calc(100vh-240px),300px)] overflow-y-auto pe-4">
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
                className="w-full inline-block"
              >
                <SheetClose className="w-full bg-[#D9B45C] text-white py-2 px-4 rounded-lg">
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
