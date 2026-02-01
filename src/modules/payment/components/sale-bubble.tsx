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
        "absolute top-6 -left-6 flex w-fit items-center gap-1",
        className,
      )}
    >
      <div className="re flex size-12 flex-col items-center justify-center bg-[url(/assets/Sale.svg)] bg-cover">
        <p
          style={{
            textShadow:
              "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
          }}
          className="flex flex-col text-center text-[14px] font-bold text-white"
        >
          <span className="text-xs">خصم</span>
          <span>
            {text ||
              (discountType === 0
                ? discountValue + "%"
                : discountValue + "جنيه")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default SaleBubble;
