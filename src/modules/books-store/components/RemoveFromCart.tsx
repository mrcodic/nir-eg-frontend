"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/BooksStoreProvider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { startTransition, useCallback, useState } from "react";

type Props = {
  children: React.ReactNode;
  navigate?: boolean;
  className?: string;
  id: string;
};

const RemoveFromCart: React.FC<Props> = ({
  children,
  navigate,
  className,
  id,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveFromCart = useCallback(async () => {
    if (isProcessing) return; // guard against rapid repeats
    setIsProcessing(true);

    try {
      // If removeFromCart is sync it's fine; if it's async, await it.
      const result = removeFromCart(id);
      if (result instanceof Promise) {
        await result;
      }

      toast({
        icon: "success",
        description: "تمت إزالة الكتاب من السلة.",
      });

      if (navigate) {
        // don't block UI thread for navigation
        startTransition(() => {
          router.push("/books/cart");
        });
      }
    } catch (error) {
      console.error("removeFromCart error:", error);
      toast({
        icon: "error",
        description: "حدث خطأ أثناء إزالة الكتاب من السلة.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [id, isProcessing, removeFromCart, navigate, router, toast]);

  return (
    <Button
      onClick={handleRemoveFromCart}
      className={className}
      disabled={isProcessing}
      aria-busy={isProcessing}
      aria-label="Remove from cart"
    >
      {children}
    </Button>
  );
};

export default RemoveFromCart;
