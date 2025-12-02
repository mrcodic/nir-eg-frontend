const QuestionHeader = ({
  index,
  error,
  showQuestionNumber = false,
  showSeperator = true,
  multiCorrect = false,
}) => {
  return (
    <div className="flex justify-between flex-wrap">
      {showQuestionNumber ? (
        <h2 className="text-[20px] text-[#523412] " dir="ltr">
          Q{index + 1} :
        </h2>
      ) : (
        showSeperator && (
          <hr className="w-full my-2 border-4 border-double border-[#523412]" />
        )
      )}

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
