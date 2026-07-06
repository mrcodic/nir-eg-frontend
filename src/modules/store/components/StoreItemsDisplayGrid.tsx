import { cn } from "@/lib/utils";
import { StoreItem } from "@/types/store.types";
import StoreItemCard from "./StoreItemCard";

function StoreItemsDisplayGrid({
  items,
  className,
}: {
  items: StoreItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items?.map((book) => (
        <StoreItemCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default StoreItemsDisplayGrid;
