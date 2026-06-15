import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLessonTimedQuiz } from "../hooks/useLessonTimedQuiz";

type Props = {
  quiz: ReturnType<typeof useLessonTimedQuiz>;
};

export default function LessonTimedQuizScoreOverview({ quiz }: Props) {
  const {
    passed,
    score,
    activeQuizShowAnswer,
    isLoadingAnswers,
    closeAll,
    fetchShowAnswers,
  } = quiz;

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
      <div
        className={cn(
          "grid gap-3",
          activeQuizShowAnswer ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {activeQuizShowAnswer && (
          <Button
            variant="outline-primary"
            className="w-full"
            onClick={fetchShowAnswers}
            disabled={isLoadingAnswers}
          >
            {isLoadingAnswers ? (
              <SmallSpinner className="text-primary-800" />
            ) : (
              "عرض الاجابات"
            )}
          </Button>
        )}

        <Button className="w-full" onClick={closeAll}>
          اغلاق
        </Button>
      </div>
    </div>
  );
}
