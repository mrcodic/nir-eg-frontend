"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/BooksStoreProvider";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types/books.types";
import { useRouter } from "next/navigation";

const AddToCart = ({
  children,
  navigate,
  className,
  book,
}: {
  children: React.ReactNode;
  navigate?: boolean;
  className?: string;
  book: Book;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    try {
      addToCart(book);
      if (navigate) {
        router.push("/books/cart");
      }
    } catch (error) {
      console.log("ADD TO CART ERROR", error);
      toast({
        icon: "error",
        description: "حدث خطاء اثناء اضافه الكتاب للسله",
      });
    }
  };

  return (
    <Button onClick={handleAddToCart} className={className}>
      {children}
    </Button>
  );
};

export default AddToCart;
