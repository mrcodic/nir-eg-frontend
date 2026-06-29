import { cn } from "@/lib/utils";

const variants = {
  "out-of-stock": "bg-[#B75050]",
  "grade-1": "bg-primary-800",
  "grade-2": "bg-[#6C2932]",
  "grade-3": "bg-[#023E3E]",
};

const sides = {
  tl: "top-2 left-2",
  tr: "top-2 right-2",
  br: "bottom-2 right-2",
  bl: "bottom-2 left-2",
};

export type BookBadgeVariants = keyof typeof variants;
export type BookBadgeSides = keyof typeof sides;

const BookCardBadge = ({
  variant = "out-of-stock",
  side = "tl",
  className,
  text,
}: {
  variant?: BookBadgeVariants;
  side?: BookBadgeSides;
  className?: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        "absolute z-2 flex h-8 items-center justify-center rounded-lg px-2 py-1",
        variants[variant] || "bg-primary-800",
        sides[side],
        className,
      )}
    >
      <p className="text-sm font-bold text-white">{text} </p>
    </div>
  );
};

export default BookCardBadge;
