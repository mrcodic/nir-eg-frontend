import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { cn } from "@/lib/utils";

type ExamTaskTimerProps = {
  minutes: string;
  onComplete: (data: { completed: boolean }) => void;
  className?: string;
};

export default function ExamTaskTimer({
  minutes,
  onComplete,
  className,
}: ExamTaskTimerProps) {
  return (
    <div
      className={cn(
        "border-secondary text-40 flex w-full gap-4 rounded-lg border bg-white p-2 text-center font-bold text-black max-lg:items-center max-lg:justify-between lg:flex-col lg:p-4",
        className,
      )}
    >
      <p className="text-sm">باقي من وقت الامتحان</p>
      <CountdownTimer
        start
        minutes={minutes}
        onComplete={onComplete}
        className="max-lg:text-base"
      />
    </div>
  );
}
