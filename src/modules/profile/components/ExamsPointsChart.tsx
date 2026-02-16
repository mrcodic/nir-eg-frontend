import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="font-semibold">امتحان {data?.title}</p>
        <p className="text-sm">الدرجة: {data?.percentage}%</p>
        <p
          className={`text-sm font-medium ${
            data?.passed ? "text-[#1EAD7B]" : "text-[#B75050]"
          }`}
        >
          {data?.passed ? "ناجح" : "راسب"}
        </p>
      </div>
    );
  }
  return null;
};

const ExamsPointsChart = ({
  exams,
}: {
  exams: { percent?: number; score?: number; passed: boolean; title: string }[];
}) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  const examData = exams.map((exam, index) => {
    return {
      exam: index + 1,
      title: exam.title,
      percentage: Math.min(exam.percent, 100),
      passed: exam.passed,
    };
  });

  return (
    <div className="col-span-12 w-full lg:col-span-8 lg:col-start-5">
      <h2 className="mb-6 text-[18px] font-bold">إحصائيات درجات الامتحان</h2>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-[#B75050]"></div>
          <span className="text-sm">راسب</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-[#1EAD7B]"></div>
          <span className="text-sm">ناجح</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={examData}
          margin={{
            right: isDesktop ? 50 : 30,
            left: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="exam"
            tick={{
              fill: "#374151",
              dx: !isDesktop ? 15 : 30,
              fontSize: !isDesktop ? 10 : 12,
            }}
            axisLine={false}
            tickLine={false}
            reversed={true}
            className={isDesktop ? "-translate-x-8" : "-translate-x-4"}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(tick) => {
              return `${tick}%`;
            }}
            tick={{
              fill: "#374151",
              dx: !isDesktop ? 15 : 30,
              fontSize: !isDesktop ? 10 : 12,
            }}
            axisLine={false}
            tickLine={false}
            orientation="right"
            // className="translate-x-2"
            width={!isDesktop ? 30 : 50}
          />
          <Tooltip
            content={CustomTooltip}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar
            dataKey="percentage"
            radius={[8, 8, 0, 0]}
            maxBarSize={22}
            minPointSize={2}
          >
            {examData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.passed ? "#1EAD7B" : "#B75050"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamsPointsChart;
