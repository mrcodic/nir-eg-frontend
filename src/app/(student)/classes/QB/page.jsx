import Link from "next/link";

const QuestionBankPage = () => {
  return (
    <div className="py-4 w-[60%] flex flex-col gap-8 mx-auto">
      <Link
        href="Questions.html"
        className="p-8 flex gap-2 rounded-lg shadow-md"
      >
        <div className="self-start">
          <img
            style={{
              filter:
                "filter: brightness(0) saturate(100%) invert(36%) sepia(91%) saturate(399%) hue-rotate(163deg) brightness(96%) contrast(91%)",
            }}
            src="/assets/Question Bank.svg"
          />
        </div>
        <div>
          <span className="text-[#121212] text-[18px] font-bold">
            بنك أسئلة 1
          </span>
          <div className="text-[#41474B] mt-4 flex gap-2 text-sm font-normal">
            <img src="/assets/time.svg" className="w-[24px] h-[24px]" />
            <span>تم التنزيل منذ ساعتين</span>
          </div>
        </div>
      </Link>
      <a href="Questions.html" className="p-8 flex gap-2 rounded-lg shadow-md">
        <div className="self-start">
          <img
            style={{
              filter:
                "brightness(0) saturate(100%) invert(36%) sepia(91%) saturate(399%) hue-rotate(163deg) brightness(96%) contrast(91%)",
            }}
            src="/assets/Question Bank.svg"
          />
        </div>
        <div>
          <span className="text-[#121212] text-[18px] font-bold">
            بنك أسئلة 1
          </span>
          <div className="text-[#41474B] mt-4 flex gap-2 text-sm font-normal">
            <img src="/assets/time.svg" className="w-[24px] h-[24px]" />
            <span>تم التنزيل منذ ساعتين</span>
          </div>
        </div>
      </a>
      <a href="Questions.html" className="p-8 flex gap-2 rounded-lg shadow-md">
        <div className="self-start">
          <img
            style={{
              filter:
                "brightness(0) saturate(100%) invert(36%) sepia(91%) saturate(399%) hue-rotate(163deg) brightness(96%) contrast(91%)",
            }}
            src="/assets/Question Bank.svg"
          />
        </div>
        <div>
          <span className="text-[#121212] text-[18px] font-bold">
            بنك أسئلة 1
          </span>
          <div className="text-[#41474B] mt-4 flex gap-2 text-sm font-normal">
            <img src="/assets/time.svg" className="w-[24px] h-[24px]" />
            <span>تم التنزيل منذ ساعتين</span>
          </div>
        </div>
      </a>
      <a href="Questions.html" className="p-8 flex gap-2 rounded-lg shadow-md">
        <div className="self-start">
          <img
            style={{
              filter:
                "brightness(0) saturate(100%) invert(36%) sepia(91%) saturate(399%) hue-rotate(163deg) brightness(96%) contrast(91%)",
            }}
            src="/assets/Question Bank.svg"
          />
        </div>
        <div>
          <span className="text-[#121212] text-[18px] font-bold">
            بنك أسئلة 1
          </span>
          <div className="text-[#41474B] mt-4 flex gap-2 text-sm font-normal">
            <img src="/assets/time.svg" className="w-[24px] h-[24px]" />
            <span>تم التنزيل منذ ساعتين</span>
          </div>
        </div>
      </a>
    </div>
  );
};
export default QuestionBankPage;
