// utils/telegram.ts
type GradeNum = "1" | "2" | "3";

// ① Read from NEXT_PUBLIC_* at build time (client-safe)
const TELEGRAM_LINKS: Record<GradeNum, string> = {
  "1": process.env.NEXT_PUBLIC_telegramGradeOne ?? "",
  "2": process.env.NEXT_PUBLIC_telegramGradeTwo ?? "",
  "3": process.env.NEXT_PUBLIC_telegramGradeThree ?? "",
};

// ② Map your real DB grade_ids to "1" | "2" | "3"
// EDIT THIS to match your DB ids exactly (examples shown)
const DB_GRADEID_TO_GNUM: Record<string, GradeNum> = {
  "1": "1",
  "2": "2",
  "3": "3",
  // e.g. if your DB uses 10/11/12:
  // "10": "1",
  // "11": "2",
  // "12": "3",
};

function asGradeNum(g: unknown): GradeNum | null {
  const s = String(g ?? "");
  return s === "1" || s === "2" || s === "3" ? (s as GradeNum) : null;
}

/** Main entry: returns the correct Telegram link or null */
export function telegramLinkFor({
  gradeId,
  grade, // optional: if you only have grade number from URL
}: {
  gradeId?: number | string | null;
  grade?: number | string | null;
}): string | null {
  // Prefer gradeId if available
  if (gradeId != null) {
    const gnum = DB_GRADEID_TO_GNUM[String(gradeId)];
    if (gnum) return TELEGRAM_LINKS[gnum] || null;
  }

  // Fallback to plain grade "1|2|3"
  const gnum = asGradeNum(grade);
  if (gnum) return TELEGRAM_LINKS[gnum] || null;

  return null;
}
