import { FormField, FormItem } from "@/components/ui/form";
import ReadingBorder from "@/components/ui/paragraph-borders";
import AnswerOption from "./AnswerOption";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

type Props = {
  question: any;
  index: number;
  form: any;
  status: any;
  listRef: any;
  isAnswer: boolean;
  isSubQuestion?: boolean;
};

const Question = ({
  question,
  index,
  form,
  status,
  listRef,
  isAnswer,
  isSubQuestion,
}: Props) => {
  const error = form?.formState?.errors?.questions?.[question?.id];
  const notSolvedQuestion =
    isAnswer && question.answers.some((el) => !el.selected && el.correct);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={isSubQuestion ? `sub-question-${index}` : `question-${index}`}
    >
      <div className="flex  gap-2  flex-col">
        <QuestionHeader
          showQuestionNumber={isSubQuestion}
          showSeperator={index > 0}
          index={index}
          error={error || notSolvedQuestion}
          multiCorrect={question?.has_multi_correct}
        />

        {question?.has_multi_correct && (
          <p className="font-bold text-colorPrimary self-end w-fit">
            يوجد اكثر من اجابة
          </p>
        )}
      </div>

      <div dir="ltr" className="space-y-4">
        <QuestionTitle
          title={question.title}
          video={question?.answer_video}
          isSubQuestion={isSubQuestion}
        />

        <FormField
          control={form.control}
          name={`questions.${question.id}`}
          render={({ field }) => (
            <FormItem>
              <div className="grid gap-2">
                {question?.answers?.map((answer, idx) => (
                  <AnswerOption
                    key={answer.id}
                    answer={answer}
                    index={idx}
                    questionId={question.id}
                    disabled={status}
                    field={field}
                    isMultiple={question?.has_multi_correct}
                    form={form}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

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

export default Question;
