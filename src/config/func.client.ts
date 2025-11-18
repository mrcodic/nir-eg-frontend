import * as dateFns from "date-fns";
import { parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import Cookies from "js-cookie";
import { DateTime } from "luxon";

export const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    }
    return null;
  }
  return null;
};
export const removeLocalStorage = (key: string | string[]) => {
  if (typeof window !== "undefined") {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        localStorage.removeItem(k);
      });
    } else {
      localStorage.removeItem(key);
    }
  }

  return null;
};
export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value || "");
  }

  return null;
};

export const removeCookies = (key: string | string[]) => {
  if (typeof window !== "undefined") {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        Cookies.remove(k);
      });
    } else {
    }
  }
};

export function DateComponent(timestamp: string): string {
  // Parse the timestamp to a Date object
  const date = new Date(timestamp);

  // Format the date in the desired format with Arabic locale
  const formattedDate = dateFns.format(date, "iiii hh:mm a", { locale: ar });

  // Replace AM/PM with ص/م
  const finalFormattedDate = formattedDate
    .replace("AM", "ص")
    .replace("PM", "م");

  return finalFormattedDate;
}

export function getTimezoneTime(date: string, timezone: boolean = true) {
  const localTime = DateTime.fromISO(date, { setZone: timezone });

  return {
    isMorning: localTime.hour < 12,
    hours: localTime.hour,
    minutes: localTime.minute,
    seconds: localTime.second,
    timestamp: localTime.toMillis(),
  };
}

export const TimeComponent = (dateString: string) => {
  const parsedDate = parseISO(dateString);

  const formattedDate = dateFns
    .format(parsedDate, "ha", { locale: ar })
    .trim()
    .replace(/(م|ص)$/, (match) => {
      if (match === "م") return " مساء ";
      if (match === "ص") return " صباحا ";
      return match;
    });

  return formattedDate;
};

export function errorHandler(obj: any) {
  if (!obj) return " حدث خطاء ما";

  const keys = Object?.keys(obj);
  let text = "";

  keys.forEach((key) => {
    text += obj[key][0];
  });

  return text;
}

export function formatDuration(duration: string) {
  const units = {
    day: ["يوم", "يومان", "أيام"],
    hour: ["ساعة", "ساعتان", "ساعات"],
    minute: ["دقيقة", "دقيقتان", "دقائق"],
  };

  const matches = duration.match(/(\d+)\s*(days?|hours?|minutes?)/g);
  if (!matches) return "غير معروف";

  const result = matches.map((match) => {
    const [value, unit] = match.split(" ");
    const num = parseInt(value, 10);

    let arabicUnit;
    if (unit.startsWith("day"))
      arabicUnit =
        num === 1 ? units.day[0] : num === 2 ? units.day[1] : units.day[2];
    else if (unit.startsWith("hour"))
      arabicUnit =
        num === 1 ? units.hour[0] : num === 2 ? units.hour[1] : units.hour[2];
    else if (unit.startsWith("minute"))
      arabicUnit =
        num === 1
          ? units.minute[0]
          : num === 2
          ? units.minute[1]
          : units.minute[2];

    return `${num} ${arabicUnit}`;
  });

  return result.join(" و ");
}

export function formatCurrency(price: string | number) {
  if (isNaN(Number(price)) || price === null || price === undefined) {
    return "0.00";
  }

  const formattedPrice = Number(price)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${formattedPrice}`;
}

export function formatDateWithDay(dateInput: Date) {
  const arabicDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const date = new Date(dateInput);

  const dayOfWeek = arabicDays[dateFns.getDay(date)];
  const formattedDate = dateFns.format(date, "dd/MM/yyyy");

  return `${dayOfWeek} - ${formattedDate}`;
}

export function splitDuration(duration: string) {
  // Split the input string by ':' delimiter
  const [days, hours, minutes, seconds] = duration.split(":").map(Number);
  const resultParts: string[] = [];
  if (days > 0) resultParts.push(`${days} يوم`);
  if (hours > 0) resultParts.push(`${hours} ساعة`);
  if (minutes > 0) resultParts.push(`${minutes} دقائق`);
  if (seconds > 0) resultParts.push(`${seconds} ثانية`);

  return resultParts.join(" و ");
}

export function isTimeWithin20Minutes(timeInMillis: number): boolean {
  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Calculate the deadline by adding the remaining time to the current time
  const deadline = currentTime + timeInMillis;

  // Calculate the time 20 minutes from now (in milliseconds)
  const twentyMinutesFromNow = currentTime + 20 * 60 * 1000; // 1,200,000 ms = 20 minutes

  // Check if the deadline is within the next 20 minutes
  return deadline <= twentyMinutesFromNow;
}

export function convertToArabicTimeFormat(time: string): string {
  if (!time) return " --: -- : -";
  // Parse the time string into a Date object
  const [hours, minutes] = time.split(":").map(Number);

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  // Determine if it's AM or PM
  const suffix = hours >= 12 ? "م" : "ص";

  // Format the time string as "h:mm م" (3:40 م)
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function formatArabicDateTime(isoString: string): string {
  if (!isoString) return "--:-- -";

  const dt = DateTime.fromISO(isoString).setLocale("ar");

  const dayName = dt.toFormat("cccc"); // Full Arabic day name (e.g., "الاثنين")
  const time = dt.toFormat("hh:mm"); // 2-digit hour and minute (e.g., "03:08")
  const meridiem = dt.toFormat("a"); // "ص" or "م"
  const arabicMeridiem = meridiem === "م" ? "مساءً" : "صباحًا";

  return `${dayName} ${time} ${arabicMeridiem}`;
}
export function DateComponentSaudia(timestamp: string): string {
  // Parse the timestamp to a Date object
  const dt = DateTime.fromISO(timestamp, { setZone: true });

  // Format to 12-hour time with AM/PM in Arabic
  const formattedTime = dateFns.format(dt.toJSDate(), "iiii hh:mm a", {
    locale: ar,
  });

  // Replace AM/PM with Arabic equivalents
  return formattedTime
    .replace("AM", "ص") // ص for morning (AM)
    .replace("PM", "م"); // م for evening (PM)
}

export function getTimestampDifference(futureDateString: string): number {
  const futureDate = DateTime.fromISO(futureDateString, { setZone: true });
  const now = DateTime.now();

  // Return difference in milliseconds
  return futureDate.toMillis() - now.toMillis();
}

export function subtractDates(date1: string, date2: string): number {
  const dt1 = DateTime.fromISO(date1);
  const dt2 = DateTime.fromISO(date2);
  const diffInDays = dt1.diff(dt2, "milliseconds").days;
  return diffInDays;
}

export function getTimeRemainingArabic(
  targetDateString: string
): string | null {
  if (!targetDateString) return null;

  const targetDate = new Date(targetDateString);
  const now = new Date();

  if (targetDate < now) return null;

  const secondsRemaining = Math.floor(
    (targetDate.getTime() - now.getTime()) / 1000
  );

  // return if more than an hour
  if (secondsRemaining >= 3600) return null;

  const minutesRemaining = Math.floor(secondsRemaining / 60);
  const remainingSeconds = secondsRemaining % 60;

  if (minutesRemaining < 1) {
    return `${remainingSeconds} ثانية${remainingSeconds !== 1 ? "" : ""}`;
  }

  const minutesText = minutesRemaining === 1 ? "دقيقة" : "دقائق";
  const secondsText =
    remainingSeconds > 0
      ? ` و${remainingSeconds} ثانية${remainingSeconds !== 1 ? "" : ""}`
      : "";

  return `${minutesRemaining} ${minutesText}${secondsText}`;
}
