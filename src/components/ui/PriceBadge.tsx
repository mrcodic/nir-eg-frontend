import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#523412] text-lg  py-1",
  discount: "bg-semantics-green text-lg py-1",
  crossed: "bg-gray-light text-gray-dark text-lg  py-1 ",
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
        "font-bold text-white py-0.5 px-2 h-fit  rounded-lg flex items-center justify-center gap-1",
        variants[variant],
        className
      )}
    >
      <span className={variant === "crossed" ? "line-through" : ""}>
        {formattedPrice}
      </span>
      جنيه
    </div>
  );
}

export default PriceBadge;
