"use client";

import { cn } from "@/lib/utils";
import { getDataClient } from "@/utils/clientFun";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserMessage from "../../modules/community/components/UserMessage";
import LoadingSpinner from "../Loading";
import { Dialog, DialogContent } from "../ui/dialog";
import { SimplePagination } from "../ui/SimplePagination";

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

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      `/comments/lesson/${comment.lesson_id}?page=${lessonPage}`,
      "lesson-comments",
    ],
    queryFn: getDataClient,
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
  }, [searchParams, isLoading]);

  console.log("comment details ", data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideClose={true}
        className="md:left-0! left-0! inset-y-0! translate-x-0! translate-y-0!  flex flex-col sm:gap-8 gap-4 text-right fixed   h-full! max-w-[800px]! min-h-screen overflow-y-auto sm:p-4 p-2"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />

        <div
          className="
        flex 
        border-b-2 
        p-2 
        h-[80px] 
        w-full 
        border-primary-700    
        justify-between"
        >
          <h2 className="text-[#121212] font-bold sm:text-lg text-sm">
            عرض الأسئلة والاستفسارات{" "}
          </h2>
          <div
            onClick={() => setOpen(false)}
            className=" 
              text-gray-500 
              absolute 
              cursor-pointer 
              text-[18px] 
              font-bold  
              left-[40px]!"
          >
            ✕
          </div>
        </div>

        {showDetailsCard && (
          <div
            // href={`/bundles/${comment?.classroom_id}/${comment?.lesson_id}`}
            className="border flex flex-col gap-2 p-3  h-20 bg-background rounded-lg border-[#F8DEC5] relative"
          >
            <div className="flex items-center gap-2 justify-between">
              <h2 className="text-[#121212] font-bold sm:text-lg text-sm">
                كورس : {comment?.classroom_title}
              </h2>
            </div>

            <h3 className="text-[#121212] font-bold sm:text-base text-xs">
              حصة : {comment?.lesson_title}
            </h3>

            {/* hide button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDetailsCard(false);
              }}
              className=" 
              text-gray-500 
              absolute 
              cursor-pointer 
              text-[18px] 
              font-bold  
              left-2 top-1 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <div
          className={cn(
            "overflow-y-auto min-h-[150px]! grow flex flex-col gap-2",
            {
              "animate-pulse opacity-80": isPlaceholderData,
            }
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
