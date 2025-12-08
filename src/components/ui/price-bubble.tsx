import { cn } from "@/lib/utils";
import PriceBadge from "./PriceBadge";

function PriceBubbles({
  sale,
  price,
  className,
  currencyClassName,
  numberClassName,
  discountClassName,
  badgeClassName,
}: {
  sale?: { discount_type: number; discount_value: number; id: number };
  price: number | string;
  className?: string;
  currencyClassName?: string;
  numberClassName?: string;
  discountClassName?: string;
  badgeClassName?: string;
}) {
  if (sale?.id)
    return (
      <div className={cn("flex gap-2.5 ms-auto items-center", className)}>
        <PriceBadge
          price={Number(price)}
          variant="crossed"
          currencyClassName={currencyClassName}
          numberClassName={numberClassName}
        />
        <PriceBadge
          price={
            sale?.discount_type === 0
              ? ((100 - sale?.discount_value) / 100) * Number(price)
              : Number(price) - Number(sale?.discount_value)
          }
          variant="discount"
          className={badgeClassName}
          currencyClassName={currencyClassName}
          numberClassName={numberClassName}
        />
      </div>
    );
  else {
    return (
      <PriceBadge
        price={Number(price)}
        variant="default"
        className={badgeClassName}
        currencyClassName={currencyClassName}
        numberClassName={numberClassName}
      />
    );
  }
}

export default PriceBubbles;
