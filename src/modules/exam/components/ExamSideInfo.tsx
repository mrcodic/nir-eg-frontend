import { cn } from "@/lib/utils";

function ExamSideInfo({ start, data, setShowRoom, defaultTitle = "امتحان" }) {
  return (
    <div className="md:min-w-[280px] flex flex-col items-center justify-center border rounded-lg p-4 border-primary-800  max-h-[329px] bg-[#F9FAFC]">
      <h2 className="text-[20px] text-[#121212] text-right  mb-2 font-bold break-all">
        {start?.title || defaultTitle}
      </h2>

      {start?.score_ratio && (!data || (data && data?.solution)) && (
        <div className="flex w-full justify-center gap-1 items-center flex-wrap">
          <span className="text-[#121212] inline-block text-[18px] font-bold">
            جاوبت على
          </span>
          <div className="relative font-bold  text-nowrap ">
            {" "}
            <h3
              style={{
                WebkitTextFillColor: "white",
                WebkitTextStrokeWidth: 1,
                WebkitTextStrokeColor: "#d9b45c",
              }}
              className="textStroke text-[32px] absolute flex items-center -top-[2px]  z-0"
            >
              {" "}
              {start?.score_ratio + " "}اسئلة
            </h3>
            <h3
              className={cn("flex items-center relative  z-10 text-[32px]", {
                "text-[#B75050]": !start.result,
                "text-[#1EAD7B]": start.result,
              })}
            >
              {start?.score_ratio + " "}اسئلة
            </h3>
          </div>
        </div>
      )}

      {data && !!data?.questions?.length && (
        <div className="flex mt-[16px] items-center gap-2">
          <img className="w-[20px] h-[20px]" src="/assets/Question.svg" />
          <h2 className="text-[18px] font-medium text-gray-dark">
            عدد الأسئلة
          </h2>
          <span className="text-[20px] inline-block font-bold text-[#121212]">
            {" "}
            {data?.questions?.length} سؤال
          </span>
        </div>
      )}

      <button
        onClick={() => {
          setShowRoom(true);
        }}
        className="bg-primary text-sm mt-[16px] text-white font-bold w-[159px] gap-2 rounded-[10px] flex justify-center items-center py-2 border border-gray-light"
      >
        <img className="w-[20px] h-[20px]" src="/assets/Details.svg" />
        <span>عرض الحصة</span>
      </button>
    </div>
  );
}

export default ExamSideInfo;
