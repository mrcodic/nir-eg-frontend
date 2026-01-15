"use client";

import { Form } from "@/components/ui/form";
import { useTaskContext } from "@/context/TaskProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import ParagraphQuestion from "@/modules/exam/components/ParagraphQuestion";
import Question from "@/modules/exam/components/Question";
import WrittenQuestion from "@/modules/exam/components/WrittenQuestion";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { memo, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import CustomLoader from "../custom/Loader";
import { Button } from "../ui/button";

type Props = {
  taskId: string | number;
  setSure: (v: boolean) => void;
  status: boolean;
  setSuccess: (v: boolean) => void;
  setFail: (v: boolean) => void;
  setResolver: (v: any) => void;
  onTaskSubmit?: () => void;
};

function TaskForm({
  taskId,
  setSure,
  status,
  setSuccess,
  setFail,
  setResolver,
  onTaskSubmit,
}: Props) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement[]>([]);

  const form = useFormContext();
  const { getValues } = form;

  const {
    data,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    completed,
    setCompleted,
  } = useTaskContext();

  // ================= CONFIRM =================
  const saveConfirm = useCallback(() => {
    setSure(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, [setSure, setResolver]);

  // ================= SUBMIT =================
  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const values = getValues();
      const formData = new FormData();
      formData.append("quiz_id", String(taskId));

      const allQuestions: { id: number; type: number }[] = [];

      data?.questions?.forEach((q) => {
        if (q.type === 2 && q.related_questions) {
          q.related_questions.forEach((rq) => {
            allQuestions.push({ id: rq.id, type: rq.type });
          });
        } else {
          allQuestions.push({ id: q.id, type: q.type });
        }
      });

      allQuestions.forEach(({ id, type }) => {
        const value = values.questions?.[id];

        if (!value) {
          if (type === 3) {
            formData.append(`questions[${id}][text]`, null);
            formData.append(`questions[${id}][attachment]`, null);
          } else {
            formData.append(`questions[${id}]`, null);
          }
          return;
        }

        if (Array.isArray(value)) {
          if (value.length) {
            value.forEach((v, i) =>
              formData.append(`questions[${id}][${i}]`, v),
            );
          } else {
            formData.append(`questions[${id}]`, null);
          }
          return;
        }

        if (typeof value === "object") {
          formData.append(
            `questions[${id}][text]`,
            value.text?.trim() ? value.text : null,
          );

          formData.append(
            `questions[${id}][attachment]`,
            value.attachment instanceof File ? value.attachment : null,
          );
        }
      });

      const res = await axios.post(
        "/api?url=/students/quiz/answer&type=formData",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      queryClient.invalidateQueries({
        queryKey: [`/students/quiz/start/${taskId}`],
      });

      await new Promise((r) => setTimeout(r, 1000));

      if (res.data?.body?.result || res.data?.body?.review_pending) {
        setSuccess(true);
      } else {
        setFail(true);
      }

      onTaskSubmit?.();
    } catch (e: any) {
      toast({
        description: e.response?.data?.error?.message || "An error occurred",
        icon: "error",
      });
    } finally {
      setCompleted(false);
      setIsSubmitting(false);
    }
  }, [
    data,
    getValues,
    onTaskSubmit,
    queryClient,
    setCompleted,
    setFail,
    setIsSubmitting,
    setSuccess,
    taskId,
    toast,
  ]);

  // ================= AUTO SUBMIT =================
  useEffect(() => {
    if (completed === true) {
      onSubmit();
    }
  }, [completed, onSubmit]);

  // ================= STATES =================
  if (isLoading || !data?.questions?.length) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  // if (!data?.questions?.length) {
  //   return (
  //     <div className="flex min-h-40 items-center justify-center">
  //       <Link
  //         href="/grades"
  //         className="bg-primary rounded-lg px-2 py-1 font-bold text-white"
  //       >
  //         الذهاب الى الدرجات
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={cn("max-md:mt-6", {
          "pointer-events-none opacity-80": isSubmitting,
          // "mt-6": !status,
        })}
        dir="ltr"
      >
        <div id="taskForm" className="flex">
          <div className="flex-1 space-y-6">
            {data.questions.map((question, index) => {
              if (question.type === 2) {
                return (
                  <ParagraphQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    listRef={listRef}
                    status={status}
                    isAnswer={data.solution}
                  />
                );
              }

              if (question.type === 3) {
                return (
                  <WrittenQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    listRef={listRef}
                  />
                );
              }

              return (
                <Question
                  key={question.id}
                  question={question}
                  index={index}
                  listRef={listRef}
                  status={status}
                  isAnswer={data.solution}
                />
              );
            })}
          </div>
        </div>

        {!status && (
          <Button
            className="ms-auto mt-10 w-full max-w-[172px]"
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              const confirmed = await saveConfirm();
              if (confirmed) onSubmit();
            }}
          >
            {isSubmitting ? <CustomLoader /> : "حفظ الاجابات"}
          </Button>
        )}
      </form>

      {data.solution && (
        <ExamPDFGenerator taskId={Number(taskId)} className="mt-8" />
      )}
    </Form>
  );
}

export default memo(TaskForm);
