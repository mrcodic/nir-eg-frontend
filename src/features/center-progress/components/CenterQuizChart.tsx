"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { CenterQuizProgress } from "@/types/center-progress.types";
import { formatProgressPercentage } from "@/utils/center-progress";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  percentage: { label: "درجة الكويز", color: "var(--color-primary)" },
};

export function CenterQuizChart({
  quizzes,
}: {
  quizzes: CenterQuizProgress[];
}) {
  return (
    <Card className="min-w-0 rounded-xl shadow-none lg:col-span-2">
      <CardHeader className="gap-1.5 p-4 pb-2">
        <CardTitle className="text-base leading-6">تطور درجات الكويز</CardTitle>
        <CardDescription className="text-xs leading-5">
          نسبة درجات الكويز لكل حصة مسجلة
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 px-3 pb-4">
        {quizzes.length === 0 ? (
          <p className="text-muted-foreground flex h-60 items-center justify-center text-sm">
            لا توجد درجات كويز مسجلة حتى الآن
          </p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-60 w-full min-w-0"
              dir="ltr"
            >
              <LineChart
                accessibilityLayer
                data={quizzes}
                margin={{ top: 24, right: 8, left: 8, bottom: 4 }}
              >
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="number"
                  reversed
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  padding={{ left: 22, right: 22 }}
                />
                <YAxis
                  orientation="right"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={formatProgressPercentage}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip
                  formatter={formatProgressPercentage}
                  labelFormatter={(number) => `الحصة ${number}`}
                  contentStyle={{ direction: "rtl", borderRadius: 8 }}
                />
                <Line
                  type="linear"
                  dataKey="percentage"
                  name="درجة الكويز"
                  stroke="var(--color-percentage)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--color-card)", strokeWidth: 2.5 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    offset={10}
                    formatter={formatProgressPercentage}
                    fill="var(--color-primary)"
                    fontSize={11}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
            <p className="text-muted-foreground mt-1 text-center text-xs">
              رقم الحصة
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
