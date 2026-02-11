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
  if (score === null) return null;
  return (
    <h3
      className={cn(
        "flex items-center text-xl font-bold",
        passed ? "text-semantics-green" : "text-semantics-red",
      )}
    >
      {score}%
    </h3>
  );
};

export default ScorePercent;
