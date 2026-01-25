import { INotification } from "@/types";

export const mapNotifQuizKind = {
  1: "كويز",
  2: "اختبار",
  3: "واجب",
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return "الآن";
  if (diffInMins < 60) return `منذ ${diffInMins} دقيقة`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;

  return date.toLocaleDateString();
};

export const getHref = (notification: INotification) => {
  if (notification.type === "comment_replied") {
    return `/profile/comments?comment_id=${notification.payload?.comment_id}&lesson_id=${notification.payload?.lesson_id}&reply_id=${notification.payload?.reply_id}&page=${notification.payload?.page_per_comments}&lesson_page=${notification.payload?.page_lesson}&is_notification=true`;
   
  }
  if (notification.type === "quiz_graded") {
    return `/bundles/${notification.classroom_id}${
      notification.quiz_kind === 2 ? `/general-exams/${notification.quiz_id}` :

      `/${notification.room_id}/${
      notification.quiz_kind === 3 ? "assignment" : "exams"
    }/${notification.quiz_id}`}`;
  }
  return "";
};

export const getTitle = (notification: INotification) => {
  if (notification.type === "comment_replied") {
    return `📧 ${notification.payload?.phone_msg}`;
    // return `📧 قام "${
    //   notification.payload?.replier_name || "المدرس"
    // }" بالرد على تعليقك`;
  }
  if (notification.type === "quiz_graded") {
    return `📚 تم تقييم ${mapNotifQuizKind[notification.quiz_kind]} "${
      notification.quiz_title
    }"`;
  }
  return notification.message;
};
