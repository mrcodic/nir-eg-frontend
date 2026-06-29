import { useAuthContext } from "@/context/auth-context";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";

const Completionist = () => <span className="text-base">انتهى الوقت</span>;

const SUBMIT_BUFFER_MS = 5_000; // 10s before real end

export function CountdownTimer({ minutes, onComplete, start }) {
  const { examId } = useParams();
  const timerInit = useRef(false);
  const hasSubmitted = useRef(false);
  const { profile } = useAuthContext();
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !profile || timerInit.current) return;

    setEndTime(() => {
      const storedTime = localStorage.getItem(`timer-${examId}-${profile?.id}`);
      const storedTimeDate = storedTime && new Date(parseInt(storedTime, 10));

      if (storedTimeDate?.getTime() < new Date().getTime()) {
        return new Date();
      }

      if (storedTime) return storedTimeDate;

      const newTime = new Date().getTime() + Number(minutes) * 60 * 1000;
      localStorage.setItem(
        `timer-${examId}-${profile?.id}`,
        newTime.toString(),
      );
      return new Date(newTime);
    });

    timerInit.current = true;
  }, [examId, minutes, profile]);

  useEffect(() => {
    const now = new Date().getTime();
    if (endTime && now > endTime?.getTime()) {
      localStorage.removeItem(`timer-${examId}-${profile?.id}`);
    }
  }, [endTime]);

  if (!start || !endTime) return null;
  if (!minutes) return <Completionist />;

  const renderer = ({ minutes, seconds, hours, completed, total }) => {
    // ✅ trigger submit SUBMIT_BUFFER_MS before real end, once
    if (!completed && total <= SUBMIT_BUFFER_MS && !hasSubmitted.current) {
      hasSubmitted.current = true;
      onComplete?.({ completed: true });
    }

    if (completed) return <Completionist />;

    const timerLessThan2Minutes = minutes < 2 && hours === 0;
    return (
      <span
        className={`tracking-wider ${timerLessThan2Minutes && "animate-pulse"}`}
      >
        {String(hours * 60 + minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    );
  };

  return (
    <Countdown
      date={endTime}
      renderer={renderer}
      onComplete={() => {
        localStorage.removeItem(`timer-${examId}-${profile?.id}`);
        // fallback if renderer didn't catch it (tab was backgrounded, etc.)
        if (!hasSubmitted.current) {
          hasSubmitted.current = true;
          onComplete?.({ completed: true });
        }
      }}
    />
  );
}
