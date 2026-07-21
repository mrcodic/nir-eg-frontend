import { cn } from "@/lib/utils";

const OutOfStockBadge = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-2 left-2 flex h-8 items-center justify-center rounded-lg bg-[#B75050] px-2 py-1",
        className,
      )}
    >
      <p className="text-sm font-bold text-white">غير متاح حاليًا</p>
    </div>
  );
};

export default OutOfStockBadge;
