"use client";

import { Button } from "@/components/ui/button";
import { convertDate } from "@/utils/clientFun";
import Image from "next/image";

type CommentProps = {
  comment: any;
  setSelectedCommentLesson: (value: number | any) => void;
  // avatar: string;
  // setPage: (value: number) => void;
  // setLessonId: (value: string) => void;
  // setRoomId: (value: string) => void;
  // setCourseId: (value: string) => void;
};

const Comment = ({ comment, setSelectedCommentLesson }: CommentProps) => {
  const handleShowMore = () => {
    setSelectedCommentLesson((c) =>
      c === comment.lesson_id ? null : comment.lesson_id,
    );
  };

  return (
    <div className="bg-background flex flex-col rounded-lg p-3">
      <div className="border-primary/40 flex justify-between border-b-2 p-2">
        <div className="flex items-center gap-2">
          <Image src="/assets/time.svg" width={20} height={20} alt="time" />
          <span className="inline-block text-xs font-medium text-black sm:text-base">
            {" "}
            {convertDate(comment?.created_at)}{" "}
          </span>
        </div>
        {/* <h2 className="text-primary-800 inline-block text-xs sm:text-base font-bold">
          {secondsToHms(comment?.at_second)}
        </h2> */}
      </div>

      <div className="border-primary/40 mb-4 flex flex-col gap-2 border-b-2 py-3 sm:mb-5 sm:py-5">
        <h2 className="inline-block text-sm font-bold text-black sm:text-lg">
          كورس : {comment.classroom_title}
        </h2>
        <span className="inline-block text-xs font-bold text-black sm:text-base">
          حصة : {comment.lesson_title}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p className="line-clamp-1 text-sm text-black">{comment.body}</p>
        <Button
          onClick={handleShowMore}
          className={`ring-primary-800 ms-auto h-8 w-fit rounded-2xl ring-2 ring-offset-1`}
        >
          عرض المزيد
        </Button>
      </div>
    </div>
  );
};
export default Comment;
