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
import { useEffect, useRef } from "react";
import CustomLoader from "../custom/Loader";

function TaskForm({
  taskId,
  setSure,
  status,
  setSuccess,
  setFail,
  setResolver,
  form,
  onTaskSubmit,
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const listRef = useRef([]);

  const { data, isSubmitting, setIsSubmitting, completed, setCompleted } =
    useTaskContext();

  // ============= AUTO-SUBMIT ON COMPLETION =============
  useEffect(() => {
    if (completed === true) {
      form.handleSubmit(onSubmit, onError)();
    }
  }, [completed]);

  const saveConfirm = () => {
    setSure(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const onSubmit = async (v) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("quiz_id", taskId);

      const allQuestions = [];

      data?.questions?.forEach((question) => {
        if (question.type === 2 && question.related_questions) {
          question.related_questions.forEach((relatedQ) => {
            allQuestions.push({
              id: relatedQ.id,
              type: relatedQ.type,
            });
          });
        } else {
          allQuestions.push({
            id: question.id,
            type: question.type,
          });
        }
      });

      allQuestions.forEach(({ id: questionId, type: questionType }) => {
        const value = v.questions?.[questionId];

        if (!value) {
          if (questionType === 3) {
            formData.append(`questions[${questionId}][text]`, null);
            formData.append(`questions[${questionId}][attachment]`, null);
          } else {
            formData.append(`questions[${questionId}]`, null);
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach((answerId, index) => {
              formData.append(`questions[${questionId}][${index}]`, answerId);
            });
          } else {
            formData.append(`questions[${questionId}]`, null);
          }
        } else if (typeof value === "object" && value !== null) {
          const hasText = value?.text && value.text?.trim().length > 0;
          const hasAttachment =
            value.attachment && value.attachment instanceof File;

          if (hasText) {
            formData.append(`questions[${questionId}][text]`, value.text);
          } else {
            formData.append(`questions[${questionId}][text]`, null);
          }

          if (hasAttachment) {
            formData.append(
              `questions[${questionId}][attachment]`,
              value.attachment
            );
          } else {
            formData.append(`questions[${questionId}][attachment]`, null);
          }
        } else {
          // Unexpected value type
          if (questionType === 3) {
            formData.append(`questions[${questionId}][text]`, null);
            formData.append(`questions[${questionId}][attachment]`, null);
          } else {
            formData.append(`questions[${questionId}]`, null);
          }
        }
      });

      const response = await axios.post(
        "/api?url=/students/quiz/answer&type=formData",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      queryClient.invalidateQueries({
        queryKey: [`/students/quiz/start/${taskId}`],
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.data?.body.result || response.data?.body?.review_pending) {
        setSuccess(true);
      } else {
        setFail(true);
      }

      onTaskSubmit?.();
    } catch (e) {
      toast({
        description: e.response?.data?.error?.message || "An error occurred",
        icon: "error",
      });
    } finally {
      setCompleted(false);
      setIsSubmitting(false);
    }
  };

  const onError = async (errors) => {
    form.handleSubmit(onSubmit(form.getValues()))();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("mt-6", {
          "opacity-80 pointer-events-none": form?.formState?.isSubmitting,
        })}
        dir="ltr"
      >
        <div id="taskForm" className="flex">
          <div className="flex-1 lg:ml-[5%] space-y-6">
            {data?.questions?.map((question, index) => {
              if (question.type === 2) {
                return (
                  <ParagraphQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    form={form}
                    status={status}
                    listRef={listRef}
                    isAnswer={data?.solution}
                  />
                );
              } else if (question.type === 3) {
                return (
                  <WrittenQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    form={form}
                    listRef={listRef}
                  />
                );
              } else {
                return (
                  <Question
                    key={question.id}
                    question={question}
                    index={index}
                    form={form}
                    status={status}
                    listRef={listRef}
                    isAnswer={data?.solution}
                  />
                );
              }
            })}
          </div>
        </div>

        {!status && data && (
          <button
            className="bg-color-primary border-2 flex justify-center border-primary-700 w-[270px] py-2 mt-[40px] text-white rounded-lg font-bold"
            type="button"
            disabled={isSubmitting}
            onClick={async (e) => {
              e.preventDefault();
              await form.trigger();
              const confirmed = await saveConfirm();
              if (!confirmed) return;
              form.handleSubmit(onSubmit, onError)();
            }}
          >
            {isSubmitting ? <CustomLoader /> : "حفظ"}
          </button>
        )}
      </form>

      {data?.solution && <ExamPDFGenerator taskId={taskId} className="mt-8" />}
    </Form>
  );
}

export default TaskForm;
