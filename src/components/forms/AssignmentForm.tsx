import TaskModalsWrapper from "@/modules/exam/components/TaskModalsWrapper";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { QuizStatus } from "@/types";
import { redirect, useParams } from "next/navigation";
import { memo } from "react";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }: { start: QuizStatus }) => {
  const { assignmentId } = useParams();

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
    isLoadingRetake,
  } = useTaskLogic();

  if (!assignmentId) {
    redirect("/ErrorPage?message=لم يتم العثور على هذا الواجب");
  }

  return (
    <>
      <TaskForm
        taskId={assignmentId?.toString()}
        setSure={setSure}
        isShowingAnswers={isShowingAnswers}
        setSuccess={setSuccess}
        setFail={setFail}
        setResolver={setResolver}
      />

      <TaskModalsWrapper
        sure={sure}
        success={success}
        fail={fail}
        handleClose={handleClose}
        start={start}
        showAnswersHandler={showAnswers}
        retakeHandler={retake}
        examId={Number(assignmentId)}
        isLoadingRetake={isLoadingRetake}
        isAssignment
      />
    </>
  );
};

export default memo(AssignmentForm);
