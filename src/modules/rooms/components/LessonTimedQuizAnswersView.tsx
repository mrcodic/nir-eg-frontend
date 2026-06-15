import { Button } from "@/components/ui/button";
import { cn, getAnswerState, numberToArabicOrdinal } from "@/lib/utils";
import { Check, Circle, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useLessonTimedQuiz } from "../hooks/useLessonTimedQuiz";

type Props = {
  quiz: ReturnType<typeof useLessonTimedQuiz>;
};

export default function LessonTimedQuizAnswersView({ quiz }: Props) {
  const { showAnswersQuestions: questions, closeAll } = quiz;

  // ── Local pagination ──
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex] ?? null;

  const goToNext = useCallback(() => {
    setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goToPrevious = useCallback(() => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const answeredQuestion = useMemo(() => {
    return question?.answers
      ? question.answers.some((ans) => ans?.selected)
      : false;
  }, [question]);

  if (!question) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-primary-800 text-right text-2xl font-bold">
        {`السؤال ${numberToArabicOrdinal(questionIndex + 1)}`}
      </h3>

      {!answeredQuestion && (
        <p className="text-sm text-red-500">
          {question?.has_multi_correct
            ? "لم تقم بالاجابة على جميع الاجابات المطلوبة"
            : "لم تقم بالاجابة على هذا السؤال"}
        </p>
      )}

      <div
        className="text-right text-2xl leading-relaxed"
        dangerouslySetInnerHTML={{ __html: question.title ?? "" }}
      />

      <div className="space-y-3">
        {(question.answers ?? []).map((answer) => {
          const state = getAnswerState(answer);

          const borderClass =
            state === "correct-selected"
              ? "border-green-500 bg-green-50"
              : state === "correct-unselected"
                ? "border-green-500 bg-green-50"
                : state === "incorrect-selected"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-light";

          const iconColor =
            state === "correct-selected" || state === "correct-unselected"
              ? "text-green-600"
              : state === "incorrect-selected"
                ? "text-red-600"
                : "text-gray-400";

          return (
            <div
              key={answer.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-right transition-all",
                borderClass,
              )}
            >
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  state === "correct-selected" || state === "correct-unselected"
                    ? "border-green-500"
                    : state === "incorrect-selected"
                      ? "border-red-500"
                      : "border-black",
                )}
              >
                {state === "correct-selected" ? (
                  <Check className={cn("size-3", iconColor)} />
                ) : state === "incorrect-selected" ? (
                  <X className={cn("size-3", iconColor)} />
                ) : state === "correct-unselected" ? (
                  <Check className={cn("size-3", iconColor)} />
                ) : (
                  <Circle className="size-3 text-transparent" />
                )}
              </div>

              <div
                className={cn(
                  "text-lg",
                  state === "correct-selected" || state === "correct-unselected"
                    ? "text-green-700"
                    : state === "incorrect-selected"
                      ? "text-red-700"
                      : "text-gray-dark",
                )}
                dangerouslySetInnerHTML={{
                  __html: answer.valueInput || answer.valueCk || "",
                }}
              />
            </div>
          );
        })}
      </div>

      {question.explanation && (
        <div className="mt-2">
          <hr className="border-primary-100 my-4 h-px w-full" />
          <p
            className="text-gray-dark text-right text-base leading-relaxed break-all *:break-all"
            dangerouslySetInnerHTML={{
              __html: question.explanation,
            }}
          />
        </div>
      )}

      {questions.length > 1 ? (
        <div className="flex items-center justify-center gap-2 py-1">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setQuestionIndex(index)}
              className={cn(
                "size-2 rounded-full transition-all",
                index === questionIndex && "bg-primary-800 w-6",
                index !== questionIndex && "bg-primary-100",
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {questions.length > 1 && (
          <>
            <Button
              variant="secondary"
              onClick={goToPrevious}
              disabled={questionIndex === 0}
            >
              السابق
            </Button>
            <Button
              variant="secondary"
              onClick={goToNext}
              disabled={questionIndex === questions.length - 1}
            >
              التالي
            </Button>
          </>
        )}
        <Button
          className={questions.length > 1 ? "col-span-2" : "col-span-2"}
          onClick={closeAll}
        >
          إغلاق
        </Button>
      </div>
    </div>
  );
}
