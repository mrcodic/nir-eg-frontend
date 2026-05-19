"use client";

import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { redirect, useParams, useRouter } from "next/navigation";

import { useAuthContext } from "@/context/auth-context";
import {
  ExamTimerBanner,
  ResultBanner,
  TargetGradeBanner,
} from "@/modules/exam/components/ExamBanners";
import TaskModalsWrapper from "@/modules/exam/components/TaskModalsWrapper";
import StartExamDialog from "@/modules/exam/components/StartExamDialog";
import { QuizStatus } from "@/types";
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

  if (!examId) {
    redirect("/ErrorPage?message=لم يتم العثور على الامتحان");
  }

  const {
    success,
    fail,
    sure,
    status,
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
    shouldStartQuiz: (start) => {
      const nowTime = Date.now();
      const storedTime = localStorage.getItem(`timer-${examId}-${profile?.id}`);

      const shouldStart =
        !start.review_pending &&
        (start.score === null || (storedTime && nowTime < Number(storedTime)));

      return {
        start: shouldStart,
        type: shouldStart
          ? storedTime && nowTime < Number(storedTime)
            ? "mid-session"
            : "fresh"
          : "no",
      };
    },
    onInitialize: (shouldStart) => {
      setStartExam(shouldStart);
      if (!shouldStart) {
        localStorage.removeItem(`timer-${examId}-${profile?.id}`);
      }
    },
    onRetakeSuccess: () => {
      localStorage.removeItem(`timer-${examId}-${profile?.id}`);
      setStartExam(true);
    },
    onConfirmRequired: () => {
      // useTaskLogic will set awaitingConfirm = true; dialog renders below
    },
  });

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

      {!status && data?.score && <TargetGradeBanner score={data.score} />}

      {status && data?.details?.score && (
        <ResultBanner score={data.details.score} />
      )}

      {start?.timer && <ExamTimerBanner timer={start.timer} />}

      <TaskForm
        taskId={examId.toString()}
        setSure={setSure}
        status={status}
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
