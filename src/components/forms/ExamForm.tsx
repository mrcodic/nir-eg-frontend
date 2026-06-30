"use client";

import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { redirect, useParams, useRouter } from "next/navigation";

import { useAuthContext } from "@/context/auth-context";
import {
  ExamTimerBanner,
  ResultBanner,
  TargetGradeBanner,
} from "@/modules/exam/components/ExamBanners";
import StartExamDialog from "@/modules/exam/components/StartExamDialog";
import TaskModalsWrapper from "@/modules/exam/components/TaskModalsWrapper";
import { useTaskDraftClear } from "@/modules/exam/hooks/useTaskDraftClear";
import { QuizStatus } from "@/types";
import { TaskQuestionPayload, TaskShowAnswersData } from "@/types/quiz.types";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import TaskForm from "./TaskForm";

export type ExamType = "general" | "exam";

type Props = {
  start: QuizStatus;
  setStartExam: (startExam: boolean) => void;
  examType?: ExamType;
};

const ExamForm = ({ start, setStartExam, examType = "exam" }: Props) => {
  const { examId } = useParams();
  const { profile } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { roomId, classroomId } = useParams();

  const { clearDraft } = useTaskDraftClear({
    examType,
    taskId: Number(examId),
    userId: profile?.id,
  });

  const {
    success,
    fail,
    sure,
    isShowingAnswers,
    setSuccess,
    setFail,
    setResolver,
    setSure,
    showAnswers,
    retake,
    handleClose,
    data,
    isLoadingRetake,
    awaitingConfirm,
    proceedWithStart,
    cancelStart,
  } = useTaskLogic({
    shouldStartQuiz: (start: QuizStatus) => {
      const isMidSession =
        !!start.start_timer &&
        start.score_ratio === null &&
        !start.answer_expired &&
        !start?.review_pending;

      const isFresh =
        !start.start_timer &&
        start.score_ratio === null &&
        !start.answer_expired &&
        !start?.review_pending;

      const shouldStart = isFresh || isMidSession;

      if (isFresh) {
        clearDraft(); // new attempt, clear any stale draft
      }

      return {
        start: shouldStart,
        type: shouldStart ? (isMidSession ? "mid-session" : "fresh") : "no",
      };
    },
    onInitialize: (shouldStart) => {
      setStartExam(shouldStart);
      if (!shouldStart) {
        localStorage.removeItem(`timer-${examId}-${profile?.id}`);
      }
      if (examType === "exam" && roomId && classroomId) {
        queryClient.invalidateQueries({
          queryKey: [
            `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
          ],
        });
      }
    },
    onRetakeSuccess: async () => {
      await clearDraft();
      localStorage.removeItem(`timer-${examId}-${profile?.id}`);
      setStartExam(true);

      if (examType === "exam" && roomId && classroomId) {
        queryClient.invalidateQueries({
          queryKey: [
            `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
          ],
        });
      }
    },
  });

  if (!examId) {
    redirect("/ErrorPage?message=لم يتم العثور على الامتحان");
  }

  return (
    <>
      <StartExamDialog
        open={awaitingConfirm}
        start={start}
        onConfirm={proceedWithStart}
        onCancel={() => {
          cancelStart();
          router.back();
        }}
      />

      {!isShowingAnswers && (data as TaskQuestionPayload)?.score && (
        <TargetGradeBanner
          score={Number((data as TaskQuestionPayload)?.score)}
        />
      )}

      {isShowingAnswers && (data as TaskShowAnswersData).details?.score && (
        <ResultBanner score={(data as TaskShowAnswersData).details.score} />
      )}

      {start?.timer && <ExamTimerBanner timer={start.timer} />}

      <TaskForm
        taskId={examId.toString()}
        setSure={setSure}
        isShowingAnswers={isShowingAnswers}
        setSuccess={setSuccess}
        setFail={setFail}
        setResolver={setResolver}
        onTaskSubmit={() => {
          setStartExam(false);
          localStorage.removeItem(`timer-${examId}-${profile?.id}`);
        }}
        examType={examType}
      />

      <TaskModalsWrapper
        sure={sure}
        success={success}
        fail={fail}
        handleClose={handleClose}
        start={start}
        showAnswersHandler={showAnswers}
        retakeHandler={retake}
        examId={Number(examId)}
        isLoadingRetake={isLoadingRetake}
        examType={examType}
      />
    </>
  );
};

export default memo(ExamForm);
