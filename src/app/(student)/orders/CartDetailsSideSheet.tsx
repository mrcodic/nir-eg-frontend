"use client";

import DataLabel from "@/components/custom/DataLabel";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import PriceSummary from "@/components/ui/price-summary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

function CartDetailsSideSheet({ item }: { item: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-[#012D5A] rounded-[10px]  size-8 ring-2 ring-primary-700 hover:ring-offset-1 transition-all flex items-center justify-center">
          <ChevronLeft size={18} color="white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:min-w-[600px] max-sm:w-[90vw] overflow-y-auto"
      >
        <SheetHeader className="sm:text-start text-start">
          <h2 className="flex w-full mt-8 items-center justify-between gap-x-4 gap-y-2 flex-wrap border-b border-primary-700 pb-2">
            <span className="text-[#121212] text-[14px] md:text-[18px] font-bold">
              {item?.model?.name}
              <p className="text-sm text-gray-500">{item?.trasnsaction_id}</p>
            </span>

            <span className="flex items-center ms-auto flex-wrap font-bold gap-1">
              حالة الدفع : <PaymentStatusBadge status={item.payment_status} />
            </span>
          </h2>
        </SheetHeader>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-center mt-6 border-b border-primary-700 pb-4">
            <DataLabel text="السعر"> {item.amount} جنية</DataLabel>
            <DataLabel text="التاريخ">
              {" "}
              <div className=" flex gap-[40px]">
                <span className="text-[#523412] ">
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
                className=" object-contain size-auto"
              />
            </DataLabel>
          </div>

          {/* cart books (items) cards */}

          <div className="max-h-[250px] mt-8 overflow-y-auto flex flex-col gap-6">
            {Array.from({ length: 3 })?.map((_: any) => (
              <div className="flex flex-col md:flex-row gap-[24px] pb-3 border-b border-gray-200">
                <div className="relative size-24 bg-background rounded-lg aspect-square">
                  <Image
                    className="object-contain"
                    src={item?.model?.cover || "/assets/grade-placeholder.png"}
                    fill
                    alt="cart book item"
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-bold ">{item?.model?.name}</h3>
                  <hr className="border-primary-700 mt-2 mb-4" />
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
