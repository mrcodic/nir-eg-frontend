import { MyTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { memo } from "react";

type Props = {
  start: any;
  data: any;
  setShowRoom: any;
  defaultTitle?: string;
  startTimer?: boolean;
  onComplete?: (data: any) => void;
};

function ExamSideInfo({
  startTimer,
  start,
  data,
  setShowRoom,
  defaultTitle = "امتحان",
  onComplete,
}: Props) {
  return (
    <div className="md:min-w-[280px] flex flex-col items-center justify-center border rounded-lg p-4 border-primary-800   bg-background">
      <h2 className="text-[20px] text-right  mb-2 font-bold break-all">
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

      <Button
        onClick={() => {
          setShowRoom(true);
        }}
        variant="outline"
        className="border-primary-800 text-primary-800 hover:bg-primary-800 w-full h-11 text-base mt-4"
      >
        <span>عرض الحصة</span>
      </Button>

      {startTimer && (
        <div className="mt-4 bg-white text-black border border-secondary relative font-bold text-40 w-full text-center flex flex-col p-4 rounded-lg gap-4">
          <p className="text-sm">باقي من وقت الامتحان</p>
          <MyTimer
            start={startTimer}
            minutes={start?.timer}
            onComplete={onComplete}
          />
        </div>
      )}
    </div>
  );
}

export default memo(ExamSideInfo);
