import { cn } from "@/lib/utils";

function SaleBubble({
  discountType,
  discountValue,
  className,
  text,
}: {
  discountType?: number;
  discountValue?: number | string;
  className?: string;
  text?: string;
}) {
  return (
    <div
      className={cn(
        "flex absolute top-6 -left-6 gap-1 items-center",
        className
      )}
    >
      <div className="bg-[url(/assets/Sale.svg)] re bg-cover flex items-center justify-center w-[48px] h-[48px]">
        <div className="text-center flex items-center justify-center">
          <span
            style={{
              textShadow:
                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
            }}
            className=" inline-block font-bold text-white text-center text-sm"
          >
            {text ||
              (discountType === 0
                ? discountValue + "%"
                : discountValue + "جنيه")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SaleBubble;
