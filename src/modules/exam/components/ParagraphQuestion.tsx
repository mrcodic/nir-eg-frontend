import ReadingBorder from "@/components/ui/paragraph-borders";
import { memo, useMemo } from "react";
import Question from "./Question";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";
import { QuizQuestion } from "@/types";

type Props = {
  question: QuizQuestion;
  index: number;
  listRef: React.MutableRefObject<HTMLDivElement[]>;
  status: boolean;
  isAnswer: boolean;
};

const ParagraphQuestion = ({
  question,
  index,
  listRef,
  status,
  isAnswer,
}: Props) => {
  const allQuestionsAnswers = useMemo(
    () => isAnswer && question.related_questions?.map((q) => q.answers),
    [isAnswer, question.related_questions],
  );

  const notFullyAnsweredQuestions = useMemo(() => {
    if (!isAnswer) return;

    let notFullyAnswered = false;

    for (const answers of allQuestionsAnswers) {
      const hasSelectedAnswer = answers.some((ans) => ans.selected);
      if (!hasSelectedAnswer) {
        notFullyAnswered = true;
        break;
      }
    }

    return notFullyAnswered;
  }, [isAnswer, allQuestionsAnswers]);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el!;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
      className="bg-background rounded-lg p-4"
    >
      <QuestionHeader
        index={index}
        error={notFullyAnsweredQuestions}
        multiCorrect
      />

      <div dir="ltr" className="space-y-2">
        <QuestionTitle
          title={question.title}
          video={question.answer_video}
          isSubQuestion={false}
        />

        <div className="space-y-4 border-l border-gray-200 pl-4">
          {question.related_questions?.map((rq, idx) => (
            <Question
              key={rq.id}
              question={rq}
              index={idx}
              status={status}
              listRef={listRef}
              isAnswer={isAnswer}
              isSubQuestion
            />
          ))}
        </div>

        {isAnswer && question.explanation && (
          <div className="mt-2">
            <ReadingBorder text="شرح الإجابة" />
            <p
              className="break-all *:break-all"
              dangerouslySetInnerHTML={{
                __html: question.explanation,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ParagraphQuestion);
