import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  passed: boolean;
  score: number;
  onContinue: () => void;
};

export default function LessonTimedQuizResultView({
  passed,
  score,
  onContinue,
}: Props) {
  return (
    <div className="space-y-6 py-2">
      <div className="text-center text-5xl">{passed ? "🥳" : "😭"}</div>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-2 text-lg font-bold",
          passed
            ? "border-semantics-green bg-semantics-green-50"
            : "border-semantics-red bg-semantics-red-50",
        )}
      >
        <span>{`حصلت على ${score}%`}</span>
        <span
          className={cn(
            "rounded-md px-3 py-1 text-sm text-white",
            passed ? "bg-semantics-green" : "bg-semantics-red",
          )}
        >
          {passed ? "ناجح" : "راسب"}
        </span>
      </div>
      <Button className="w-full" onClick={onContinue}>
        استمرار
      </Button>
    </div>
  );
}
