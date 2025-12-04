import { useTaskContext } from "@/context/TaskProvider";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTaskLogic = (
  options: {
    onInitialize?: (val: boolean) => void;
    shouldStartQuiz?: (start: any) => void;
    onRetakeSuccess?: () => void;
  } = {}
) => {
  const { toast } = useToast();
  const isInit = useRef(false);
  const { onInitialize, shouldStartQuiz, onRetakeSuccess } = options;

  const { form, taskId, start, data, setData } = useTaskContext();

  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [sure, setSure] = useState(false);
  const [resolver, setResolver] = useState(null);
  const [status, setStatus] = useState(false);

  const retakeExamLogic = useCallback(async () => {
    try {
      const q = await getClientPrivateData({
        queryKey: [`students/quiz/questions/${taskId}`],
      });

      setData(q?.body);
      setSuccess(false);
      setFail(false);
      form.clearErrors();
      form.reset();

      onRetakeSuccess?.();
    } catch (e) {
      console.log("retake error:", e);
      toast({
        description: e.response?.data?.error?.message || "An error occurred",
        icon: "error",
      });
    }
  }, []);

  // handle when success model is opened telling exam is still being graded then get graded
  useEffect(() => {
    if (!success) return;
    if (start?.score_ratio && !start.result) {
      console.log("cloooooose success modal");
      setSuccess(false);
      setFail(true);
    }
  }, [success, start?.score_ratio, start?.result]);

  // hide success and fail model if an instructor checked an exam to be retaken while a model is open
  useEffect(() => {
    if ((success || fail) && !start?.score_ratio && !start?.review_pending) {
      console.log("retake from dashboard");

      retakeExamLogic();
    }
  }, [success, fail, start]);

  // ============= INITIALIZATION =============
  useEffect(() => {
    if (isInit.current) return;
    const initializeQuiz = async () => {
      const shouldStart = shouldStartQuiz
        ? shouldStartQuiz(start)
        : start.score === null && !start.review_pending;

      if (shouldStart) {
        setStatus(false);

        if (onInitialize) {
          onInitialize(true);
        }

        try {
          const q = await getClientPrivateData({
            queryKey: [`students/quiz/questions/${taskId}`],
          });
          setData(q?.body);
        } catch (e) {
          console.log("get questions error:", e);
        }
      } else {
        if (onInitialize) {
          onInitialize(false);
        }

        if ((start.result && !fail) || start?.review_pending) {
          console.log("✨ showing success");
          setSuccess(true);
        } else {
          console.log("💥 showing fail");
          setFail(true);
        }
      }

      isInit.current = true;
    };

    initializeQuiz();
  }, [start.score, start.review_pending]);

  // ============= SHOW ANSWERS =============
  const showAnswers = async () => {
    try {
      const data = await getClientPrivateData({
        queryKey: [`students/quiz/show/answers/${taskId}`],
      });

      if (data?.code === 200) {
        setSuccess(false);
        setFail(false);
        setStatus(true);
        form.clearErrors();
        form.reset();
        setData({ ...data?.body, solution: true });
      }
    } catch (e) {
      console.log("showAnswers error:", e);
    }
  };

  // ============= RETAKE QUIZ =============
  const retake = async () => {
    try {
      await axios.post(`/api?url=students/quiz/retake/${taskId}`, {});

      await retakeExamLogic();
    } catch (e) {
      console.log("retake error:", e);
      toast({
        description: e.response?.data?.error?.message || "An error occurred",
        icon: "error",
      });
    }
  };

  // ============= HANDLE SURE MODAL =============
  const handleClose = (confirmed) => {
    setSure(false);
    if (resolver) resolver(confirmed);
  };

  return {
    form,
    success,
    setSuccess,
    fail,
    setFail,
    sure,
    setSure,
    resolver,
    setResolver,
    data,
    status,
    showAnswers,
    retake,
    handleClose,
  };
};
