import FailModal from "@/components/modals/FailModal";
import PassedModal from "@/components/modals/passedModal";
import { useTaskLogic } from "@/modules/exam/hooks/useTaskLogic";
import { useParams } from "next/navigation";
import { Sure } from "../modals/Sure";
import { ResultBanner, TargetGradeBanner } from "../ui/exam-banners";
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
  });

  console.log("start : ", start);

  const handleRetake = async () => {
    await retake(() => {
      localStorage.removeItem(`timer${examId}`);
      setStartExam(true);
    });
  };

  console.log(status, data);

  return (
    <>
      {!status && <TargetGradeBanner score={data?.score} />}
      {status && <ResultBanner score={data?.details?.score} />}

      <TaskForm
        taskId={examId}
        setSure={setSure}
        status={status}
        setSuccess={setSuccess}
        setFail={setFail}
        setResolver={setResolver}
        onTaskSubmit={() => {
          setStartExam(false);
          localStorage.removeItem(`timer${examId}`);
        }}
        form={form}
      />

      <Sure
        open={sure}
        setOpen={handleClose}
        length={
          (form?.formState?.errors?.questions &&
            form?.formState?.errors?.questions?.filter(
              (item) => item && item?.toString()?.trim() !== ""
            )?.length) ||
          0
        }
      />

      <PassedModal
        open={success}
        score={start?.score_ratio}
        showAnswers={showAnswers}
        retake={handleRetake}
        start={start}
        taskId={examId}
      />

      <FailModal
        open={fail}
        score={start?.score_ratio}
        showAnswers={showAnswers}
        retake={handleRetake}
        start={start}
        taskId={examId}
      />
    </>
  );
};

export default ExamForm;
