import { cn } from "@/lib/utils";

const ScoreBadge = ({
  passed,
  type,
  className,
  text,
}: {
  passed: boolean;
  type: string;
  className?: string;
  text?: string;
}) => {
  return (
    <h3
      className={cn(
        "flex items-center font-bold text-sm min-w-20 py-1 px-2 rounded-lg justify-center",
        passed || type === "واجب"
          ? "text-semantics-green bg-semantics-green-light"
          : "text-semantics-red bg-semantics-red-light",
        className
      )}
    >
      {text || (type === "واجب" ? "تم الحل" : passed ? "ناجح" : "راسب")}
    </h3>
  );
};

export default ScoreBadge;
