import { DateTime } from "luxon";

export function getQuizDeadline(
  startTime: string,
  durationInMinutes: string | number,
): number | null {
  const duration = Number(durationInMinutes);
  const start = DateTime.fromSQL(startTime);

  if (!start.isValid || !Number.isFinite(duration)) return null;

  return start.plus({ minutes: duration }).toMillis();
}
