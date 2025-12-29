import AssignmentModal from "@/components/modals/AssignmentModal";
import FailModal from "@/components/modals/FailModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { QuizStatus } from "@/types";
import { redirect, useParams } from "next/navigation";
import { useFormState } from "react-hook-form";
import { Sure } from "../modals/Sure";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }: { start: QuizStatus }) => {
  const { assignmentId } = useParams();

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
        <AssignmentModal
          open={success}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId?.toString()}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId?.toString()}
        />
      )}
    </>
  );
};

export default AssignmentForm;
