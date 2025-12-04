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
import { memo } from "react";
import TaskForm from "./TaskForm";

const ExamForm = ({ start, setStartExam }) => {
  const { examId } = useParams();

  const {
    form,
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
      const nowTime = new Date().getTime();
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

  const handleRetake = async () => {
    await retake();
  };

  if (!examId) {
    redirect("/ErrorPage?message=لم يتم العثور على امتحان");
  }

  return (
    <>
      {!status && data?.score && <TargetGradeBanner score={data?.score} />}
      {status && data?.details?.score && (
        <ResultBanner score={data?.details?.score} />
      )}
      {start?.timer && <ExamTimerBanner timer={start?.timer} />}

      <TaskForm
        form={form}
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
            (form &&
              form?.formState?.errors?.questions &&
              form?.formState?.errors?.questions?.filter(
                (item) => item && item?.toString()?.trim() !== ""
              )?.length) ||
            0
          }
        />
      )}

      {success && (
        <PassedModal
          open={success}
          score={start?.score_ratio}
          showAnswers={showAnswers}
          retake={handleRetake}
          start={start}
          taskId={examId}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          score={start?.score_ratio}
          showAnswers={showAnswers}
          retake={handleRetake}
          start={start}
          taskId={examId}
        />
      )}
    </>
  );
};

export default memo(ExamForm);
