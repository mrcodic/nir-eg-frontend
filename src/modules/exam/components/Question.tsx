"use client";

import { FormField, FormItem } from "@/components/ui/form";
import ReadingBorder from "@/components/ui/paragraph-borders";
import { useTaskContext } from "@/context/TaskProvider";
import { memo } from "react";
import { useFormState, useWatch } from "react-hook-form";
import AnswerOption from "./AnswerOption";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

type Props = {
  question: any;
  index: number;
  status: boolean;
  listRef: React.MutableRefObject<HTMLDivElement[]>;
  isAnswer: boolean;
  isSubQuestion?: boolean;
};

const Question = ({
  question,
  index,
  status,
  listRef,
  isAnswer,
  isSubQuestion,
}: Props) => {
  const { control } = useTaskContext();

  // ✅ subscribe only to THIS question value
  const value = useWatch({
    control,
    name: `questions.${question.id}`,
  });

  // ✅ subscribe only to THIS question error
  const { errors } = useFormState({
    control,
    name: `questions.${question.id}`,
  });

  const fieldError =
    errors?.questions?.[question.id] ||
    (question.has_multi_correct && value?.length < 2);

  const notSolvedQuestion =
    isAnswer && question.answers?.some((a) => !a.selected && a.correct);

  return (
    <div
      ref={(el) => {
        listRef.current[index] = el!;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={isSubQuestion ? `sub-question-${index}` : `question-${index}`}
      className={isSubQuestion ? "" : "bg-background p-4 rounded-lg"}
    >
      <div className="flex flex-col gap-2">
        <QuestionHeader
          index={index}
          error={fieldError || notSolvedQuestion}
          multiCorrect={question.has_multi_correct}
          isSubQuestion={isSubQuestion}
        />

        {question.has_multi_correct && (
          <p className="font-bold text-secondary self-end w-fit">
            يوجد اكثر من اجابة
          </p>
        )}
      </div>

      <div dir="ltr" className="space-y-4">
        <QuestionTitle
          title={question.title}
          video={question.answer_video}
          isSubQuestion={isSubQuestion}
        />

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
                    disabled={status}
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

export default memo(Question);
