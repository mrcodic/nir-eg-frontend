import { useTaskContext } from "@/context/TaskProvider";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useTaskLogic = (options: {
  onInitialize?: (val: boolean) => void;
  shouldStartQuiz?: (start: any) => void;
}) => {
  const { toast } = useToast();
  const isInit = useRef(false);
  const { onInitialize, shouldStartQuiz } = options || {};

  const { form, taskId, start, data, setData } = useTaskContext();

  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [sure, setSure] = useState(false);
  const [resolver, setResolver] = useState(null);
  const [status, setStatus] = useState(false);

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
          setSuccess(true);
        } else {
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
  const retake = async (onRetakeSuccess?: () => void) => {
    try {
      await axios.post(`/api?url=students/quiz/retake/${taskId}`, {});

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
