import { useTaskContext } from "@/context/TaskProvider";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTaskLogic = (
  options: {
    onInitialize?: (val: boolean) => void;
    shouldStartQuiz?: (start: any) => boolean;
    onRetakeSuccess?: () => void;
  } = {},
) => {
  const { toast } = useToast();
  const isInit = useRef(false);

  const { onInitialize, shouldStartQuiz, onRetakeSuccess } = options;

  // ✅ only stable values from context
  const { taskId, start, data, setData, setValue, trigger } = useTaskContext();

  // ===== local UI state =====
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [sure, setSure] = useState(false);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);
  const [status, setStatus] = useState(false);
  const [isLoadingRetake, setIsLoadingRetake] = useState(false);

  // ================= RETAKE LOGIC =================
  const retakeExamLogic = useCallback(async () => {
    try {
      const q = await getClientPrivateData({
        queryKey: [`students/quiz/questions/${taskId}`],
      });

      setData(q?.body);
      setSuccess(false);
      setFail(false);

      // ✅ form reset without subscribing
      setValue("questions", {});
      trigger();

      onRetakeSuccess?.();
    } catch (e: any) {
      console.log("retake error:", e);
      toast({
        description: e.response?.data?.error?.message || "An error occurred",
        icon: "error",
      });
    }
  }, [taskId, setData, setValue, trigger, onRetakeSuccess, toast]);

  // ================= HANDLE SUCCESS / FAIL =================
  useEffect(() => {
    if (!success) return;
    if (start?.score_ratio && !start?.result) {
      setSuccess(false);
      setFail(true);
    }
  }, [success, start?.score_ratio, start?.result]);

  useEffect(() => {
    if ((success || fail) && !start?.score_ratio && !start?.review_pending) {
      retakeExamLogic();
    }
  }, [
    success,
    fail,
    start?.score_ratio,
    start?.review_pending,
    retakeExamLogic,
  ]);

  // ================= INITIALIZATION =================
  useEffect(() => {
    if (isInit.current) return;

    const initializeQuiz = async () => {
      const shouldStart = shouldStartQuiz
        ? shouldStartQuiz(start)
        : start?.score === null && !start?.review_pending;

      if (shouldStart) {
        setStatus(false);
        onInitialize?.(true);

        try {
          const q = await getClientPrivateData({
            queryKey: [`students/quiz/questions/${taskId}`],
          });
          setData(q?.body);
        } catch (e) {
          console.log("get questions error:", e);
        }
      } else {
        onInitialize?.(false);

        if ((start?.result && !fail) || start?.review_pending) {
          setSuccess(true);
        } else {
          setFail(true);
        }
      }

      isInit.current = true;
    };

    initializeQuiz();
  }, [
    taskId,
    start?.score,
    start?.review_pending,
    start?.result,
    shouldStartQuiz,
    onInitialize,
    fail,
    setData,
    start,
  ]);

  // ================= SHOW ANSWERS =================
  const showAnswers = useCallback(async () => {
    try {
      const res = await getClientPrivateData({
        queryKey: [`students/quiz/show/answers/${taskId}`],
      });

      if (res?.code === 200) {
        setSuccess(false);
        setFail(false);
        setStatus(true);

        setValue("questions", {});
        trigger();

        setData({ ...res?.body, solution: true });
      }
    } catch (e) {
      console.log("showAnswers error:", e);
    }
  }, [taskId, setData, setValue, trigger]);

  // ================= RETAKE =================
  const retake = useCallback(async () => {
    try {
      setIsLoadingRetake(true);
      await axios.post(`/api?url=students/quiz/retake/${taskId}`, {});
      await retakeExamLogic();
    } catch (e: any) {
      console.log("retake error:", e);
      toast({
        description:
          e.response?.data?.error?.message || "حدث خطأ, حاول مرة اخرى",
        icon: "error",
      });
    } finally {
      setIsLoadingRetake(false);
    }
  }, [taskId, retakeExamLogic, toast]);

  // ================= SURE MODAL =================
  const handleClose = useCallback(
    (confirmed: boolean) => {
      setSure(false);
      resolver?.(confirmed);
      setResolver(null);
    },
    [resolver],
  );

  return {
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
    isLoadingRetake,
  };
};
