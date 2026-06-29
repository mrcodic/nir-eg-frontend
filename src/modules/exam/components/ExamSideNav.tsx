"use client";

import { useTaskContext } from "@/context/TaskProvider";
import SideNavItem from "./SideNavItem";
import { ScrollArea } from "@/components/ui/scroll-area";

function ExamSideNav() {
  const { data } = useTaskContext();

  const isAnswer = !!data?.solution;
  const questions = data?.questions ?? [];

  if (!questions.length) return null;

  return (
    <div className="bg-background flex w-full flex-col gap-2 rounded-lg md:min-w-[280px]">
      <h2 className="p-4 pb-0 text-right text-[20px] font-bold">الاسئلة:</h2>

      <ScrollArea
        className="flex max-h-80 flex-col overflow-y-auto p-4 pt-0"
        dir="rtl"
        thumbClassName="bg-primary-800"
      >
        <div className="flex flex-col gap-4">
          {questions.map((q, index) => (
            <SideNavItem
              key={q.id}
              question={q}
              index={index}
              isAnswer={isAnswer}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ExamSideNav;
