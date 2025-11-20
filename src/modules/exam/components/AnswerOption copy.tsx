import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useMemo } from "react";

const AnswerOption = ({ answer, index, questionId, disabled, field }) => {
  const answerId = `answer-${questionId}-${answer.id}`;

  const BorderColor = useMemo(() => {
    if (answer?.correct && "selected" in answer) return "border-green-500";
    if (answer.selected && !answer?.correct) return "border-red-500";
    return "border-[#eeee] border";
  }, [answer]);

  const RadioColor = useMemo(() => {
    if (answer?.correct && "selected" in answer) return "bg-green-500";
    if (answer?.selected && !answer?.correct) return "bg-red-500";
    return "";
  }, [answer]);

  const RadioCircleColor = useMemo(() => {
    if (answer?.correct && "selected" in answer)
      return "data-[state=checked]:bg-green-500";
    if (answer?.selected && !answer?.correct)
      return "data-[state=checked]:bg-red-500";
    return "";
  }, [answer]);

  return (
    <label
      htmlFor={answerId}
      dir="ltr"
      className={`rounded-lg ${BorderColor} p-2`}
    >
      <span className="text-[#523412] text-sm font-bold inline-block">
        .{index + 1}
      </span>
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <div className="flex p-2 items-center space-x-2">
            <RadioGroupItem
              disabled={disabled}
              value={answer.id + ""}
              id={answerId}
              className={RadioColor}
              circleClassName={RadioCircleColor}
            />
          </div>
        </FormControl>
        <FormLabel className="font-normal text-black!" htmlFor={answerId}>
          {answer?.valueInput || (
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

export default AnswerOption;
