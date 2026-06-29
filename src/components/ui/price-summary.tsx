import { cn, formatCurrency } from "@/lib/utils";
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
        value={formatCurrency(finalPrice)}
        className="justify-between text-sm font-bold sm:text-lg"
      />
    </div>
  );
}

export default PriceSummary;
