import { cn } from "@/lib/utils";

const formatTime = (num) => num.toString().padStart(2, "0");

function CountDownTimerUI({ minutes, seconds }) {
  return (
    <div className="text-gray-dark flex flex-1 items-center justify-center gap-2">
      <span className="text-gray-dark inline-block text-xl font-bold">
        هذا الرمز صالح لمدة
      </span>
      <div
        className={cn(
          "text-xl font-bold text-[#B75050]",
          minutes === 0 && seconds === 0 && "text-gray-light",
        )}
      >
        <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
      </div>
    </div>
  );
}

export default CountDownTimerUI;
