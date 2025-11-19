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
      {/* <DataLabel
        text="السعر"
        value={formatCurrency(totalPrice)}
        className="justify-between text-sm sm:text-lg font-bold"
      /> */}

      {!!couponDiscount && (
        <DataLabel
          text="الخصم"
          value={formatCurrency(couponDiscount)}
          className="justify-between text-sm sm:text-lg font-bold"
        />
      )}

      <DataLabel
        text="إجمالي السعر"
        value={formatCurrency(finalPrice)}
        className="justify-between text-sm sm:text-lg font-bold"
      />
    </div>
  );
}

export default PriceSummary;
