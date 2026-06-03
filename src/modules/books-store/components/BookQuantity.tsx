"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/BooksStoreProvider";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/booksCartStore";
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
  const { decrementQuantity, incrementQuantity, getItemQuantity, items } =
    useCartStore((state) => state);

  const quantity = getItemQuantity(book.id);

  const debouncedIncrement = useMemo(
    () =>
      debounce((id: string) => {
        incrementQuantity(id);
      }, 300),
    [incrementQuantity],
  );

  const debouncedDecrement = useMemo(
    () =>
      debounce((id: string) => {
        decrementQuantity(id);
      }, 300),
    [decrementQuantity],
  );

  useCallback(() => {
    return () => {
      debouncedIncrement.cancel();
      debouncedDecrement.cancel();
    };
  }, [debouncedIncrement, debouncedDecrement]);

  if (!quantity) return null;

  return (
    <div className={cn("flex w-fit items-center gap-8", className)}>
      <Button
        className={cn("border-primary-800 size-11 border", buttonClassName)}
        onClick={() => debouncedDecrement(book.id)}
      >
        <Minus className="size-5 stroke-white" />
      </Button>

      <span className={cn("text-28 font-bold", textClassName)}>{quantity}</span>

      <Button
        className={cn("border-primary-800 size-11 border", buttonClassName)}
        onClick={() => debouncedIncrement(book.id)}
      >
        <Plus className="size-5 stroke-white" />
      </Button>
    </div>
  );
}

export default BookQuantity;
