"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/BooksStoreProvider";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types/books.types";
import { useRouter } from "next/navigation";
import React, { startTransition, useCallback, useState } from "react";

type Props = {
  children: React.ReactNode;
  navigate?: boolean;
  className?: string;
  book: Book;
};

const AddToCart: React.FC<Props> = ({
  children,
  navigate,
  className,
  book,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = addToCart(book);

      // if addToCart returns a promise, await it
      if (result instanceof Promise) {
        await result;
      }

      toast({
        icon: "success",
        description: "تمت إضافة الكتاب إلى السلة.",
      });

      if (navigate) {
        startTransition(() => {
          router.push("/books/cart");
        });
      }
    } catch (error) {
      console.error("ADD TO CART ERROR", error);
      toast({
        icon: "error",
        description: "حدث خطأ أثناء إضافة الكتاب للسلة.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addToCart, book, isProcessing, navigate, router, toast]);

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      disabled={isProcessing}
      aria-busy={isProcessing}
      aria-label="Add to cart"
    >
      {children}
    </Button>
  );
};

export default AddToCart;
