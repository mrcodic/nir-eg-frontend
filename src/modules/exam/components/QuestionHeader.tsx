import StyledText from "@/components/ui/StyledText";
import { numberToArabicOrdinal } from "@/lib/utils";

const QuestionHeader = ({ index, error, multiCorrect = false }) => {
  return (
    <div dir="rtl" className="flex justify-between flex-wrap">
      <StyledText text={`السؤال ${numberToArabicOrdinal(index + 1)}`} as="h2" />

      {error &&
        (multiCorrect ? (
          <p className="text-xs ms-auto text-red-700">
            لم تقم بالإجابة على جميع الاسئلة
          </p>
        ) : (
          <p className="text-xs ms-auto text-red-700">
            لم تقم بالإجابة على هذا السؤال
          </p>
        ))}
    </div>
  );
};

export default QuestionHeader;
