"use client";

import FailModal from "@/components/modals/FailModal";
import PassedModal from "@/components/modals/passedModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { redirect, useParams } from "next/navigation";
import { Sure } from "../modals/Sure";

import {
  ExamTimerBanner,
  ResultBanner,
  TargetGradeBanner,
} from "@/modules/exam/components/ExamBanners";
import { QuizStatus } from "@/types";
import { memo, useCallback } from "react";
import { useFormState } from "react-hook-form";
import TaskForm from "./TaskForm";

type Props = {
  start: QuizStatus;
  setStartExam: (startExam: boolean) => void;
};

const ExamForm = ({ start, setStartExam }: Props) => {
  const { examId } = useParams();

  if (!examId) {
    redirect("/ErrorPage?message=لم يتم العثور على امتحان");
  }

  const { errors } = useFormState();

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
  } = useTaskLogic({
    shouldStartQuiz: (start) => {
      const nowTime = Date.now();
      const storedTime = localStorage.getItem(`timer${examId}`);

      return (
        !start.review_pending &&
        (start.score === null || (storedTime && nowTime < Number(storedTime)))
      );
    },
    onInitialize: (shouldStart) => {
      setStartExam(shouldStart);
      if (!shouldStart) {
        localStorage.removeItem(`timer${examId}`);
      }
    },
    onRetakeSuccess: () => {
      localStorage.removeItem(`timer${examId}`);
      setStartExam(true);
    },
  });

  const handleRetake = useCallback(async () => {
    await retake();
  }, [retake]);

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
          localStorage.removeItem(`timer${examId}`);
        }}
      />

      {sure && (
        <Sure
          open={sure}
          setOpen={handleClose}
          length={
            (errors?.questions &&
              (errors?.questions?.message || errors?.questions.root
                ? start?.questions_count
                : Object.keys(errors?.questions).length)) ||
            0
          }
        />
      )}

      {success && (
        <PassedModal
          open={success}
          showAnswers={showAnswers}
          retake={handleRetake}
          start={start}
          taskId={examId.toString()}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          showAnswers={showAnswers}
          retake={handleRetake}
          start={start}
          taskId={examId.toString()}
        />
      )}
    </>
  );
};

export default memo(ExamForm);
