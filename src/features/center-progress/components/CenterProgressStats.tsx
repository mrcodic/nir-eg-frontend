import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CenterProgressData } from "@/types/center-progress.types";
import { formatProgressPercentage } from "@/utils/center-progress";

export function CenterProgressStats({
  stats,
}: {
  stats: CenterProgressData["stats"];
}) {
  const items = [
    { label: "إجمالي الحصص", value: stats.total_rooms, color: "text-primary" },
    { label: "حضور", value: stats.present, color: "text-green-700" },
    { label: "غياب", value: stats.absent, color: "text-red-700" },
    {
      label: "نسبة الحضور المسجل",
      value: formatProgressPercentage(stats.attendance_percentage),
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-xl shadow-none">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-muted-foreground text-xs leading-5">
                {item.label}
              </p>
              <p className={cn("text-2xl font-bold tabular-nums", item.color)}>
                <bdi>{item.value}</bdi>
              </p>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                "h-10 w-1 shrink-0 rounded-full bg-current",
                item.color,
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
