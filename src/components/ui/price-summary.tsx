import { cn, formatCurrency } from "@/lib/utils";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import DataLabel from "../custom/DataLabel";

function PriceSummary({
  totalPrice,
  finalPrice,
  couponDiscount,
  className,
}: {
  totalPrice: number;
  finalPrice: number;
  couponDiscount?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {!!couponDiscount && (
        <DataLabel
          text="الخصم"
          value={formatCurrency(couponDiscount)}
          className="justify-between text-sm font-bold sm:text-lg"
        />
      )}

      <DataLabel
        text="إجمالي السعر"
        className="justify-between text-sm font-bold sm:text-lg"
      >
        <PriceBadge price={finalPrice} />
      </DataLabel>
    </div>
  );
}

export default PriceSummary;
