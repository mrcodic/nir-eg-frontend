import AssignmentModal from "@/components/modals/AssignmentModal";
import FailModal from "@/components/modals/FailModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { QuizStatus } from "@/types";
import { redirect, useParams } from "next/navigation";
import { memo } from "react";
import SureModal from "../modals/Sure";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }: { start: QuizStatus }) => {
  const { assignmentId } = useParams();

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
    isLoadingRetake,
  } = useTaskLogic();

  if (!assignmentId) {
    redirect("/ErrorPage?message=لم يتم العثور على واجب");
  }

  return (
    <>
      <TaskForm
        taskId={assignmentId?.toString()}
        setSure={setSure}
        status={status}
        setSuccess={setSuccess}
        setFail={setFail}
        setResolver={setResolver}
      />

      {sure && (
        <SureModal
          open={sure}
          setOpen={handleClose}
          questionsCount={start?.questions_count}
        />
      )}

      {success && (
        <AssignmentModal
          open={success}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId?.toString()}
          isLoadingRetake={isLoadingRetake}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId?.toString()}
          isLoadingRetake={isLoadingRetake}
        />
      )}
    </>
  );
};

export default memo(AssignmentForm);
