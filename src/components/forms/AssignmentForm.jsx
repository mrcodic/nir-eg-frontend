import AssignmentModal from "@/components/modals/AssignmentModal";
import FailModal from "@/components/modals/FailModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { useParams } from "next/navigation";
import { Sure } from "../modals/Sure";
import TaskForm from "./TaskForm";

const AssignmentForm = ({ start }) => {
  const { assignmentId } = useParams();

  const {
    form,
    success,
    fail,
    setFail,
    sure,
    status,
    setSuccess,
    setFail: setFailState,
    setResolver,
    setSure,
    showAnswers,
    retake,
    handleClose,
  } = useTaskLogic();

  console.log(start);

  return (
    <>
      <TaskForm
        taskId={assignmentId}
        setSure={setSure}
        status={status}
        setSuccess={setSuccess}
        setFail={setFailState}
        setResolver={setResolver}
        form={form}
      />

      <Sure
        open={sure}
        setOpen={handleClose}
        length={
          (form?.formState?.errors?.questions &&
            Object.keys(form?.formState?.errors?.questions).length) ||
          0
        }
      />

      <AssignmentModal
        open={success}
        score={start?.score_ratio}
        showAnswers={showAnswers}
        retake={retake}
        start={start}
        taskId={assignmentId}
      />

      <FailModal
        open={fail}
        setOpen={setFail}
        score={start?.score_ratio}
        showAnswers={showAnswers}
        retake={retake}
        start={start}
        taskId={assignmentId}
      />
    </>
  );
};

export default AssignmentForm;
