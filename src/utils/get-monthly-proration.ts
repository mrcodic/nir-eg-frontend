type CairoDatePart = "day" | "month" | "year";

const cairoDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Cairo",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

function getCairoDatePart(
  dateParts: Intl.DateTimeFormatPart[],
  datePart: CairoDatePart,
) {
  return Number(dateParts.find((part) => part.type === datePart)!.value);
}

export function getMonthlyProration(monthlyPrice: number, currentDate: Date) {
  const cairoDateParts = cairoDateFormatter.formatToParts(currentDate);
  const dayOfMonth = getCairoDatePart(cairoDateParts, "day");
  const month = getCairoDatePart(cairoDateParts, "month");
  const year = getCairoDatePart(cairoDateParts, "year");
  const totalDays = new Date(year, month, 0).getDate();
  const chargeableDays =
    dayOfMonth === 1
      ? totalDays
      : dayOfMonth === totalDays
        ? 1
        : totalDays - dayOfMonth;

  return {
    amount: Math.round((monthlyPrice * chargeableDays * 100) / totalDays) / 100,
    chargeableDays,
    isProrated: dayOfMonth !== 1,
  };
}
