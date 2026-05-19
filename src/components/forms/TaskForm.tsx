"use client";

import { Form } from "@/components/ui/form";
import { useTaskContext } from "@/context/TaskProvider";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import ParagraphQuestion from "@/modules/exam/components/ParagraphQuestion";
import Question from "@/modules/exam/components/Question";
import WrittenQuestion from "@/modules/exam/components/WrittenQuestion";
import { useQueryClient } from "@tanstack/react-query";
import { getActionErrorMeta } from "@/lib/errorCodes";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import SmallSpinner from "../custom/SmallSpinner";
import { Button } from "../ui/button";
import { ExamType } from "./ExamForm";

type Props = {
  taskId: string | number;
  setSure: (v: boolean) => void;
  status: boolean;
  setSuccess: (v: boolean) => void;
  setFail: (v: boolean) => void;
  setResolver: (v: any) => void;
  onTaskSubmit?: () => void;
  examType?: ExamType;
};

function TaskForm({
  taskId,
  setSure,
  status,
  setSuccess,
  setFail,
  setResolver,
  onTaskSubmit,
  examType = "exam",
}: Props) {
  const { toast } = useToast();
  const { SingleCourse: classroomId, room: roomId } = useParams();
  const autoSubmitTriggered = useRef<boolean>(false);

  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement[]>([]);

  const form = useFormContext();
  const { getValues, trigger, reset } = form;

  const {
    data,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    isCompleted,
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
    if (!data?.questions?.length) return;

    setIsSubmitting(true);

    try {
      const values = getValues();
      const formData = new FormData();
      formData.append("quiz_id", String(taskId));
      formData.append("classroom_id", String(classroomId));

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
          // written
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

      const res = await mutateClient("/students/quiz/answer", {
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      queryClient.invalidateQueries({
        queryKey: [`/students/quiz/start`, taskId],
      });

      if (examType === "general") {
        queryClient.invalidateQueries({
          queryKey: [`/students/get-exams/${classroomId}`],
        });
      }

      if (examType !== "general" && roomId) {
        queryClient.invalidateQueries({
          queryKey: [
            `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
          ],
        });
      }

      await new Promise((r) => setTimeout(r, 1000));

      reset({
        quiz_id: taskId,
        questions: {},
      });
      trigger();

      if (res?.body?.result || res?.body?.review_pending) {
        setSuccess(true);
      } else {
        setFail(true);
      }

      onTaskSubmit?.();
    } catch (e: unknown) {
      const meta = isAxiosError(e)
        ? getActionErrorMeta(e.response?.status, e.response?.data?.code)
        : getActionErrorMeta(undefined, undefined);

      toast({ description: meta.description, icon: "error" });
    } finally {
      setCompleted(false);
      setIsSubmitting(false);
    }
  }, [
    data?.questions,
    setIsSubmitting,
    getValues,
    taskId,
    queryClient,
    examType,
    roomId,
    reset,
    trigger,
    onTaskSubmit,
    classroomId,
    setSuccess,
    setFail,
    toast,
    setCompleted,
  ]);

  // ================= AUTO SUBMIT =================
  useEffect(() => {
    if (isCompleted === true && !autoSubmitTriggered.current) {
      autoSubmitTriggered.current = true;
      onSubmit();
    }
  }, [isCompleted, onSubmit]);

  // ================= STATES =================
  if (isLoading || !data?.questions?.length) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <SmallSpinner className="text-primary-800" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={cn("max-lg:mt-6", {
          "pointer-events-none opacity-80": isSubmitting,
          // "mt-6": !status,
        })}
        dir="ltr"
      >
        <div id="taskForm" className="flex">
          <div className="flex-1 space-y-4">
            {data.questions.map((question, index) => {
              return (
                <div key={question.id}>
                  {question.type === 2 ? (
                    <ParagraphQuestion
                      question={question}
                      index={index}
                      listRef={listRef}
                      status={status}
                      isAnswer={data.solution}
                    />
                  ) : question.type === 3 ? (
                    <WrittenQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      listRef={listRef}
                    />
                  ) : (
                    <Question
                      key={question.id}
                      question={question}
                      index={index}
                      listRef={listRef}
                      status={status}
                      isAnswer={data.solution}
                    />
                  )}
                  {index < data.questions.length - 1 && (
                    <hr className="border-secondary mt-4" />
                  )}
                </div>
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
              await trigger();
              const confirmed = await saveConfirm();
              if (confirmed) onSubmit();
            }}
          >
            {isSubmitting ? (
              <SmallSpinner className="text-white" />
            ) : (
              "حفظ الاجابات"
            )}
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
