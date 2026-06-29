import { cn } from "@/lib/utils";

const ScoreBadge = ({
  passed,
  type,
  className,
  text,
  pending,
}: {
  passed: boolean;
  type: string;
  className?: string;
  text?: string;
  pending?: boolean;
}) => {
  return (
    <h3
      className={cn(
        "flex min-w-20 items-center justify-center rounded-lg px-2 py-1 text-sm font-bold",
        passed || (type === "واجب" && !pending)
          ? "text-semantics-green bg-semantics-green-50"
          : pending
            ? "text-secondary bg-secondary-50 w-full"
            : "text-semantics-red bg-semantics-red-50",
        type === "واجب" && "w-full",
        className,
      )}
    >
      {text ||
        (type === "واجب" && !pending
          ? "تم الحل"
          : passed
            ? "ناجح"
            : pending
              ? "جارى التصحيح"
              : "راسب")}
    </h3>
  );
};

export default ScoreBadge;
