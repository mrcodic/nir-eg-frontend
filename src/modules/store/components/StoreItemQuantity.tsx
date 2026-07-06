"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/StoreProvider";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/storeCartStore";
import { debounce } from "lodash";
import { Minus, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

function StoreItemQuantity({
  item,
  className,
  buttonClassName,
  textClassName,
}: {
  item: CartItem;
  className?: string;
  buttonClassName?: string;
  textClassName?: string;
}) {
  const isMounted = useMounted();

  const { decrementQuantity, incrementQuantity, getItemQuantity } =
    useCartStore((state) => state);

  const quantity = getItemQuantity(item.id);

  const debouncedIncrement = useMemo(
    () =>
      debounce((id: string) => {
        incrementQuantity(id);
      }, 150),
    [incrementQuantity],
  );

  const debouncedDecrement = useMemo(
    () =>
      debounce((id: string) => {
        decrementQuantity(id);
      }, 150),
    [decrementQuantity],
  );

  useCallback(() => {
    return () => {
      debouncedIncrement.cancel();
      debouncedDecrement.cancel();
    };
  }, [debouncedIncrement, debouncedDecrement]);

  if (!isMounted || !quantity) return null;

  return (
    <div className={cn("flex w-fit items-center gap-8", className)}>
      <Button
        className={cn("border-primary-800 size-11 border", buttonClassName)}
        onClick={() => debouncedDecrement(item.id)}
      >
        <Minus className="size-5 stroke-white" />
      </Button>

      <span className={cn("text-28 font-bold", textClassName)}>{quantity}</span>

      <Button
        className={cn("border-primary-800 size-11 border", buttonClassName)}
        onClick={() => debouncedIncrement(item.id)}
      >
        <Plus className="size-5 stroke-white" />
      </Button>
    </div>
  );
}

export default StoreItemQuantity;
