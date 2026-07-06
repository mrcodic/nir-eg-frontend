"use client";

import { useCartStore } from "@/context/BooksStoreProvider";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { Book } from "@/types/books.types";
import { ShoppingCart, Trash } from "lucide-react";
import AddToCart from "./AddToCart";
import RemoveFromCart from "./RemoveFromCart";

function BookCartAddRemove({
  book,
  buttonClassName,
}: {
  book: Book;
  buttonClassName?: string;
}) {
  const isMounted = useMounted();
  const { checkIfItemExists } = useCartStore((state) => state);
  const itemExists = checkIfItemExists(book?.id);

  return !isMounted || itemExists ? (
    <RemoveFromCart
      id={book?.id}
      className={cn(
        "h-8 rounded-xl border border-red-700 bg-transparent ps-2 pe-3 text-red-700 hover:bg-red-700 hover:text-white",
        buttonClassName,
      )}
    >
      <Trash className="size-6" />
      ازالة من السلة
    </RemoveFromCart>
  ) : (
    <AddToCart
      book={book}
      className={cn(
        "text-primary-800 border-primary-800 hover:bg-primary-800 h-8 rounded-xl border bg-transparent ps-2 pe-3 hover:text-white",
        buttonClassName,
      )}
    >
      <ShoppingCart className="size-6" />
      اضافة للسلة
    </AddToCart>
  );
}

export default BookCartAddRemove;
