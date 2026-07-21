"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/StoreProvider";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
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
      await removeFromCart(id);

      toast({
        icon: "success",
        description: "تمت إزالة المنتج من السلة.",
      });

      if (navigate) {
        // don't block UI thread for navigation
        startTransition(() => {
          router.push("/store/cart");
        });
      }
    } catch (error) {
      toast({
        icon: "error",
        description: getApiErrorMessage(
          error,
          "حدث خطأ أثناء إزالة المنتج من السلة.",
        ),
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
