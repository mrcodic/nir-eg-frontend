import { cn } from "@/lib/utils";

const variants = {
  default: "bg-semantics-green text-lg  py-1",
  discount: "bg-semantics-green text-lg py-1",
  crossed: "bg-gray-light text-gray-dark text-lg  py-1 ",
};

function PriceBadge({
  price,
  className,
  currencyClassName,
  numberClassName,
  variant = "default",
}: {
  price: number | string;
  className?: string;
  currencyClassName?: string;
  numberClassName?: string;
  variant?: keyof typeof variants;
}) {
  const formattedPrice =
    Number(price) % 1 === 0 ? price.toString() : Number(price).toFixed(2);

  return (
    <div
      className={cn(
        "flex h-fit items-center justify-center gap-1 rounded-lg px-2 py-0.5 font-bold text-white",
        variants[variant],
        className,
      )}
    >
      {formattedPrice == "0" ? (
        <span className={numberClassName}>مجانى</span>
      ) : (
        <>
          <span
            className={cn(
              variant === "crossed" ? "line-through" : "",
              numberClassName,
            )}
          >
            {formattedPrice}
          </span>
          <span className={currencyClassName}>جنيه</span>
        </>
      )}
    </div>
  );
}

export default PriceBadge;
