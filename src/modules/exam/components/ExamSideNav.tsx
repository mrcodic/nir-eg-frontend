"use client";

import { useTaskContext } from "@/context/TaskProvider";
import { useWatch } from "react-hook-form";
import SideNavItem from "./SideNavItem";

function ExamSideNav() {
  const { control, data } = useTaskContext();

  const isAnswer = !!data?.solution;
  const questions = data?.questions ?? [];

  const answers = useWatch({
    control: control,
    name: "questions",
  });

  if (!questions.length) return null;

  return (
    <div className="bg-background flex w-full flex-col gap-2 rounded-lg md:min-w-[280px]">
      <h2 className="p-4 pb-0 text-right text-[20px] font-bold">الاسئلة:</h2>

      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-4 pt-0">
        {questions.map((q, index) => (
          <SideNavItem
            key={q.id}
            question={q}
            index={index}
            answers={answers}
            isAnswer={isAnswer}
          />
        ))}
      </div>
    </div>
  );
}

export default ExamSideNav;
