import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useTaskContext } from "@/context/TaskProvider";
import { cn, getAnswerState } from "@/lib/utils";
import { Circle } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { Path } from "react-hook-form";

type Props = {
  answer: any;
  questionId: number;
  disabled: boolean;
  field: any;
  isMultiple: boolean;
};

const AnswerOption = ({
  answer,
  questionId,
  disabled,
  field,
  isMultiple,
}: Props) => {
  const { trigger } = useTaskContext();

  const answerId = `answer-${questionId}-${answer.id}`;

  const selectedAnswers = useMemo(() => {
    return Array.isArray(field.value) ? field.value : [];
  }, [field.value]);

  const isChecked = selectedAnswers.includes(String(answer.id));

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      if (!isMultiple) {
        field.onChange([String(answer.id)]);
        trigger(`questions.${questionId}` as Path<{ questions: {} }>);
        return;
      }

      if (checked) {
        field.onChange([...selectedAnswers, String(answer.id)]);
      } else {
        field.onChange(
          selectedAnswers.filter((id) => id !== String(answer.id)),
        );
      }

      trigger(`questions.${questionId}` as Path<{ questions: {} }>);
    },
    [answer.id, field, isMultiple, questionId, selectedAnswers, trigger],
  );

  const answerState = useMemo(() => getAnswerState(answer), [answer]);

  const borderClass = useMemo(() => {
    if (answerState === "correct-selected")
      return "border-green-500 bg-green-50";
    if (answerState === "correct-unselected") return "border-green-500";
    if (answerState === "incorrect-selected") return "border-red-500";
    return "border-gray-light";
  }, [answerState]);

  const checkboxClass = useMemo(() => {
    if (answerState === "correct-selected")
      return "bg-green-500 border-green-500";
    if (answerState === "incorrect-selected")
      return "bg-red-500 border-red-500";
    return "";
  }, [answerState]);

  return (
    <label
      htmlFor={answerId}
      dir="ltr"
      className={cn("rounded-lg border bg-white p-2", borderClass)}
    >
      <FormItem className="flex items-center space-y-0 space-x-3">
        <FormControl>
          <div className="flex items-center gap-x-2 p-2">
            <Checkbox
              id={answerId}
              disabled={disabled}
              checked={isChecked}
              onCheckedChange={handleCheckboxChange}
              className={cn(
                "border-gray-dark group size-6 rounded-full data-[state=checked]:bg-white",
                checkboxClass,
              )}
              icon={
                <Circle className="h-4 w-4 group-data-[state=checked]:fill-black" />
              }
            />
          </div>
        </FormControl>

        <FormLabel
          htmlFor={answerId}
          className={cn("font-normal text-black!", {
            "text-red-500": answerState === "incorrect-selected",
            "text-green-500": answerState === "correct-selected",
          })}
        >
          {answer.valueInput || (
            <div
              className="break-all *:break-all"
              dangerouslySetInnerHTML={{ __html: answer.valueCk }}
            />
          )}
        </FormLabel>
      </FormItem>
    </label>
  );
};

export default memo(AnswerOption);
