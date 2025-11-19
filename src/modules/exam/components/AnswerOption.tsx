import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";
import { getAnswerState } from "@/lib/utils";

const AnswerOption = ({
  answer,
  index,
  questionId,
  disabled,
  field,
  isMultiple,
  form,
}) => {
  const answerId = `answer-${questionId}-${answer.id}`;

  const selectedAnswers = Array.isArray(field.value) ? field.value : [];
  const isChecked = selectedAnswers.includes(answer.id + "");

  const handleCheckboxChange = (checked) => {
    if (!isMultiple) {
      field.onChange([answer.id + ""]);
      return;
    }

    if (checked) {
      field.onChange([...selectedAnswers, answer.id + ""]);
    } else {
      field.onChange(selectedAnswers.filter((id) => id !== answer.id + ""));
    }

    form.trigger(`questions.${questionId}`);
  };

  const BorderColor = useMemo(() => {
    const answerState = getAnswerState(answer);
    if (answerState === "correct-selected")
      return "border-green-500 bg-green-50";
    if (answerState === "correct-unselected") return "border-green-500";
    if (answerState === "incorrect-selected") return "border-red-500";
    return "border-[#eeee] ";
  }, [answer]);

  const CheckBoxColor = useMemo(() => {
    const answerState = getAnswerState(answer);
    if (answerState === "correct-selected") return "bg-green-500";
    if (answerState === "incorrect-selected") return "bg-red-500";
    return "";
  }, [answer]);

  return (
    <label
      htmlFor={answerId}
      dir="ltr"
      className={`rounded-[8px] border ${BorderColor} p-2 cursor-pointer `}
    >
      <span className="text-[#523412] text-[14px] font-bold inline-block">
        .{index + 1}
      </span>
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <div className="flex p-2 items-center gap-x-2">
            <Checkbox
              disabled={disabled}
              checked={isChecked}
              onCheckedChange={handleCheckboxChange}
              id={answerId}
              className={CheckBoxColor}
            />
          </div>
        </FormControl>
        <FormLabel
          className="font-normal text-black! cursor-pointer"
          htmlFor={answerId}
        >
          {answer?.valueInput || (
            <div
              className="break-all *:break-all "
              dangerouslySetInnerHTML={{ __html: answer.valueCk }}
            />
          )}
        </FormLabel>
      </FormItem>
    </label>
  );
};

export default AnswerOption;
