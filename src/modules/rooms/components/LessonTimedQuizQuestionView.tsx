import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { cn, numberToArabicOrdinal } from "@/lib/utils";
import { Circle } from "lucide-react";
import { useLessonTimedQuiz } from "../hooks/useLessonTimedQuiz";

type Props = {
  quiz: ReturnType<typeof useLessonTimedQuiz>;
};

export default function LessonTimedQuizQuestionView({ quiz }: Props) {
  const {
    currentQuestion: question,
    currentQuestionIndex: questionIndex,
    questions,
    answeredQuestionIds,
    selectedAnswers,
    isSubmitting,
    toggleAnswer: onPickAnswer,
    setCurrentQuestionIndex: onGoToQuestion,
    handleConfirm: onConfirm,
    handleSkip: onSkip,
    goToNextQuestion,
    goToPreviousQuestion,
  } = quiz;

  if (!question) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-primary-800 text-right text-2xl font-bold">
        {`أجب على السؤال ${numberToArabicOrdinal(questionIndex + 1)}`}
      </h3>
      <div
        className="text-right text-2xl leading-relaxed"
        dangerouslySetInnerHTML={{ __html: question.title ?? "" }}
      />
      <div className="space-y-3">
        {(question.answers ?? []).map((answer) => {
          const answerId = String(answer.id);
          const checked = selectedAnswers.includes(answerId);
          return (
            <button
              key={answer.id}
              type="button"
              className={cn(
                "border-gray-light flex w-full items-center gap-3 rounded-xl border p-4 text-right transition-all",
                checked && "border-primary-800 bg-primary-50",
              )}
              onClick={() => onPickAnswer(question.id, answerId)}
            >
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border border-black",
                  { "border-primary-800": checked },
                )}
              >
                {checked ? (
                  <Circle className="text-primary-800 fill-primary-800 size-3" />
                ) : null}
              </div>
              <div
                className="text-gray-dark text-lg"
                dangerouslySetInnerHTML={{
                  __html: answer.valueInput || answer.valueCk || "",
                }}
              />
            </button>
          );
        })}
      </div>
      {questions.length > 1 ? (
        <div className="flex items-center justify-center gap-2 py-1">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => onGoToQuestion(index)}
              className={cn(
                "size-2 rounded-full transition-all",
                index === questionIndex && "bg-primary-800 w-6",
                index !== questionIndex &&
                  answeredQuestionIds.has(q.id) &&
                  "bg-semantics-green",
                index !== questionIndex &&
                  !answeredQuestionIds.has(q.id) &&
                  "bg-primary-100",
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
              onClick={goToPreviousQuestion}
              disabled={isSubmitting || questionIndex === 0}
            >
              السابق
            </Button>
            <Button
              variant="secondary"
              onClick={goToNextQuestion}
              disabled={isSubmitting || questionIndex === questions.length - 1}
            >
              التالي
            </Button>
          </>
        )}
        <Button onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? <SmallSpinner className="text-white" /> : "تأكيد"}
        </Button>
        <Button
          variant="outline-primary"
          onClick={onSkip}
          disabled={isSubmitting}
        >
          تخطي
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3"></div>
    </div>
  );
}
