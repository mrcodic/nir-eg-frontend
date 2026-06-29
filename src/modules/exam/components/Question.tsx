"use client";

import { FormField, FormItem } from "@/components/ui/form";
import { useTaskContext } from "@/context/TaskProvider";
import { memo, useMemo } from "react";
import { useFormState, useWatch } from "react-hook-form";
import AnswerOption from "./AnswerOption";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

type Props = {
  question: any;
  index: number;
  isShowingAnswers: boolean;
  listRef: React.MutableRefObject<HTMLDivElement[]>;
  isAnswer: boolean;
  isSubQuestion?: boolean;
};

const Question = ({
  question,
  index,
  isShowingAnswers,
  listRef,
  isAnswer,
  isSubQuestion,
}: Props) => {
  const { control } = useTaskContext();

  const value = useWatch({
    control,
    name: `questions.${question.id}`,
  });

  const { errors } = useFormState({
    control,
    name: `questions.${question.id}`,
  });

  const fieldError =
    errors?.questions?.[question.id] ||
    (question.has_multi_correct && value?.length < 2);

  const notSolvedQuestion = useMemo(
    () => isAnswer && !question.answers?.some((a) => a.selected),
    [isAnswer, question.answers],
  );

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el!;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={isSubQuestion ? `sub-question-${index}` : `question-${index}`}
      className={isSubQuestion ? "" : "bg-background rounded-lg p-4"}
    >
      <div className="flex flex-col gap-2">
        <QuestionHeader
          index={index}
          error={fieldError || notSolvedQuestion}
          multiCorrect={question.has_multi_correct}
          isSubQuestion={isSubQuestion}
        />

        {question.has_multi_correct && (
          <p className="text-secondary w-fit self-end font-bold">
            يوجد اكثر من اجابة
          </p>
        )}
      </div>

      <div dir="rtl" className="space-y-6">
        <QuestionTitle title={question.title} video={question.answer_video} />

        <FormField
          control={control}
          name={`questions.${question.id}`}
          render={({ field }) => (
            <FormItem>
              <div className="grid gap-2">
                {question.answers?.map((answer) => (
                  <AnswerOption
                    key={answer.id}
                    answer={answer}
                    questionId={question.id}
                    disabled={isShowingAnswers}
                    field={field}
                    isMultiple={question.has_multi_correct}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        {isAnswer && question.explanation && (
          <div className="mt-2">
            <hr className="border-primary-100 my-6 h-px w-full" />
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

export default memo(Question);
