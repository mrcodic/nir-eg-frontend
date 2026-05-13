"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import CommentDetails from "@/components/modals/CommentDetails";
import PaginationComponent from "@/components/Pagination";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import Comment from "@/modules/community/components/Comment";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CommentsFilter from "./CommentsFilter";
import { useAuthContext } from "@/context/auth-context";
import { useTenant } from "@/context/TenantProvider";

interface LessonComment {
  at_minute: string;
  at_second: number;
  body: string;
  created_at: string;
  documents: any[];
  id: number;
  images: any[];
  lesson_id: number;
  recordings: any[];
  replies: any[];
  user: {
    id: number;
    name: string;
  };
}

const Comments = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [courseId, setCourseId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [lessonId, setLessonId] = useState("");

  const [lessonPage, setLessonPage] = useState(null);
  const [selectedCommentLesson, setSelectedCommentLesson] = useState(null);

  const { profile } = useAuthContext();
  const { features } = useTenant();

  const {
    data: comments,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      `/all-comments?
        page=${page}&
        classroom_id=${courseId}&
        room_id=${roomId}&
        lesson_id=${lessonId}`,
      "all-comments",
    ],
    queryFn: getClientPrivateData as () => Promise<{
      data: LessonComment[];
      meta: { total: number };
      links: { first: string; last: string; next: string; prev: string };
      avatar: string;
    }>,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const isNotification = searchParams.get("is_notification");

    if (isNotification === "true") {
      console.log("📧💕 from notifications ");

      const searchLessonId = searchParams.get("lesson_id");
      const page = searchParams.get("page");
      const lessonPage = searchParams.get("lesson_page");
      const searchReplyId = searchParams.get("reply_id");

      setPage(Number(page));
      setLessonPage(Number(lessonPage));
      setSelectedCommentLesson(Number(searchLessonId));

      setLessonId("");
      setRoomId("");
      setCourseId("");

      // clear search params
      router.replace(`/profile/comments?reply_id=${searchReplyId}`);
    }
  }, [router, searchParams]);

  const selectedComment = useMemo(
    () =>
      comments?.data?.find(
        (comment) => comment.lesson_id === selectedCommentLesson,
      ),
    [comments?.data, selectedCommentLesson],
  );

  const isCenterStudent = profile?.type === 3;
  const hasCommunityEnabled = features?.community_system;

  if (isCenterStudent || !hasCommunityEnabled) {
    redirect("/profile");
  }
  // console.log("commentsss : ", comments?.data);
  // console.log("selectedComment : ", selectedComment);

  return (
    <div className="wrapper mt-[140px] mb-12">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg font-bold text-black">الاسئلة والاستفسارات</h3>

        <CommentsFilter
          setPage={setPage}
          setCourseId={setCourseId}
          setRoomId={setRoomId}
          setLessonId={setLessonId}
          courseId={courseId}
          roomId={roomId}
          lessonId={lessonId}
        />
      </div>

      {isLoading && (
        <div className="flex min-h-80 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      <div
        className={cn(
          "mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2",
          isPlaceholderData && "animate-pulse opacity-70",
        )}
      >
        {comments?.data?.length > 0 &&
          comments?.data?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              setSelectedCommentLesson={setSelectedCommentLesson}
            />
          ))}
      </div>

      {!comments?.data?.length && !isLoading && (
        <div className="flex w-full items-center justify-center">
          <Empty text={"لا يوجد استفسارات"} />
        </div>
      )}

      {!!comments?.data?.length && !isLoading && (
        <PaginationComponent
          setPage={setPage}
          currentPage={page}
          total={comments?.meta?.total}
        />
      )}

      {selectedCommentLesson && selectedComment && (
        <CommentDetails
          avatar={comments?.avatar}
          comment={selectedComment}
          setOpen={() => setSelectedCommentLesson(null)}
          searchLessonPage={lessonPage}
          open={selectedCommentLesson === selectedComment.lesson_id}
        />
      )}
    </div>
  );
};

export default Comments;
