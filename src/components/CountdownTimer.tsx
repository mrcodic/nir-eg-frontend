import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";

const Completionist = () => <span>انتهى الوقت</span>;

export function MyTimer({ minutes, onComplete, start }) {
  const { examId } = useParams();

  const [endTime, setEndTime] = useState(() => {
    const storedTime = localStorage.getItem(`timer${examId}`);
    // check if the stored time is valid
    const storedTimeDate = storedTime && new Date(parseInt(storedTime, 10));

    // timer expired
    if (storedTimeDate?.getTime() < new Date().getTime()) {
      return new Date();
    }

    if (storedTime) {
      return storedTimeDate;
    }

    const newTime = new Date().getTime() + Number(minutes) * 60 * 1000;
    localStorage.setItem(`timer${examId}`, newTime.toString());
    return new Date(newTime);
  });

  useEffect(() => {
    // Cleanup storage when the timer expires
    const now = new Date().getTime();
    if (now > endTime.getTime()) {
      localStorage.removeItem(`timer${examId}`);
    }
  }, [endTime]);

  if (!start) return null;

  if (!minutes) return <Completionist />;

  // Retrieve the stored end time from localStorage or set a new one

  const renderer = ({ minutes, seconds, completed, hours }) => {
    if (completed) {
      localStorage.removeItem(`timer${examId}`);
      return <Completionist />;
    } else {
      const timerLessThan2Minutes = minutes < 2 && hours === 0;
      return (
        <span
          className={`tracking-wider ${timerLessThan2Minutes && "animate-pulse"}`}
        >
          {String(hours * 60 + minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>
      );
    }
  };

  return (
    <Countdown date={endTime} renderer={renderer} onComplete={onComplete} />
  );
}
