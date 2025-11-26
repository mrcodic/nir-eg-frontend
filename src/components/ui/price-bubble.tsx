import { cn } from "@/lib/utils";
import PriceBadge from "./PriceBadge";

function PriceBubbles({
  sale,
  price,
  className,
}: {
  sale?: { discount_type: number; discount_value: number; id: number };
  price: number | string;
  className?: string;
}) {
  if (sale?.id)
    return (
      <div className={cn("flex gap-2.5 ms-auto items-center", className)}>
        <PriceBadge price={Number(price)} variant="crossed" />
        <PriceBadge
          price={
            sale?.discount_type === 0
              ? ((100 - sale?.discount_value) / 100) * Number(price)
              : Number(price) - Number(sale?.discount_value)
          }
          variant="discount"
        />
      </div>
    );
  else {
    return (
      <PriceBadge
        price={Number(price)}
        variant="default"
        className={className}
      />
    );
  }
}

export default PriceBubbles;
