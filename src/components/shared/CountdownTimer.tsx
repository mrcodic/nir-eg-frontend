import { cn } from "@/lib/utils";
import Countdown, { CountdownRenderProps } from "react-countdown";

const Completionist = () => <span className="text-base">انتهى الوقت</span>;

type CountdownTimerProps = {
  deadline: number;
  onComplete: () => void;
  className?: string;
};

export function CountdownTimer({
  deadline,
  onComplete,
  className,
}: CountdownTimerProps) {
  const renderer = ({
    minutes,
    seconds,
    hours,
    completed,
  }: CountdownRenderProps) => {
    if (completed) return <Completionist />;

    const timerLessThan2Minutes = minutes < 2 && hours === 0;
    return (
      <span
        className={cn(
          `tracking-wider ${timerLessThan2Minutes && "animate-pulse"}`,
          className,
        )}
      >
        {String(hours * 60 + minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    );
  };

  return (
    <Countdown
      key={deadline}
      date={deadline}
      renderer={renderer}
      onComplete={onComplete}
    />
  );
}
