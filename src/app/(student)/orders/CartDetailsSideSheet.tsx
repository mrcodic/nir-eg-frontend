"use client";

import DataLabel from "@/components/custom/DataLabel";
import PriceSummary from "@/components/ui/price-summary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

function CartDetailsSideSheet({ item }: { item: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-primary-800 ring-primary-700 flex size-8 items-center justify-center rounded-[10px] ring-2 transition-all hover:ring-offset-1">
          <ChevronLeft size={18} color="white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto max-sm:w-[90vw] sm:min-w-[600px]"
      >
        <SheetHeader className="text-start sm:text-start">
          <h2 className="border-gray-light mt-8 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-2">
            <span className="text-sm font-bold text-[#121212] md:text-[18px]">
              {item?.model?.name}
              <p className="text-sm text-gray-500">{item?.trasnsaction_id}</p>
            </span>

            <span className="ms-auto flex flex-wrap items-center gap-1 font-bold">
              حالة الدفع : <PaymentStatusBadge status={item.payment_status} />
            </span>
          </h2>
        </SheetHeader>

        <div className="flex flex-col">
          <div className="border-gray-light mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-b pb-4">
            <DataLabel text="السعر"> {item.amount} جنية</DataLabel>
            <DataLabel text="التاريخ">
              {" "}
              <div className="flex gap-[40px]">
                <span className="text-[#523412]">
                  {new Date(item?.created_at).toISOString().split("T")[0]}
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

          <div className="mt-8 flex max-h-[250px] flex-col gap-6 overflow-y-auto">
            {Array.from({ length: 3 })?.map((_: any) => (
              <div className="flex flex-col gap-[24px] border-b border-gray-200 pb-3 md:flex-row">
                <div className="bg-background relative aspect-square size-24 rounded-lg">
                  <Image
                    className="object-contain"
                    src={item?.model?.cover || "/assets/grade-placeholder.png"}
                    fill
                    alt="cart book item"
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-bold">{item?.model?.name}</h3>
                  <hr className="border-gray-light mt-2 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <DataLabel text="السعر"> 50 جنية</DataLabel>
                    <DataLabel text="الكمية"> {2}</DataLabel>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PriceSummary
            totalPrice={item.amount}
            finalPrice={item.amount}
            className="mt-8"
          />
        </div>
        <SheetDescription />
      </SheetContent>
    </Sheet>
  );
}

export default CartDetailsSideSheet;
