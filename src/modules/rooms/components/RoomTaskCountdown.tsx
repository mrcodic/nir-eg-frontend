"use client";

import { formatCountdownTime } from "@/utils/format-countdown-time";
import { Clock } from "lucide-react";
import Countdown from "react-countdown";

type RoomTaskCountdownProps = {
  startTime: string;
  durationInMinutes: number;
};

export default function RoomTaskCountdown({
  startTime,
  durationInMinutes,
}: RoomTaskCountdownProps) {
  const deadline = new Date(startTime).getTime() + durationInMinutes * 60_000;

  return (
    <Countdown
      key={deadline}
      date={deadline}
      renderer={(timer) => (
        <div className="bg-secondary-50 border-secondary text-secondary h-auto rounded-xl border px-2 py-1 text-xs font-bold">
          {timer.completed ? (
            "انتهى وقت الكويز"
          ) : (
            <span className="flex items-center gap-1 text-sm">
              <Clock className="size-3" /> {formatCountdownTime(timer)}
            </span>
          )}
        </div>
      )}
    />
  );
}
