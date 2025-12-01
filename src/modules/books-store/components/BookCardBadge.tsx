import { cn } from "@/lib/utils";

const variants = {
  "out-of-stock": "bg-[#B75050]",
  "grade-1": "bg-[#012D5A]",
  "grade-2": "bg-[#6C2932]",
  "grade-3": "bg-[#023E3E]",
};

const sides = {
  tl: "top-2 left-2",
  tr: "top-2 right-2",
  br: "bottom-2 right-2",
  bl: "bottom-2 left-2",
};

const BookCardBadge = ({
  variant = "out-of-stock",
  side = "tl",
  className,
  text,
}: {
  variant?: keyof typeof variants;
  side?: keyof typeof sides;
  className?: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center z-2  absolute h-8 px-2 py-1 rounded-lg",
        variants[variant] || "bg-[#012D5A]",
        sides[side],
        className
      )}
    >
      <p className="text-sm text-white font-bold">{text} </p>
    </div>
  );
};

export default BookCardBadge;
