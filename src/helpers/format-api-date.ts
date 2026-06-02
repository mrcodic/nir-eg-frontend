type DateFormatOptions = Intl.DateTimeFormatOptions & {
  fallback?: string;
};

export function parseApiDate(value?: string | null): Date | null {
  if (!value) return null;

  if (/^\d{4}\s[A-Za-z]{3}\s\d{2}$/.test(value)) {
    const date = new Date(`${value} 00:00:00 UTC`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value)) {
    const date = new Date(value.replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatApiDate(
  value: string | null | undefined,
  options: DateFormatOptions = {},
): string {
  const { fallback = "--", ...intlOptions } = options;
  const date = parseApiDate(value);

  if (!date) return fallback;

  return new Intl.DateTimeFormat("ar-EG", intlOptions).format(date);
}

export function formatApiDateShort(value?: string | null): string {
  const date = parseApiDate(value);
  if (!date) return "--";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
