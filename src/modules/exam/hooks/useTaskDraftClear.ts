import { buildDraftKey, clearDraftByKey } from "@/lib/task-draft-db";
import { useCallback } from "react";

interface Options {
  examType: string;
  taskId: string | number;
  userId: string | number;
}

export function useTaskDraftClear({ examType, taskId, userId }: Options) {
  const draftKey = buildDraftKey(examType, taskId, userId);

  // No argument needed anymore — the key is fully determined at hook init
  const clearDraft = useCallback(async () => {
    await clearDraftByKey(draftKey);
  }, [draftKey]);

  return { clearDraft, draftKey };
}
