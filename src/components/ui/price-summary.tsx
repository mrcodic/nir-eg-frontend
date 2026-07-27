import { cn, formatCurrency } from "@/lib/utils";
import DataLabel from "../custom/DataLabel";

function PriceSummary({
  finalPrice,
  couponDiscount,
  originalPrice,
  className,
}: {
  finalPrice: number;
  couponDiscount?: number;
  originalPrice?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {originalPrice !== undefined && originalPrice > finalPrice && (
        <DataLabel
          text="السعر قبل الخصم"
          className="justify-between text-sm font-bold"
          value={formatCurrency(originalPrice)}
        />
      )}

      {!!couponDiscount && (
        <DataLabel
          text="الخصم"
          value={formatCurrency(couponDiscount)}
          className="justify-between text-sm font-bold"
        />
      )}

      <DataLabel
        text="إجمالي السعر"
        className="flex-wrap justify-between text-sm font-bold sm:text-lg"
        value={formatCurrency(finalPrice)}
      />
    </div>
  );
}

export default PriceSummary;
