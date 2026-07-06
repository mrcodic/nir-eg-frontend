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
import { BooksOrder } from "@/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function CartDetailsSideSheet({ bookOrder }: { bookOrder: BooksOrder }) {
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
              <p className="text-sm text-gray-500">{bookOrder?.order_number}</p>
            </span>

            <PaymentStatusBadge status={bookOrder.status} variant="book" />
          </h2>
        </SheetHeader>

        <div className="flex h-full flex-col">
          <div className="border-gray-light mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-b pb-4">
            <DataLabel text="السعر">
              {formatCurrency(bookOrder.total_price)}
            </DataLabel>

            <DataLabel text="التاريخ">
              {new Date(bookOrder?.created_at).toISOString().split("T")[0]}
            </DataLabel>

            <DataLabel text="حالة التوصيل">
              {deliveryStatusArabic[bookOrder?.delivery_status] ||
                "قيد الانتظار"}
            </DataLabel>

            <DataLabel text={"طريفة الدفع"}>
              <Image
                src={"/assets/Fawry.svg"}
                alt=""
                width={0}
                height={0}
                className="size-auto object-contain"
              />
            </DataLabel>
          </div>

          {/* cart books (items) cards */}
          <div className="mt-8 flex h-full max-h-[calc(100vh-340px)] min-h-[150px] flex-col gap-6 overflow-y-auto">
            {bookOrder.items?.map((item) => (
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
                      {formatCurrency(item.book_price)}
                    </DataLabel>
                    <DataLabel text="الكمية"> {item.quantity}</DataLabel>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PriceSummary
            totalPrice={bookOrder.total_price}
            finalPrice={bookOrder.total_price}
            className="mt-8"
          />
        </div>

        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
}

export default CartDetailsSideSheet;
