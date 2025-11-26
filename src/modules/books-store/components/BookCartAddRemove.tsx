"use client";

import { useCartStore } from "@/context/BooksStoreProvider";
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
  const { checkIfItemExists, items } = useCartStore((state) => state);
  const itemExists = checkIfItemExists(book?.id);

  return itemExists ? (
    <RemoveFromCart
      id={book?.id}
      className={cn(
        "ps-2 pe-3 h-8 border bg-transparent text-red-700 border-red-700 rounded-xl hover:bg-red-700 hover:text-white",
        buttonClassName
      )}
    >
      <Trash className="size-6" />
      ازالة من السلة
    </RemoveFromCart>
  ) : (
    <AddToCart
      book={book}
      className={cn(
        "ps-2 pe-3 h-8 border bg-transparent text-primary-800 border-primary-800 rounded-xl hover:bg-primary-800 hover:text-white",
        buttonClassName
      )}
    >
      <ShoppingCart className="size-6" />
      اضافة للسلة
    </AddToCart>
  );
}

export default BookCartAddRemove;
