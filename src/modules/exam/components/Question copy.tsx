import { FormField, FormItem } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import AnswerOption from "./AnswerOption";
import QuestionTitle from "./QuestionTitle";
import QuestionHeader from "./QuestionHeader";
import ReadingBorder from "@/components/ui/paragraph-borders";

const Question = ({ question, index, form, status, listRef, isAnswer }) => {
  const error = form?.formState?.errors?.questions?.[question?.id]?.["0"];
  const notSolvedQuestion =
    isAnswer && question.answers.every((el) => !el.selected);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
    >
      <QuestionHeader index={index} error={error || notSolvedQuestion} />

      <div dir="ltr space-y-2">
        <QuestionTitle title={question.title} video={question?.answer_video} />

        <FormField
          control={form.control}
          name={`questions.${question.id}.0`}
          render={({ field }) => (
            <FormItem>
              <RadioGroup onValueChange={field.onChange} value={field.value}>
                {question?.answers?.map((answer, idx) => (
                  <AnswerOption
                    key={answer.id}
                    answer={answer}
                    index={idx}
                    questionId={question.id}
                    disabled={status}
                    field={field}
                  />
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        {isAnswer && question?.explanation && (
          <div className="mt-2">
            <ReadingBorder text="شرح الإجابة" />
            <p
              className="[&_figure]:max-w-[100px]! break-all *:break-all"
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
