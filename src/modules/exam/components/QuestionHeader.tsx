const QuestionHeader = ({ index, error }) => {
  return (
    <div className="flex justify-between">
      <h2 className="text-[20px] text-[#523412] " dir="ltr">
        Q{index + 1} :
      </h2>
      {error && (
        <p className="text-xs text-red-700">لم تقم بالإجابة على هذا السؤال</p>
      )}
    </div>
  );
};

export default QuestionHeader;
