import { DynamicProfileField } from "@/types/auth.types";

type SortOptions = {
  excludeKeys?: string[];
};

const getPriority = (field: DynamicProfileField): number => {
  const key = field.key.toLowerCase();
  if (key.includes("name")) return 0;
  if (field.key === "profile_attachments" || field.type === "file") return 1;
  if (field.type === "phone") return 2;
  if (field.key === "state_id" || field.key === "city_id") return 3;
  return 4;
};

export function sortDynamicProfileFields(
  fields: DynamicProfileField[],
  options: SortOptions = {},
): DynamicProfileField[] {
  const excludeSet = new Set(options.excludeKeys ?? []);
  const filtered = fields.filter((field) => !excludeSet.has(field.key));

  return filtered
    .map((field, index) => ({ field, index }))
    .sort((a, b) => {
      const priorityA = getPriority(a.field);
      const priorityB = getPriority(b.field);

      if (priorityA !== priorityB) return priorityA - priorityB;

      if (priorityA === 2) {
        if (a.field.key === "state_id" && b.field.key === "city_id") return -1;
        if (a.field.key === "city_id" && b.field.key === "state_id") return 1;
      }

      return a.index - b.index;
    })
    .map(({ field }) => field);
}
