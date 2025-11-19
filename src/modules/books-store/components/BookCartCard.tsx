import DataWithLabel from "@/components/ui/DataWithLabel";
import { CartItem } from "@/context/booksCartStore";
import { cn, formatCurrency } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import BookQuantity from "./BookQuantity";
import RemoveFromCart from "./RemoveFromCart";

function BookCartCard({
  item,
  className,
}: {
  item: CartItem;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-6 pt-6 pb-3", className)}>
      <div className="relative size-24 aspect-square bg-background">
        <Image src={"/assets/book.svg"} alt="book" fill />
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col gap-1">
          <RemoveFromCart
            id={item.id}
            className="h-auto ms-auto w-fit p-0 text-red-500 bg-transparent hover:bg-transparent"
          >
            <Trash className="size-6" />{" "}
            <span className="underline font-bold ">ازالة من السلة</span>
          </RemoveFromCart>

          <h3 className="border-b border-primary-700 font-bold text-lg pb-2">
            {item?.name}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <DataWithLabel
            className="flex-wrap"
            label="سعر القطعة"
            data={formatCurrency(item.price)}
          />

          <div className="flex flex-wrap items-end gap-2 justify-between">
            <DataWithLabel
              className="flex-wrap"
              label="اجمالي السعر"
              data={formatCurrency((item.quantity || 1) * Number(item.price))}
              dataClassName="text-white bg-[#1EAD7B] py-1 px-2 rounded-lg"
            />

            <BookQuantity
              book={item}
              className="gap-4 ms-auto"
              textClassName="text-[24px]"
              buttonClassName="size-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCartCard;
