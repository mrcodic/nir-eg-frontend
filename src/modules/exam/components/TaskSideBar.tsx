import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import ExamSideInfo from "./ExamSideInfo";
import ExamSideNav from "./ExamSideNav";

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
    <ScrollArea
      className={cn(
        "relative! flex flex-col gap-4 overflow-y-auto pb-2 max-lg:w-full lg:sticky! lg:top-[85px] lg:max-h-[calc(100vh-90px)] lg:group-data-[template=landing-v3]/template:top-29 group-data-[template=landing-v3]/template:lg:max-h-[calc(100vh-126px)]",
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
