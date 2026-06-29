import {
  buildDraftKey,
  clearDraftByKey,
  loadAnswers,
  loadAttachments,
  saveAnswer,
  saveAttachment,
} from "@/lib/task-draft-db";
import { QuizStatus } from "@/types";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

interface UseTaskDraftOptions {
  examType: string;
  taskId: string | number;
  userId: string | number;
  start: QuizStatus | undefined;
  questions: Array<{ id: number; type: number }>;
  onRestored?: () => void;
}

function computeExpiresAt(start: QuizStatus | undefined): number {
  // timer is in minutes
  const ms = start?.timer
    ? Number(start.timer) * 60 * 1000
    : 8 * 60 * 60 * 1000;
  return Date.now() + ms;
}

export function useTaskDraft({
  examType,
  taskId,
  userId,
  start,
  questions,
  onRestored,
}: UseTaskDraftOptions) {
  const { watch, setValue, getValues } = useFormContext();
  const isRestored = useRef(false);
  const expiresAtRef = useRef<number>(0);

  const draftKey = buildDraftKey(examType, taskId, userId);

  // ─── RESTORE on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!questions.length || isRestored.current) return;

    const restore = async () => {
      expiresAtRef.current = computeExpiresAt(start);

      const [answers, attachments] = await Promise.all([
        loadAnswers(draftKey),
        loadAttachments(draftKey),
      ]);

      for (const [qId, answer] of Object.entries(answers)) {
        setValue(`questions.${qId}`, answer, { shouldDirty: false });
      }

      for (const [qId, file] of Object.entries(attachments)) {
        const existing = getValues(`questions.${qId}`) ?? {};
        setValue(
          `questions.${qId}`,
          { ...existing, attachment: file },
          { shouldDirty: false },
        );
      }

      isRestored.current = true;
      onRestored?.();
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, questions.length]);

  // ─── PERSIST on change ─────────────────────────────────────────────────
  useEffect(() => {
    const persist = debounce((values) => {
      if (!isRestored.current) return;

      const questionsMap = values.questions ?? {};
      const expiresAt = expiresAtRef.current || computeExpiresAt(start);

      for (const [qId, answer] of Object.entries(questionsMap)) {
        if (answer === undefined || answer === null) continue;

        if (typeof answer === "object" && !Array.isArray(answer)) {
          const { attachment, ...textPart } = answer as {
            attachment?: File;
            text?: string;
          };

          saveAnswer(draftKey, qId, textPart, expiresAt);

          if (attachment instanceof File) {
            saveAttachment(draftKey, qId, attachment, expiresAt);
          }
        } else {
          saveAnswer(draftKey, qId, answer, expiresAt);
        }
      }
    }, 500);

    const sub = watch(persist);

    return () => {
      persist.cancel(); // ← flush/cancel any pending debounced call on cleanup
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, watch]);

  const clearDraft = useCallback(async () => {
    await clearDraftByKey(draftKey);
    isRestored.current = false;
  }, [draftKey]);

  return { clearDraft, draftKey };
}
