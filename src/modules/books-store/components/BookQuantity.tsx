"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/booksCartStore";
import { useCartStore } from "@/context/BooksStoreProvider";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Minus, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

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

  const quantity = getItemQuantity(book.id);

  const debouncedIncrement = useMemo(
    () =>
      debounce((id: string) => {
        incrementQuantity(id);
      }, 300),
    [incrementQuantity]
  );

  const debouncedDecrement = useMemo(
    () =>
      debounce((id: string) => {
        decrementQuantity(id);
      }, 300),
    [decrementQuantity]
  );

  useCallback(() => {
    return () => {
      debouncedIncrement.cancel();
      debouncedDecrement.cancel();
    };
  }, [debouncedIncrement, debouncedDecrement]);

  if (!quantity) return null;

  return (
    <div className={cn("flex gap-8 items-center w-fit", className)}>
      <Button
        className={cn(
          "size-11 border border-[#012D5A] bg-[#F6EADE] hover:bg-[#F6EADE]",
          buttonClassName
        )}
        onClick={() => debouncedDecrement(book.id)}
      >
        <Minus className="stroke-[#121212] size-5" />
      </Button>

      <span className={cn("font-bold text-[28px]", textClassName)}>
        {quantity}
      </span>

      <Button
        className={cn(
          "size-11 border border-[#012D5A] bg-[#F6EADE] hover:bg-[#F6EADE]",
          buttonClassName
        )}
        onClick={() => debouncedIncrement(book.id)}
      >
        <Plus className="stroke-[#121212] size-5" />
      </Button>
    </div>
  );
}

export default BookQuantity;
