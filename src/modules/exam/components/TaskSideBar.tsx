import React, { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import ExamSideInfo from "./ExamSideInfo";
import ExamSideNav from "./ExamSideNav";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExamSideInfoProps = ComponentProps<typeof ExamSideInfo>;

type TaskSideBarProps = ExamSideInfoProps & {
  className?: string;
  showNav?: boolean;
};

export default function TaskSideBar({
  className,
  showNav = true,
  ...examSideInfoProps
}: TaskSideBarProps) {
  return (
    // max-h-[calc(100vh-130px)]
    <ScrollArea
      className={cn(
        "relative! flex flex-col gap-4 overflow-y-auto max-lg:w-full lg:sticky! lg:max-h-[calc(100vh-90px)] group-data-[template=landing-v3]/template:lg:max-h-[calc(100vh-126px)]",
        {
          "top-[85px] group-data-[template=landing-v3]/template:top-29":
            examSideInfoProps?.startTimer,
        },
        className,
      )}
      dir="rtl"
    >
      <div className="flex flex-col gap-4 pe-2">
        <ExamSideInfo {...examSideInfoProps} />

        {showNav && <ExamSideNav />}
      </div>
    </ScrollArea>
  );
}
