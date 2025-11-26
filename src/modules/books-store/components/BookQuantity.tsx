"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/booksCartStore";
import { useCartStore } from "@/context/BooksStoreProvider";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

function BookQuantity({
  book,
  className,
  buttonClassName,
  textClassName,
}: {
  book: CartItem;
  className?: string;
  buttonClassName?: string;
  textClassName?: string;
}) {
  const { decrementQuantity, incrementQuantity, getItemQuantity } =
    useCartStore((state) => state);

  const quantity = getItemQuantity(book?.id);

  if (!quantity) return null;

  return (
    <div className={cn("flex gap-8 items-center w-fit", className)}>
      <Button
        className={cn(
          "size-11 border border-primary-800 bg-[#F6EADE] hover:bg-[#F6EADE] ",
          buttonClassName
        )}
        onClick={() => decrementQuantity(book?.id)}
      >
        <Minus className="stroke-[#121212] size-5" />
      </Button>

      <span className={cn("font-bold text-[28px]", textClassName)}>
        {quantity || 1}
      </span>

      <Button
        className={cn(
          "size-11 border border-primary-800 bg-[#F6EADE] hover:bg-[#F6EADE] ",
          buttonClassName
        )}
        onClick={() => incrementQuantity(book.id)}
      >
        <Plus className="stroke-[#121212] size-5" />
      </Button>
    </div>
  );
}

export default BookQuantity;
