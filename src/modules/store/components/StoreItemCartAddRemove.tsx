"use client";

import { useCartStore } from "@/context/StoreProvider";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { StoreItem } from "@/types/store.types";
import { ShoppingCart, Trash } from "lucide-react";
import AddToCart from "./AddToCart";
import RemoveFromCart from "./RemoveFromCart";

function StoreItemCartAddRemove({
  item,
  buttonClassName,
}: {
  item: StoreItem;
  buttonClassName?: string;
}) {
  const isMounted = useMounted();
  const { checkIfItemExists } = useCartStore((state) => state);
  const itemExists = checkIfItemExists(item?.id);

  return !isMounted || itemExists ? (
    <RemoveFromCart
      id={item?.id}
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
      item={item}
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

export default StoreItemCartAddRemove;
