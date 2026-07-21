"use client";

import DataLabel from "@/components/custom/DataLabel";
import CustomImage from "@/components/ui/CustomImage";
import PriceSummary from "@/components/ui/price-summary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deliveryStatusArabic } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import { StoreOrder } from "@/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function CartDetailsSideSheet({ storeOrder }: { storeOrder: StoreOrder }) {
  const usedPoints = storeOrder.payment_method_key === "points";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-primary-800 ring-secondary flex cursor-pointer items-center justify-center gap-1 rounded-[10px] p-2 text-sm text-white ring-2 transition-all hover:ring-offset-1">
          عرض السلة
          <ChevronLeft size={18} color="white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col gap-0 overflow-y-auto max-sm:w-[90vw] sm:min-w-[600px]"
      >
        <SheetTitle className="sr-only">
          cart item details side sheet
        </SheetTitle>
        <SheetDescription className="sr-only">
          cart item order details containing purchased books and payment details
        </SheetDescription>

        <SheetHeader className="text-start sm:text-start">
          <h2 className="border-gray-light mt-8 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-2">
            <span className="text-sm font-bold text-black md:text-[18px]">
              عربة التسوق
              <p className="text-sm text-gray-500">
                {storeOrder?.order_number}
              </p>
            </span>

            <PaymentStatusBadge status={storeOrder.status} variant="book" />
          </h2>
        </SheetHeader>

        <div className="flex h-full flex-col">
          <div className="border-gray-light mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-b pb-4">
            <DataLabel text="السعر">
              {usedPoints
                ? `${storeOrder.points_total} نقطة`
                : formatCurrency(storeOrder.total_price)}
            </DataLabel>

            <DataLabel text="التاريخ">
              {new Date(storeOrder?.created_at).toISOString().split("T")[0]}
            </DataLabel>

            <DataLabel text="حالة التوصيل">
              {deliveryStatusArabic[storeOrder?.delivery_status] ||
                "قيد الانتظار"}
            </DataLabel>

            <DataLabel text={"طريفة الدفع"}>
              {usedPoints ? (
                <span className="bg-secondary-50 text-secondary flex items-center gap-2 rounded-lg px-2 py-1 font-bold">
                  <Image
                    src="/assets/star-colored.svg"
                    alt="star icon"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                  نقاط
                </span>
              ) : (
                <Image
                  src={"/assets/Fawry.svg"}
                  alt=""
                  width={80}
                  height={32}
                  className="size-auto object-contain"
                />
              )}
            </DataLabel>
          </div>

          {/* cart books (items) cards */}
          <div className="mt-8 flex h-full max-h-[calc(100vh-340px)] min-h-[150px] flex-col gap-6 overflow-y-auto">
            {storeOrder.items?.map((item) => (
              <div
                key={item.id}
                className="border-gray-light flex flex-col gap-6 rounded-lg border p-2 md:flex-row"
              >
                <Link
                  href={`/store/${item.book_id}`}
                  className="border-gray-light relative aspect-square size-24 shrink-0 overflow-hidden rounded-lg border"
                >
                  <CustomImage
                    className="object-cover"
                    src={item?.book_image}
                    fallback="/assets/grade-placeholder.png"
                    fill
                    alt="cart book item"
                  />
                </Link>

                <div className="w-full">
                  <h3 className="text-lg font-bold">{item?.book_name}</h3>
                  <hr className="border-gray-light mt-2 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <DataLabel text="السعر">
                      {usedPoints
                        ? `${item?.points_price || 0} نقطة`
                        : formatCurrency(item.book_price)}
                    </DataLabel>

                    <DataLabel text="الكمية"> {item.quantity}</DataLabel>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {usedPoints ? (
            <div className="mt-8 border-t border-gray-100 pt-2">
              <DataLabel
                text="إجمالي النقاط"
                className="justify-between text-sm font-bold sm:text-lg"
              >
                {storeOrder.points_total} نقطة
              </DataLabel>
            </div>
          ) : (
            <PriceSummary
              finalPrice={storeOrder.total_price}
              className="mt-8 border-t border-gray-100 pt-2"
            />
          )}
        </div>

        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
}

export default CartDetailsSideSheet;
