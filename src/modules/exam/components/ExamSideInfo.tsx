import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { Button } from "@/components/ui/button";
import { useTaskContext } from "@/context/TaskProvider";
import { cn } from "@/lib/utils";
import { QuizStatus } from "@/types";
import { TaskQuestionPayload, TaskShowAnswersData } from "@/types/quiz.types";
import { memo } from "react";
import ExamPDFGenerator from "./ExamPDFGenerator";

type Props = {
  start: QuizStatus;
  data?: TaskQuestionPayload | TaskShowAnswersData;
  setShowRoom?: (value: boolean) => void;
  defaultTitle?: string;
  startTimer?: boolean;
  onComplete?: (data: { completed: boolean }) => void;
};

function ExamSideInfo({
  startTimer,
  start,
  data,
  setShowRoom,
  defaultTitle = "امتحان",
  onComplete,
}: Props) {
  const { taskId } = useTaskContext();
  console.log("ddddddd ", data);
  const isAnswered =
    start?.score_ratio &&
    (!data || (data && (data as TaskShowAnswersData)?.solution));

  return (
    <div className="bg-background flex flex-col items-start justify-center rounded-lg p-4 md:min-w-[280px]">
      <h2 className="border-gray-light w-full border-b pb-2 text-right text-[20px] font-bold break-all">
        {start?.title || defaultTitle}
      </h2>

      {start?.questions_count && (
        <div className="mt-4 flex items-center gap-4">
          <svg
            className="bg-primary size-6"
            style={{
              maskImage: "url(/assets/question-mark.svg)",
              mask: "url(/assets/question-mark.svg)",
            }}
          />

          <span className="text-primary inline-block text-[20px] font-bold underline">
            {" "}
            {start?.questions_count} سؤال
          </span>
        </div>
      )}

      {isAnswered && (
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-1">
          <span className="inline-block text-lg font-bold text-black">
            حصلت على
          </span>
          <div className="relative font-bold text-nowrap">
            {" "}
            <h3
              style={{
                WebkitTextFillColor: "white",
                WebkitTextStrokeWidth: 1,
                WebkitTextStrokeColor: "#d9b45c",
              }}
              className="textStroke absolute -top-0.5 z-0 flex items-center text-xl"
            >
              {" "}
              {start?.score_ratio + " "}درجة
            </h3>
            <h3
              className={cn("relative z-10 flex items-center text-xl", {
                "text-[#B75050]": !start.result,
                "text-[#1EAD7B]": start.result,
              })}
            >
              {start?.score_ratio + " "}درجة
            </h3>
          </div>
        </div>
      )}

      {setShowRoom && (
        <Button
          onClick={() => {
            setShowRoom(true);
          }}
          variant="outline"
          className="border-primary-800 text-primary-800 hover:bg-primary-800 mt-4 h-11 w-full text-base font-bold"
        >
          <span>عرض الحصة</span>
        </Button>
      )}

      {isAnswered && (
        <ExamPDFGenerator taskId={Number(taskId)} className="mt-4" />
      )}

      {!isAnswered && startTimer && (
        <div className="border-secondary text-40 relative mt-4 flex w-full flex-col gap-4 rounded-lg border bg-white p-4 text-center font-bold text-black">
          <p className="text-sm">باقي من وقت الامتحان</p>
          <CountdownTimer
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
