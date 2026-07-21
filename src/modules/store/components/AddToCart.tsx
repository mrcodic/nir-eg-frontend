"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/StoreProvider";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import { StoreItem } from "@/types/store.types";
import { useRouter } from "next/navigation";
import React, { startTransition, useCallback, useState } from "react";

type Props = {
  children: React.ReactNode;
  navigate?: boolean;
  className?: string;
  item: StoreItem;
};

const AddToCart: React.FC<Props> = ({
  children,
  navigate,
  className,
  item,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await addToCart(item);

      toast({
        icon: "success",
        description: "تمت إضافة المنتج إلى السلة.",
      });

      if (navigate) {
        startTransition(() => {
          router.push("/store/cart");
        });
      }
    } catch (error) {
      toast({
        icon: "error",
        description: getApiErrorMessage(
          error,
          "حدث خطأ أثناء إضافة المنتج للسلة.",
        ),
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addToCart, item, isProcessing, navigate, router, toast]);

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
