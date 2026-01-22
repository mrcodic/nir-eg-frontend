import { cn } from "@/lib/utils";
import Image from "next/image";

function ExamChartsAside({
  counts,
  className,
}: {
  counts: {
    total: number;
    passed: number;
    failed: number;
  };
  className?: string;
}) {
  const { total, passed, failed } = counts || {};
  return (
    <div className={cn("flex flex-col gap-x-12", className)}>
      <ChartAsideItem
        title="عدد الامتحانات الكلية"
        icon="/assets/ExamsColor.svg"
        value={total}
        valueLabel="امتحان"
      />

      <ChartAsideItem
        title="ناجح"
        icon="/assets/CorrectColor.svg"
        value={passed}
        valueLabel="امتحان"
        color="text-[#1EAD7B]"
      />

      <ChartAsideItem
        title="راسب"
        icon="/assets/Close2.svg"
        value={failed}
        valueLabel="امتحان"
        color="text-[#B75050]"
        isLast
      />
    </div>
  );
}

export default ExamChartsAside;

export const ChartAsideItem = ({
  title,
  icon,
  value,
  valueLabel,
  isLast,
  color,
}: {
  title: string;
  icon: string;
  value: number;
  valueLabel: string;
  isLast?: boolean;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b py-4",
        isLast ? "border-b-0" : "border-gray-light border-b",
      )}
    >
      <div className="flex items-center gap-4">
        <Image src={icon} width={32} height={32} alt="" />
        <h4 className={cn("text-lg font-bold", color)}>{title}</h4>
      </div>
      <div className="flex items-center gap-2 ps-12 text-lg font-bold">
        <span className={cn("text-28", color)}>{value}</span>
        <span>{valueLabel}</span>
      </div>
    </div>
  );
};
