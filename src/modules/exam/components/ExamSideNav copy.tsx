"use client";

import { useTaskContext } from "@/context/TaskProvider";
import { isParagraphCorrect, isQuestionCorrect } from "@/lib/utils";
import SideNavLink from "./SideNavLink";

function ExamSideNav() {
  const { form, data } = useTaskContext();

  const isAnswer = data && data?.solution;
  const questions = data?.questions || [];
  // const questions =
  //   data?.questions || Array.from({ length: start?.questions_count || 0 });

  if (!questions?.length) return null;

  return (
    <div className="border-primary-800 bg-background flex w-full flex-col justify-center gap-2 rounded-lg border md:min-w-[280px]">
      <h2 className="mb-2 p-4 pb-0 text-right text-[20px] font-bold text-black">
        الاسئلة:
      </h2>
      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-4 pt-0">
        {questions?.map((el, index) => {
          let fieldAnswered;
          if (!isAnswer && data && el?.id) {
            const qValue = form.getValues("questions")?.[el?.id];
            if (el?.type == 2) {
              // paragraph

              for (let i = 0; i < el?.related_questions?.length; i++) {
                const relatedQ = el?.related_questions?.[i];
                const relatedQValue =
                  form.getValues("questions")?.[relatedQ?.id];
                fieldAnswered = el?.has_multi_correct
                  ? relatedQValue?.length > 1
                  : relatedQValue?.length > 0;
              }
            } else if (el?.type == 1) {
              // mcq

              fieldAnswered = el?.has_multi_correct
                ? qValue?.length > 1
                : qValue?.length > 0;
            } else {
              // written

              fieldAnswered = qValue?.text?.length > 0;
            }
          } else if (isAnswer && data) {
            if (el?.type == 2) {
              // paragraph

              fieldAnswered = isParagraphCorrect(el);
            } else if (el?.type == 1) {
              // mcq

              fieldAnswered = isQuestionCorrect(el);
            } else {
              // written

              fieldAnswered = !!el?.essay?.is_correct;
            }
          }

          return (
            <SideNavLink
              key={index}
              question={el}
              index={index}
              isAnswer={isAnswer}
              fieldAnswered={data ? fieldAnswered : null}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExamSideNav;
