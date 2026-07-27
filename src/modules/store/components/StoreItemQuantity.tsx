"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/StoreProvider";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { StoreItem } from "@/types/store.types";
import { debounce } from "lodash";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";

function StoreItemQuantity({
  item,
  className,
  buttonClassName,
  textClassName,
}: {
  item: Pick<StoreItem, "id">;
  className?: string;
  buttonClassName?: string;
  textClassName?: string;
}) {
  const isMounted = useMounted();
  const { toast } = useToast();

  const { decrementQuantity, incrementQuantity, getItemQuantity } =
    useCartStore((state) => state);

  const quantity = getItemQuantity(String(item.id));

  const debouncedIncrement = useMemo(
    () =>
      debounce((id: string) => {
        void incrementQuantity(id).catch((error: unknown) => {
          toast({
            icon: "error",
            description: getApiErrorMessage(
              error,
              "حدث خطأ أثناء تحديث الكمية.",
            ),
          });
        });
      }, 150),
    [incrementQuantity, toast],
  );

  const debouncedDecrement = useMemo(
    () =>
      debounce((id: string) => {
        void decrementQuantity(id).catch((error: unknown) => {
          toast({
            icon: "error",
            description: getApiErrorMessage(
              error,
              "حدث خطأ أثناء تحديث الكمية.",
            ),
          });
        });
      }, 150),
    [decrementQuantity, toast],
  );

  useEffect(() => {
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
        onClick={() => debouncedDecrement(String(item.id))}
      >
        <Minus className="size-5 stroke-white" />
      </Button>

      <span className={cn("text-28 font-bold", textClassName)}>{quantity}</span>

      <Button
        className={cn("border-primary-800 size-11 border", buttonClassName)}
        onClick={() => debouncedIncrement(String(item.id))}
      >
        <Plus className="size-5 stroke-white" />
      </Button>
    </div>
  );
}

export default StoreItemQuantity;
