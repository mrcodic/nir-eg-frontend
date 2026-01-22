"use client";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { IPortalSummaryData } from "../types";

const COLORS = ["#1EAD7B", "#B75050"];

const chartConfig = {
  primary: {
    label: "حضور",
    color: COLORS[0],
  },
  secondary: {
    label: "غياب",
    color: COLORS[1],
  },
} satisfies ChartConfig;

export default function AttendanceChart({
  attendance,
}: {
  attendance: IPortalSummaryData["attendance"];
}) {
  const primaryPercent = attendance.attend / attendance.total;
  const secondaryPercent = attendance.absent / attendance.total;

  const data = [
    {
      name: "Attend",
      value: primaryPercent,
      key: "primary",
    },
    {
      name: "Absent",
      value: secondaryPercent,
      key: "secondary",
    },
  ];

  return (
    <div className="w-full lg:col-span-8 lg:col-start-5 col-span-12 flex lg:justify-end justify-center h-fit">
      <div className="relative lg:w-fit h-fit">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[300px] w-[300px]"
        >
          <PieChart>
            <Pie
              data={[
                {
                  name: "Absent",
                  value: 100,
                  key: "primary",
                },
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={120}
              outerRadius={150}
              startAngle={80}
              endAngle={-280}
              cornerRadius={10}
              stroke="none"
            >
              <Cell key={"Absent"} fill={COLORS[1]} />
            </Pie>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={120}
              outerRadius={150}
              cornerRadius={10}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell key={"Attend"} fill={COLORS[0]} />
              <Cell key={"Absent"} fill={"transparent"} />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* center labels */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 size-6 rounded-full" />
            <span className="text-3xl font-semibold text-emerald-600">
              {(primaryPercent * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 size-6 rounded-full" />
            <span className="text-3xl font-semibold text-rose-600">
              {(secondaryPercent * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
