import { cn } from "@/lib/utils";

const ScorePercent = ({
  score,
  passed,
  type,
}: {
  score: number;
  passed: boolean;
  type: string;
}) => {
  return (
    <h3
      className={cn(
        "flex items-center font-bold text-xl",
        passed ? "text-semantics-green" : "text-semantics-red"
      )}
    >
      {score}%
    </h3>
  );
};

export default ScorePercent;
