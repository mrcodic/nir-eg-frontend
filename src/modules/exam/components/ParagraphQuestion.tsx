import ReadingBorder from "@/components/ui/paragraph-borders";
import { memo } from "react";
import Question from "./Question";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

type Props = {
  question: any;
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
  const allQuestionsAnswers =
    isAnswer && question.related_questions?.flatMap((q) => q.answers);

  const notSolvedQuestion =
    isAnswer && allQuestionsAnswers?.some((a) => !a.selected && a.correct);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el!;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
      className="bg-background p-4 rounded-lg"
    >
      <QuestionHeader index={index} error={notSolvedQuestion} multiCorrect />

      <div dir="ltr" className="space-y-2">
        <QuestionTitle
          title={question.title}
          video={question.answer_video}
          isSubQuestion={false}
        />

        <div className="pl-4 space-y-4 border-l border-gray-200">
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
