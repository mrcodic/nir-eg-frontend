import AssignmentModal from "@/components/modals/AssignmentModal";
import FailModal from "@/components/modals/FailModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { redirect, useParams } from "next/navigation";
import { Sure } from "../modals/Sure";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }) => {
  const { assignmentId } = useParams();

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
  } = useTaskLogic();

  if (!assignmentId) {
    redirect("/ErrorPage?message=لم يتم العثور على واجب");
  }

  console.log(start);

  return (
    <>
      <TaskForm
        form={form}
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
            (form?.formState?.errors?.questions &&
              Object.keys(form?.formState?.errors?.questions).length) ||
            0
          }
        />
      )}

      {success && (
        <AssignmentModal
          open={success}
          score={start?.score_ratio}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          score={start?.score_ratio}
          showAnswers={showAnswers}
          retake={retake}
          start={start}
          taskId={assignmentId}
        />
      )}
    </>
  );
};

export default AssignmentForm;
