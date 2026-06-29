import { useAuthContext } from "@/context/auth-context";
import TaskModalsWrapper from "@/modules/exam/components/TaskModalsWrapper";
import { useTaskDraftClear } from "@/modules/exam/hooks/useTaskDraftClear";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { QuizStatus } from "@/types";
import { redirect, useParams } from "next/navigation";
import { memo } from "react";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }: { start: QuizStatus }) => {
  const { assignmentId } = useParams();
  const { profile } = useAuthContext();

  const { clearDraft } = useTaskDraftClear({
    examType: "assignment",
    taskId: assignmentId as string,
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
    isLoadingRetake,
  } = useTaskLogic({
    onRetakeSuccess: async () => {
      await clearDraft();
    },
  });

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
