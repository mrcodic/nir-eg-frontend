import {
  CENTER_ATTENDANCE_STATUS,
  CENTER_HOMEWORK_STATUS,
  CenterProgressRoom,
} from "@/types/center-progress.types";

export function getCenterAttendanceClassName(status: number | null) {
  if (status === CENTER_ATTENDANCE_STATUS.present) {
    return "bg-semantics-green-50 text-green-800";
  }
  if (status === CENTER_ATTENDANCE_STATUS.absent) {
    return "bg-semantics-red-50 text-red-800";
  }
  return "bg-muted text-muted-foreground";
}

export function getCenterHomeworkClassName(status: number | null) {
  if (status === CENTER_HOMEWORK_STATUS.completed) {
    return "bg-primary-50 text-primary";
  }
  if (status === CENTER_HOMEWORK_STATUS.unsolved || status === null) {
    return "bg-muted text-muted-foreground";
  }
  return "bg-secondary-50 text-amber-800";
}

export function getCenterQuizMark(room: CenterProgressRoom) {
  return (
    room.quiz_mark ??
    (room.quiz_score !== null && room.quiz_total !== null
      ? `${room.quiz_score}/${room.quiz_total}`
      : "—")
  );
}

export function formatProgressPercentage(value: number) {
  return `${value}%`;
}
