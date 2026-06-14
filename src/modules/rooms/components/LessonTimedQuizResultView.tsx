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
          "flex items-center rounded-lg border px-4 py-2 text-lg font-bold",
          passed ? "border-semantics-green" : "border-semantics-red",
        )}
      >
        حصلت على
        <span className="ms-1 underline underline-offset-2"> {score}%</span>
        <span
          className={cn(
            "ms-auto rounded-md px-3 py-1 text-sm text-white",
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
