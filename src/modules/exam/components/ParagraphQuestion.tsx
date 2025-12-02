import ReadingBorder from "@/components/ui/paragraph-borders";
import Question from "./Question";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

const ParagraphQuestion = ({
  question,
  index,
  form,
  status,
  listRef,
  isAnswer,
}) => {
  const allQuestionsAnswers =
    isAnswer && question?.related_questions?.flatMap((el) => el?.answers);
  const notSolvedQuestion =
    isAnswer && allQuestionsAnswers.some((el) => !el.selected && el.correct);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
    >
      <QuestionHeader
        index={index}
        error={
          form?.formState?.errors?.questions?.[question?.id] ||
          notSolvedQuestion
        }
        showSeperator={index > 0}
        multiCorrect={true}
      />

      <div dir="ltr space-y-2">
        <QuestionTitle
          title={question.title}
          video={question?.answer_video}
          isSubQuestion={false}
        />

        <div className="pl-8 space-y-4 border-l border-gray-200">
          {question?.related_questions?.map((relatedQuestion, idx) => (
            <Question
              key={relatedQuestion.id}
              question={relatedQuestion}
              index={idx}
              form={form}
              status={status}
              listRef={listRef}
              isAnswer={isAnswer}
              isSubQuestion={true}
            />
          ))}
        </div>
        {isAnswer && question?.explanation && (
          <div className="mt-2">
            <ReadingBorder text="شرح الإجابة" />
            <p
              className="break-all *:break-all "
              dangerouslySetInnerHTML={{
                __html: question?.explanation,
              }}
            ></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParagraphQuestion;
