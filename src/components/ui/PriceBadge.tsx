import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#523412] text-sm  py-1",
  discount: "bg-[#1EAD7B] text-base",
  crossed: "bg-[#454545] text-xs line-through py-1",
};

function PriceBadge({
  price,
  className,
  variant = "default",
}: {
  price: number;
  className?: string;
  variant?: keyof typeof variants;
}) {
  const formattedPrice = price % 1 === 0 ? price.toString() : price.toFixed(2);

  return (
    <div
      className={cn(
        "font-bold text-white py-0.5 px-2 h-fit  rounded-lg flex items-center justify-center",
        variants[variant],
        className
      )}
    >
      {formattedPrice} جنيه
    </div>
  );
}

export default PriceBadge;
