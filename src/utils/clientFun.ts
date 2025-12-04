export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    }
  }
  return null;
};

export function convertMinutes(seconds) {
  let minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} دقيقة`;

  let hours = Math.floor(minutes / 60);
  let remainingMinutes = Math.floor(minutes % 60);

  return remainingMinutes > 0
    ? `${hours} ساعة و ${remainingMinutes} دقيقة`
    : `${hours} ساعة`;
}
export function formatDateToArabic(dateString) {
  if (window === undefined) return dateString;
  const date = new Date(dateString);

  // Get Arabic day name
  const dayName = new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(
    date
  );

  // Format to YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return ` ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export function redirectUrl({
  bundleId,
  courseId,
  bookId,
  booksPage,
}: {
  bundleId?: string | number;
  courseId?: string | number;
  bookId?: string | number;
  booksPage?: boolean;
}) {
  const redirectUrl =
    process.env.NEXT_PUBLIC_REDIRECT_URL || "https://more-english.net";
  let url = "";
  if (bundleId) {
    url = `${redirectUrl}/bundles`;
  } else if (courseId) {
    url = `${redirectUrl}/bundles/${courseId}`;
  } else if (bookId) {
    return [
      `${redirectUrl}/orders?orderType=books&payment=success`,
      `${redirectUrl}/books/${bookId}` + "?payment=failed",
    ];
    // url = `${redirectUrl}/books/${bookId}`;
  } else if (booksPage) {
    url = `${redirectUrl}/books`;
  }
  return [url + "?payment=success", url + "?payment=failed"];
}

export const convertDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "مساءً" : "صباحًا";
  hours = hours % 12 || 12;
  const formatted = `${day}/${month}/${year} | ${hours}:${minutes} ${period}`;
  return formatted;
};

export function secondsToHms(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h === 0) {
    return `${m}m ${s}s`;
  }
  return `${h}h ${m}m ${s}s`;
}

export const mapGradeToText = (grade: string | number) => {
  switch (Number(grade)) {
    case 1:
      return "الصف الأول الثانوي";
    case 2:
      return "الصف الثاني الثانوي";
    case 3:
      return "الصف الثالث الثانوي";
    default:
      return "الصف الثانوي";
  }
};

export const mapTypeToText = (type) => {
  switch (type) {
    case 3:
      return "سنتر";
    case 4:
      return "اونلاين";
    case 5:
      return "اكواد سنتر";
    default:
      return "الطالب";
  }
};
