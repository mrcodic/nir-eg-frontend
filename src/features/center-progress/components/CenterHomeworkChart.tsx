"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { CenterHomeworkProgress } from "@/types/center-progress.types";
import { formatProgressPercentage } from "@/utils/center-progress";
import { Cell, Pie, PieChart } from "recharts";

const chartConfig = {
  completed: { label: "مكتمل", color: "var(--color-primary)" },
};

export function CenterHomeworkChart({
  homework,
}: {
  homework: CenterHomeworkProgress;
}) {
  const items = [
    {
      label: "مكتمل",
      value: homework.completed,
      className: "bg-primary-50 text-primary",
    },
    {
      label: "غير مكتمل",
      value: homework.incomplete,
      className: "bg-secondary-50 text-amber-800",
    },
    {
      label: "غير محلول",
      value: homework.unsolved,
      className: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <Card className="flex min-w-0 flex-col rounded-xl shadow-none lg:order-2">
      <CardHeader className="gap-1.5 p-4 pb-3">
        <CardTitle className="text-base leading-6">
          نسبة الواجبات المكتملة
        </CardTitle>
        <CardDescription className="text-xs leading-5">
          نسبة الواجبات المكتملة من الحصص المسجلة
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center gap-4 px-4 pb-4 lg:flex-col lg:gap-5">
        <div className="relative size-28 shrink-0 sm:size-36">
          <ChartContainer
            config={chartConfig}
            className="aspect-square size-full"
            aria-hidden="true"
          >
            <PieChart>
              <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                innerRadius="78%"
                outerRadius="100%"
                fill="var(--color-muted)"
                stroke="none"
                isAnimationActive={false}
              />
              <Pie
                data={[
                  { value: homework.percentage },
                  { value: 100 - homework.percentage },
                ]}
                dataKey="value"
                innerRadius="78%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={false}
              >
                <Cell fill="var(--color-completed)" />
                <Cell fill="transparent" />
              </Pie>
            </PieChart>
          </ChartContainer>
          <p className="text-primary absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums">
            <bdi>{formatProgressPercentage(homework.percentage)}</bdi>
            <span className="sr-only"> من الواجبات مكتملة</span>
          </p>
        </div>
        <dl className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-none lg:flex-row lg:flex-wrap lg:justify-center lg:gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs lg:bg-transparent lg:p-0",
                item.className,
              )}
            >
              <dt className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-current"
                />
                {item.label}
              </dt>
              <dd className="font-bold tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
