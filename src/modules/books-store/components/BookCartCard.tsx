import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import { cn, formatCurrency } from "@/lib/utils";
import { CartItem } from "@/store/booksCartStore";
import { Trash } from "lucide-react";
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
      <div className="bg-background relative aspect-square size-24">
        <CustomImage
          src={item?.image}
          fallback="/assets/book.svg"
          alt="book"
          fill
        />
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col gap-1">
          <RemoveFromCart
            id={item.id}
            className="ms-auto h-auto w-fit bg-transparent p-0 text-red-500 hover:bg-transparent"
          >
            <Trash className="size-6" />{" "}
            <span className="font-bold underline">ازالة من السلة</span>
          </RemoveFromCart>

          <h3 className="border-gray-light border-b pb-2 text-lg font-bold">
            {item?.name}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <DataWithLabel
            className="flex-wrap"
            label="سعر القطعة"
            data={formatCurrency(item.price)}
          />

          <div className="flex flex-wrap items-end justify-between gap-2">
            <DataWithLabel
              className="flex-wrap"
              label="اجمالي السعر"
              data={formatCurrency((item.quantity || 1) * Number(item.price))}
              dataClassName="text-white bg-[#1EAD7B] py-1 px-2 rounded-lg"
            />

            <BookQuantity
              book={item}
              className="ms-auto gap-4"
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
