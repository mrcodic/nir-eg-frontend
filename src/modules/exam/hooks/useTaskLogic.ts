import { useTaskContext } from "@/context/TaskProvider";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { getTaskQuestions } from "@/services/task.service";
import { TaskShowAnswersResponse } from "@/types/quiz.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTaskLogic = (
  options: {
    onInitialize?: (val: boolean) => void;
    shouldStartQuiz?: (start: any) => {
      start: boolean;
      type: "fresh" | "mid-session" | "no";
    };
    onRetakeSuccess?: () => void;
    /** Called when the exam is about to start for the first time — pause until confirmed */
  } = {},
) => {
  const { toast } = useToast();
  const isInit = useRef(false);

  const { onInitialize, shouldStartQuiz, onRetakeSuccess } = options;

  // ✅ only stable values from context
  const { taskId, start, data, setData, reset, isLoading, isFetching } =
    useTaskContext();

  // ===== local UI state =====
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [sure, setSure] = useState(false);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);
  const [isShowingAnswers, setIsShowingAnswers] = useState(false);
  const [isLoadingRetake, setIsLoadingRetake] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  // ================= RETAKE LOGIC =================
  const retakeExamLogic = useCallback(async () => {
    try {
      const q = await getTaskQuestions(taskId);

      setData(q?.body);
      setSuccess(false);
      setFail(false);

      // ✅ form reset without subscribing
      reset({
        quiz_id: taskId,
        questions: {},
      });
      // trigger();

      onRetakeSuccess?.();
    } catch (e: any) {
      console.log("retake error:", e);
      toast({
        description:
          e.response?.data?.error?.message ||
          e.response?.data?.message ||
          "حدث خطأ, حاول مرة اخرى",
        icon: "error",
      });
    }
  }, [taskId, setData, reset, onRetakeSuccess, toast]);

  // ================= CONFIRM START =================
  const proceedWithStart = useCallback(async () => {
    setAwaitingConfirm(false);
    setIsShowingAnswers(false);
    onInitialize?.(true);

    try {
      const q = await getTaskQuestions(taskId);
      setData(q?.body);
    } catch (e) {
      console.log("get questions error:", e);
    }
  }, [taskId, setData, onInitialize]);

  const cancelStart = useCallback(() => {
    setAwaitingConfirm(false);
    isInit.current = false; // allow re-init if user comes back
  }, []);

  // ================= SHOW ANSWERS =================
  const showAnswers = useCallback(async () => {
    try {
      const res = await getClientPrivateData<TaskShowAnswersResponse>({
        queryKey: [`students/quiz/show/answers/${taskId}`],
      });

      if (res?.code === 200) {
        setSuccess(false);
        setFail(false);
        setIsShowingAnswers(true);

        reset({
          quiz_id: taskId,
          questions: {},
        });
        // trigger();

        setData({ ...res?.body, solution: true });
      }
    } catch (e) {
      console.log("showAnswers error:", e);
    }
  }, [taskId, setData, reset]);

  // ================= RETAKE =================
  const retake = useCallback(async () => {
    try {
      setIsLoadingRetake(true);
      await mutateClient(`students/quiz/retake/${taskId}`);
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

  // ================= HANDLE SUCCESS / FAIL =================
  useEffect(() => {
    if (!success) return;
    if (start?.score_ratio && !start?.result) {
      setSuccess(false);
      setFail(true);
    }
  }, [success, start?.score_ratio, start?.result]);

  // ================= INITIALIZATION =================
  useEffect(() => {
    if (isInit.current) return;
    if (!start || isLoading || isFetching) return;

    const initializeQuiz = async () => {
      isInit.current = true;

      const shouldStart = shouldStartQuiz?.(start);

      // 1) should start solving the task
      if (shouldStart?.start) {
        if (shouldStart?.type === "fresh") {
          // Pause — wait for the user to confirm before fetching questions
          setAwaitingConfirm(true);
          return;
        }

        setIsShowingAnswers(false);
        onInitialize?.(true);

        try {
          const q = await getTaskQuestions(taskId);
          setData(q?.body);
        } catch (e) {
          console.log("get questions error:", e);
        }
      }
      // 2) already solved with no retake option and show answers allowed (show answers right away)
      else if (
        (start?.score || start?.score_ratio) &&
        !start?.review_pending &&
        start?.show_answer &&
        !start?.retake
      ) {
        await showAnswers();
      } else {
        onInitialize?.(false);

        // success or review pending
        if ((start?.result && !fail) || start?.review_pending) {
          setSuccess(true);
          setFail(false);
          // fail
        } else if (!start?.result && start?.score_ratio) {
          setFail(true);
          setSuccess(false);
        }

        if (!start?.score_ratio && !start?.score && !start?.review_pending) {
          retakeExamLogic();
        }
      }
    };

    initializeQuiz();
  }, [
    taskId,
    start,
    shouldStartQuiz,
    onInitialize,
    fail,
    setData,
    showAnswers,
    retakeExamLogic,
    isLoading,
    isFetching,
  ]);

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
    isShowingAnswers,
    showAnswers,
    retake,
    handleClose,
    isLoadingRetake,
    awaitingConfirm,
    proceedWithStart,
    cancelStart,
  };
};
