import Dexie, { type Table } from "dexie";

interface AnswerDraft {
  draftKey: string;
  questionId: string;
  answer: any;
  expiresAt: number;
}

interface AttachmentDraft {
  draftKey: string;
  questionId: string;
  file: File;
  expiresAt: number;
}

class TaskDraftDB extends Dexie {
  answers!: Table<AnswerDraft, [string, string]>;
  attachments!: Table<AttachmentDraft, [string, string]>;

  constructor() {
    super("task-drafts");
    this.version(1).stores({
      answers: "[draftKey+questionId], expiresAt",
      attachments: "[draftKey+questionId], expiresAt",
    });
  }
}

export const db = new TaskDraftDB();

export function buildDraftKey(
  examType: string,
  taskId: string | number,
  userId: string | number,
) {
  return `${examType}-${taskId}-${userId}`;
}

export async function saveAnswer(
  draftKey: string,
  questionId: string,
  answer: any,
  expiresAt: number,
) {
  await db.answers.put({ draftKey, questionId, answer, expiresAt });
}

export async function saveAttachment(
  draftKey: string,
  questionId: string,
  file: File,
  expiresAt: number,
) {
  await db.attachments.put({ draftKey, questionId, file, expiresAt });
}

export async function loadAnswers(draftKey: string) {
  const rows = await db.answers.where("draftKey").equals(draftKey).toArray();
  return Object.fromEntries(rows.map((r) => [r.questionId, r.answer]));
}

export async function loadAttachments(draftKey: string) {
  const rows = await db.attachments
    .where("draftKey")
    .equals(draftKey)
    .toArray();
  return Object.fromEntries(rows.map((r) => [r.questionId, r.file]));
}

export async function clearDraftByKey(draftKey: string) {
  await Promise.all([
    db.answers.where("draftKey").equals(draftKey).delete(),
    db.attachments.where("draftKey").equals(draftKey).delete(),
  ]);
}

export async function purgeExpiredDrafts() {
  const now = Date.now();
  await Promise.all([
    db.answers.where("expiresAt").below(now).delete(),
    db.attachments.where("expiresAt").below(now).delete(),
  ]);
}
