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
    <div className="w-full md:min-w-[280px] flex flex-col gap-2 border rounded-lg border-primary-800 bg-background">
      <h2 className="text-[20px] p-4 pb-0 text-right font-bold">الاسئلة:</h2>

      <div className="flex flex-col gap-4 max-h-80 overflow-y-auto p-4 pt-0">
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
