"use client";

import DataLabel from "@/components/custom/DataLabel";
import PriceSummary from "@/components/ui/price-summary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
        <button className="bg-primary-800 flex size-8 items-center justify-center rounded-[10px] ring-2 ring-[#D9B45C] transition-all hover:ring-offset-1">
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
          <h2 className="mt-8 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#D9B45C] pb-2">
            <span className="text-[14px] font-bold text-[#121212] md:text-[18px]">
              عربة التسوق
              <p className="text-sm text-gray-500">{bookOrder?.order_number}</p>
            </span>

            <span className="ms-auto flex flex-wrap items-center gap-1 font-bold">
              حالة الدفع : <PaymentStatusBadge status={bookOrder.status} />
            </span>
          </h2>
        </SheetHeader>

        <div className="flex flex-col">
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-[#D9B45C] pb-4">
            <DataLabel text="السعر"> {bookOrder.total_price} جنية</DataLabel>
            <DataLabel text="التاريخ">
              <div className="flex gap-[40px]">
                <span className="text-[#523412]">
                  {new Date(bookOrder?.created_at).toISOString().split("T")[0]}
                </span>
              </div>
            </DataLabel>
            <DataLabel text="حالة الطلب"> قيد الانتظار</DataLabel>
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

          <div className="mt-8 flex h-full max-h-[calc(100vh-350px)] min-h-[250px] flex-col gap-6 overflow-y-auto">
            {bookOrder.items?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-[24px] border-b border-gray-200 pb-3 md:flex-row"
              >
                <Link
                  href={`/books/${item.book_id}`}
                  className="relative aspect-square size-24 rounded-lg bg-[#FBF6F0]"
                >
                  <Image
                    className="rounded-lg object-contain"
                    src={item?.book_image || "/assets/Course.svg"}
                    fill
                    alt="cart book item"
                  />
                </Link>

                <div className="w-full">
                  <h3 className="text-lg font-bold">{item?.book_name}</h3>
                  <hr className="mt-2 mb-4 border-[#D9B45C]" />
                  <div className="grid grid-cols-2 gap-4">
                    <DataLabel text="السعر">
                      {" "}
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
