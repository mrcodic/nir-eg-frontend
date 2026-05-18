import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn, getAnswerState } from "@/lib/utils";
import { Circle } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

type Props = {
  answer: {
    correct: boolean;
    id: number;
    selected: boolean;
    valueCk: string | null;
    valueInput: string | null;
  };
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
  const answerId = `answer-${questionId}-${answer.id}`;

  const selectedAnswers = useMemo(() => {
    return Array.isArray(field.value) ? field.value : [];
  }, [field.value]);

  const isChecked = selectedAnswers.includes(String(answer.id));

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      if (!isMultiple) {
        field.onChange([String(answer.id)]);
        // trigger(`questions.${questionId}` as Path<{ questions: {} }>);
        return;
      }

      if (checked) {
        field.onChange([...selectedAnswers, String(answer.id)]);
      } else {
        field.onChange(
          selectedAnswers.filter((id) => id !== String(answer.id)),
        );
      }

      // trigger(`questions.${questionId}` as Path<{ questions: {} }>);
    },
    [answer.id, field, isMultiple, selectedAnswers],
  );

  const answerState = useMemo(() => getAnswerState(answer), [answer]);

  const borderClass = useMemo(() => {
    if (answerState === "correct-selected")
      return "border-green-500 bg-green-50";
    if (answerState === "correct-unselected")
      return "border-green-500 bg-green-50";
    if (answerState === "incorrect-selected") return "border-red-700 bg-red-50";
    return "border-gray-light";
  }, [answerState]);

  const checkboxClass = useMemo(() => {
    if (answerState === "correct-selected")
      return "bg-green-500 border-green-500";
    if (answerState === "incorrect-selected")
      return "bg-red-700 border-red-700";
    return "";
  }, [answerState]);

  return (
    <label
      htmlFor={answerId}
      dir="rtl"
      className={cn(
        "rounded-lg border bg-white p-2 transition-all",
        borderClass,
        {
          "border-primary": isChecked,
        },
      )}
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
                "border-primary group size-5 rounded-full transition-all data-[state=checked]:bg-white",
                checkboxClass,
              )}
              icon={
                <Circle className="group-data-[state=checked]:fill-primary group-data-[state=checked]:stroke-primary size-3! transition-all" />
              }
            />
          </div>
        </FormControl>

        <FormLabel
          htmlFor={answerId}
          className={cn("font-normal text-black! select-none", {
            "text-red-600": answerState === "incorrect-selected",
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
