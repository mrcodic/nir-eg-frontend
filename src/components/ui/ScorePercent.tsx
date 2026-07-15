import { cn } from "@/lib/utils";

const ScorePercent = ({
  score,
  passed,
}: {
  score: number;
  passed: boolean;
}) => {
  if (score === null) return null;
  return (
    <h3
      className={cn(
        "flex items-center text-xl font-bold",
        passed ? "text-semantics-green" : "text-semantics-red",
      )}
    >
      {Math.floor(score)}%
    </h3>
  );
};

export default ScorePercent;
