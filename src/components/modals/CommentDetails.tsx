"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserMessage from "../../modules/community/components/UserMessage";
import LoadingSpinner from "../LoadingSpinner";
import { Dialog, DialogContent } from "../ui/dialog";
import { SimplePagination } from "../ui/SimplePagination";
import { Comment, IPagination } from "@/types";

interface CommentDetailsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  comment: any;
  avatar: string;
  searchLessonPage: number;
}

const CommentDetails = ({
  open,
  setOpen,
  comment,
  avatar,
  searchLessonPage,
}: CommentDetailsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showDetailsCard, setShowDetailsCard] = useState(true);
  const [lessonPage, setLessonPage] = useState(searchLessonPage || 1);

  const { data, isLoading, isPlaceholderData } = useQuery<
    IPagination<Comment[]>
  >({
    queryKey: [
      `/comments/lesson/${comment.lesson_id}?page=${lessonPage}`,
      "lesson-comments",
    ],
    queryFn: getClientPrivateData,
    enabled: !!comment.lesson_id,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const searchReplyId = searchParams.get("reply_id");
    if (isLoading || !searchReplyId) return;

    const replyElement = document.getElementById(`reply-${searchReplyId}`);
    if (!replyElement) return;

    replyElement.scrollIntoView({ behavior: "smooth" });
    router.replace(`/profile/comments`);
  }, [searchParams, isLoading, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideClose={true}
        className="fixed inset-y-0! left-0! flex h-full! min-h-screen max-w-[800px]! translate-x-0! translate-y-0! flex-col gap-4 overflow-y-auto p-2 text-right sm:gap-8 sm:p-4 md:left-0!"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />

        <div className="border-gray-light flex h-[80px] w-full justify-between border-b-2 p-2">
          <h2 className="text-sm font-bold text-[#121212] sm:text-lg">
            عرض الأسئلة والاستفسارات{" "}
          </h2>
          <div
            onClick={() => setOpen(false)}
            className="absolute left-[40px]! cursor-pointer text-[18px] font-bold text-gray-500"
          >
            ✕
          </div>
        </div>

        {showDetailsCard && (
          <div
            // href={`/bundles/${comment?.classroom_id}/${comment?.lesson_id}`}
            className="bg-background relative flex h-20 flex-col gap-2 rounded-lg border border-[#F8DEC5] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#121212] sm:text-lg">
                كورس : {comment?.classroom_title}
              </h2>
            </div>

            <h3 className="text-xs font-bold text-[#121212] sm:text-base">
              حصة : {comment?.lesson_title}
            </h3>

            {/* hide button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDetailsCard(false);
              }}
              className="absolute top-1 left-2 cursor-pointer text-sm text-[18px] font-bold text-gray-500"
            >
              ✕
            </button>
          </div>
        )}

        <div
          className={cn(
            "flex min-h-[150px]! grow flex-col gap-2 overflow-y-auto",
            {
              "animate-pulse opacity-80": isPlaceholderData,
            },
          )}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : data?.data?.length > 0 ? (
            data?.data?.map((comment) => (
              <UserMessage
                key={comment.id}
                avatar={avatar}
                comment={comment}
                currentTime={comment.at_second}
                lessonId={comment.lesson_id}
              />
            ))
          ) : (
            <p>لا يوجد تعليقات</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {data?.data?.length && !isLoading && (
            <SimplePagination
              currentPage={lessonPage}
              lastPage={data?.meta?.last_page}
              onPageChange={setLessonPage}
              className="mt-0 pt-2"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDetails;
