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
import { useCartStore } from "@/context/StoreProvider";
import { useTenant } from "@/context/TenantProvider";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MixedItemsPointsWarning } from "./MixedItemsPointsWarning";
import StoreItemCartCard from "./StoreItemCartCard";

function NavCartButton() {
  const pathname = usePathname();
  const { toast } = useToast();
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

  const { features } = useTenant();
  const hasPointsEnabled = !!features?.points_system;

  const hasMixedPointsItems = useMemo(() => {
    if (!hasPointsEnabled || !items.length) return false;
    const hasAnyPoints = items.some((i) => !!i.can_buy_points);
    const hasAnyNonPoints = items.some((i) => !i.can_buy_points);
    return hasAnyPoints && hasAnyNonPoints;
  }, [hasPointsEnabled, items]);

  const pointsAllowed = useMemo(() => {
    if (!hasPointsEnabled || !items.length) return false;
    return items.every((i) => !!i.can_buy_points && i.points_price !== null);
  }, [hasPointsEnabled, items]);

  const totalPointsPrice = useMemo(() => {
    if (!hasPointsEnabled || !items.length) return 0;
    return items.reduce(
      (sum, i) => sum + (i.points_price || 0) * (i.quantity || 1),
      0,
    );
  }, [hasPointsEnabled, items]);

  const handleClearCart = useCallback(async () => {
    try {
      await clearCart();
    } catch (error) {
      toast({
        icon: "error",
        description: getApiErrorMessage(error, "حدث خطأ أثناء حذف السلة."),
      });
    }
  }, [clearCart, toast]);

  if (!pathname.startsWith("/store") || pathname.startsWith("/store/cart"))
    return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="bg-primary-800 group/cart-btn border-gray-light fixed bottom-4 left-4 z-50 flex size-16 cursor-pointer items-center justify-center rounded-lg border shadow-md"
          suppressHydrationWarning
        >
          <CountBubble
            count={displayCount}
            className="size-5 text-xs font-bold"
          />
          <div
            className="group-hover/cart-btn:bg-primary-50 size-12 bg-white transition-all"
            style={{
              WebkitMaskImage: "url(/assets/icons/cart.svg)",
              maskImage: "url(/assets/icons/cart.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
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
          <SheetTitle className="sr-only">منتجات في السلة</SheetTitle>

          {displayCount > 0 && (
            <button
              onClick={() => void handleClearCart()}
              className="flex cursor-pointer items-center gap-1 text-sm text-red-500 hover:underline"
            >
              <Trash className="size-4" />
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
            <div className="mt-6 max-h-[max(calc(100vh-240px),300px)] divide-y divide-gray-200 overflow-y-auto rounded-lg border pe-4">
              {items.map((item) => (
                <StoreItemCartCard key={item.id} item={item} />
              ))}
            </div>

            {hasMixedPointsItems && (
              <div className="mt-4">
                <MixedItemsPointsWarning />
              </div>
            )}

            <div className="border-secondary mt-6 space-y-4 border-t pt-4">
              <DataWithLabel
                label="اجمالي السعر"
                data={formatCurrency(getTotalPrice())}
                className="flex-wrap justify-between gap-y-2"
                labelClassName="text-base sm:text-lg"
                dataClassName="text-base sm:text-lg"
              />

              {hasPointsEnabled && pointsAllowed && (
                <DataWithLabel
                  label="اجمالي النقاط المطلوبة"
                  data={`${totalPointsPrice} نقطة`}
                  className="text-secondary flex-wrap justify-between gap-y-2"
                  labelClassName="text-base sm:text-lg"
                  dataClassName="text-base sm:text-lg font-bold"
                />
              )}

              <Link
                href={!!profile ? "/store/cart" : "/login?redirect=/store/cart"}
                className="inline-block w-full"
              >
                <SheetClose className="bg-secondary hover:bg-secondary/90 w-full cursor-pointer rounded-lg px-4 py-2 text-white transition-all">
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
