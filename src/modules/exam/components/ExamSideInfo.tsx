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
    <div className="bg-background flex flex-col items-start justify-center rounded-lg p-4 md:min-w-[280px]">
      <h2 className="border-gray-light w-full border-b pb-2 text-right text-[20px] font-bold break-all">
        {start?.title || defaultTitle}
      </h2>

      {start?.score_ratio && (!data || (data && data?.solution)) && (
        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-1">
          <span className="inline-block text-[18px] font-bold text-[#121212]">
            جاوبت على
          </span>
          <div className="relative font-bold text-nowrap">
            {" "}
            <h3
              style={{
                WebkitTextFillColor: "white",
                WebkitTextStrokeWidth: 1,
                WebkitTextStrokeColor: "#d9b45c",
              }}
              className="textStroke absolute -top-[2px] z-0 flex items-center text-[32px]"
            >
              {" "}
              {start?.score_ratio + " "}اسئلة
            </h3>
            <h3
              className={cn("relative z-10 flex items-center text-[32px]", {
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
        <div className="mt-4 flex items-center gap-4">
          <svg
            className="bg-primary size-6"
            style={{
              maskImage: "url(/assets/question-mark.svg)",
              mask: "url(/assets/question-mark.svg)",
            }}
          />
          {/* <h2 className="text-[18px] font-medium text-gray-dark">
            عدد الأسئلة
          </h2> */}
          <span className="text-primary inline-block text-[20px] font-bold underline">
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
        className="border-primary-800 text-primary-800 hover:bg-primary-800 mt-4 h-11 w-full text-base font-bold"
      >
        <span>عرض الحصة</span>
      </Button>

      {startTimer && (
        <div className="border-secondary text-40 relative mt-4 flex w-full flex-col gap-4 rounded-lg border bg-white p-4 text-center font-bold text-black">
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
