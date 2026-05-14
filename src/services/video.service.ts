import { mutateClient } from "@/helpers/post-client";
import { QueryClient } from "@tanstack/react-query";

// ── View logging ─────────────────────────────────────────────────────────────

export async function logView(
  videoId: string,
  roomId: string | number,
  classroomId: string | number,
): Promise<void> {
  try {
    await mutateClient("/video/confirm-view", {
      body: { video_id: videoId, room_id: roomId, classroom_id: classroomId },
    });
  } catch {
    // swallow – never surface view-log failures to the user
  }
}

// ── Lesson completion ─────────────────────────────────────────────────────────

interface MarkLessonCompleteParams {
  queryClient: QueryClient;
  roomId: string | number;
  lessonId: string | number;
  classroomId: string | number;
}

/**
 * Marks a lesson as completed on the server and invalidates the lessons cache.
 * Shared between VdoCipher and Bunny player hooks.
 * Throws on failure — callers should catch and swallow to preserve UX.
 */
export async function markLessonComplete({
  queryClient,
  roomId,
  lessonId,
  classroomId,
}: MarkLessonCompleteParams): Promise<void> {
  await mutateClient("/students/lesson/store_completed", {
    body: {
      room_id: roomId,
      lesson_id: lessonId,
      classroom_id: classroomId,
    },
  });

  queryClient.invalidateQueries({
    queryKey: [`/students/get-lessons/${roomId}?classroom_id=${classroomId}`],
  });
}

// ── Watch threshold ───────────────────────────────────────────────────────────

/** 15 minutes in seconds — shared threshold used by both player hooks */
export const WATCH_THRESHOLD_SECS = 900;
