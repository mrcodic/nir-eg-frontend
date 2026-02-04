"use client";

import FailModal from "@/components/modals/FailModal";
import PassedModal from "@/components/modals/passedModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { redirect, useParams } from "next/navigation";

import {
  ExamTimerBanner,
  ResultBanner,
  TargetGradeBanner,
} from "@/modules/exam/components/ExamBanners";
import { QuizStatus } from "@/types";
import { memo } from "react";
import SureModal from "../modals/Sure";
import TaskForm from "./TaskForm";
import { useAuthContext } from "@/context/auth-context";

export type ExamType = "general" | "exam";

type Props = {
  start: QuizStatus;
  setStartExam: (startExam: boolean) => void;
  examType?: ExamType;
};

const ExamForm = ({ start, setStartExam, examType = "exam" }: Props) => {
  const { examId } = useParams();
  const { profile } = useAuthContext();

  if (!examId) {
    redirect("/ErrorPage?message=لم يتم العثور على امتحان");
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
  } = useTaskLogic({
    shouldStartQuiz: (start) => {
      const nowTime = Date.now();
      const storedTime = localStorage.getItem(`timer-${examId}-${profile?.id}`);

      return (
        !start.review_pending &&
        (start.score === null || (storedTime && nowTime < Number(storedTime)))
      );
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
  });

  return (
    <>
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

      {sure && (
        <SureModal
          open={sure}
          setOpen={handleClose}
          questionsCount={start?.questions_count}
        />
      )}

      {success && (
        <PassedModal
          open={success}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={examId.toString()}
          isLoadingRetake={isLoadingRetake}
          examType={examType}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={examId.toString()}
          isLoadingRetake={isLoadingRetake}
          examType={examType}
        />
      )}
    </>
  );
};

export default memo(ExamForm);
