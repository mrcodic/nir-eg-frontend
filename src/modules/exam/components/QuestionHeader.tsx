import StyledText from "@/components/ui/StyledText";
import { numberToArabicOrdinal } from "@/lib/utils";

const QuestionHeader = ({
  index,
  error,
  multiCorrect = false,
  isSubQuestion = false,
}) => {
  return (
    <div dir="rtl" className="flex flex-wrap justify-between">
      {!isSubQuestion && (
        <StyledText
          text={`السؤال ${numberToArabicOrdinal(index + 1)}`}
          as="h2"
          withUnderLine
        />
      )}

      {error &&
        (multiCorrect ? (
          <p className="ms-auto text-xs text-red-700">
            {isSubQuestion
              ? "يوجد اكثر من اجابة لهذا السؤال"
              : "لم تقم بالإجابة على جميع الاسئلة"}
          </p>
        ) : (
          <p className="ms-auto text-xs text-red-700">
            لم تقم بالإجابة على هذا السؤال
          </p>
        ))}
    </div>
  );
};

export default QuestionHeader;
