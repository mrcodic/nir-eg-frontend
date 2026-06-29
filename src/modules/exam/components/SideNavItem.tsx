import { isParagraphCorrect, isQuestionCorrect } from "@/lib/utils";
import { memo, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SideNavLink from "./SideNavLink";

function isFieldAnswered({
  question,
  answers,
  isAnswer,
}: {
  question: any;
  answers: any;
  isAnswer: boolean;
}) {
  if (isAnswer) {
    if (question.type === 2) return isParagraphCorrect(question);
    if (question.type === 1) return isQuestionCorrect(question);
    return !!question?.essay?.is_correct;
  }

  const qValue = answers?.[question.id];

  if (question.type === 2) {
    return question.related_questions?.some((rq: any) => {
      const value = answers?.[rq.id];
      return question.has_multi_correct ? value?.length > 1 : value?.length > 0;
    });
  }

  if (question.type === 1) {
    return question.has_multi_correct ? qValue?.length > 1 : qValue?.length > 0;
  }

  return qValue?.text?.length > 0 || qValue?.attachment || undefined;
}

const SideNavItem = function SideNavItem({
  question,
  index,
  isAnswer,
}: {
  question: any;
  index: number;
  isAnswer: boolean;
}) {
  const { control } = useFormContext();
  const watchNames =
    question.type === 2
      ? (question.related_questions?.map((rq: any) => `questions.${rq.id}`) ??
          [])
      : (`questions.${question.id}` as const);

  const answers = useWatch({
    control,
    name: watchNames,
  });

  const normalizedAnswers =
    question.type === 2 && Array.isArray(answers)
      ? question.related_questions?.reduce(
          (acc: Record<number, unknown>, rq: any, currentIndex: number) => {
            acc[rq.id] = answers[currentIndex];
            return acc;
          },
          {},
        ) ?? {}
      : { [question.id]: answers };

  const fieldAnswered = useMemo(() => {
    return isFieldAnswered({
      question,
      answers: normalizedAnswers,
      isAnswer,
    });
  }, [question, normalizedAnswers, isAnswer]);

  return (
    <SideNavLink
      // question={question}
      index={index}
      isAnswer={isAnswer}
      fieldAnswered={fieldAnswered}
    />
  );
};

export default memo(SideNavItem);
