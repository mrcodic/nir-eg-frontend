import { isParagraphCorrect, isQuestionCorrect } from "@/lib/utils";
import { memo, useMemo } from "react";
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

  return qValue?.text?.length > 0;
}

const SideNavItem = function SideNavItem({
  question,
  index,
  answers,
  isAnswer,
}: {
  question: any;
  index: number;
  answers: any;
  isAnswer: boolean;
}) {
  const fieldAnswered = useMemo(() => {
    return isFieldAnswered({
      question,
      answers,
      isAnswer,
    });
  }, [question, answers, isAnswer]);

  return (
    <SideNavLink
      question={question}
      index={index}
      isAnswer={isAnswer}
      fieldAnswered={fieldAnswered}
    />
  );
};

export default memo(SideNavItem);
