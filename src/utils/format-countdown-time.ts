type CountdownTimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const padTimePart = (value: number) => String(value).padStart(2, "0");

export function formatCountdownTime({
  days,
  hours,
  minutes,
  seconds,
}: CountdownTimeParts) {
  const totalHours = days * 24 + hours;

  if (!totalHours && !minutes) {
    return `${padTimePart(seconds)} ثانية`;
  }

  return [
    ...(totalHours ? [padTimePart(totalHours)] : []),
    ...(minutes ? [padTimePart(minutes)] : []),
    padTimePart(seconds),
  ].join(":");
}
