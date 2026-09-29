import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { cn } from "@/lib/utils";
import { getQuizDeadline } from "@/utils/get-quiz-deadline";

type ExamTaskTimerProps = {
  startTime: string;
  minutes: string;
  onComplete: () => void;
  className?: string;
};

export default function ExamTaskTimer({
  startTime,
  minutes,
  onComplete,
  className,
}: ExamTaskTimerProps) {
  const deadline = getQuizDeadline(startTime, minutes);

  if (!deadline) return null;

  return (
    <div
      className={cn(
        "border-secondary text-40 flex w-full gap-4 rounded-lg border bg-white p-2 text-center font-bold text-black max-lg:items-center max-lg:justify-between lg:flex-col lg:p-4",
        className,
      )}
    >
      <p className="text-sm">باقي من وقت الامتحان</p>
      <CountdownTimer
        deadline={deadline}
        onComplete={onComplete}
        className="max-lg:text-base"
      />
    </div>
  );
}
