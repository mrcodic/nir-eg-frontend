"use client";

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
      c === comment.lesson_id ? null : comment.lesson_id
    );
  };

  return (
    <div className="bg-background  p-3 rounded-lg flex flex-col">
      <div className="flex border-b-2 p-2 border-[#F8DEC5] justify-between">
        <div className="flex items-center gap-2">
          <Image src="/assets/time.svg" width={20} height={20} alt="time" />
          <span className="text-[#121212] inline-block text-xs sm:text-[16px] font-medium">
            {" "}
            {convertDate(comment?.created_at)}{" "}
          </span>
        </div>
        {/* <h2 className="text-primary-800 inline-block text-xs sm:text-[16px] font-bold">
          {secondsToHms(comment?.at_second)}
        </h2> */}
      </div>

      <div className="sm:py-5 mb-4 sm:mb-5 py-3 flex border-b-2 border-[#F8DEC5] flex-col gap-2">
        <h2 className="text-[#121212] inline-block text-sm sm:text-lg font-bold">
          كورس : {comment.classroom_title}
        </h2>
        <span className="text-[#121212] inline-block text-xs sm:text-base font-bold">
          حصة : {comment.lesson_title}
        </span>
      </div>

      <div className=" mt-auto flex  flex-col gap-2">
        <p className="text-[#121212] text-sm line-clamp-1">{comment.body}</p>
        <button
          onClick={handleShowMore}
          className={`
                sm:w-[121px] 
                w-[100px]
                h-[32px] 
                self-end
                justify-self-end
                outline
                 outline-[0.5px]
                ring-primary-700
                rounded-[10px] 
                sm:mt-[10px]
                mt-1
                outline-offset-2  
                outline-primary-700 
                bg-primary
                text-[#FFFFFF] sm:text-base text-sm`}
        >
          عرض المزيد
        </button>
      </div>
    </div>
  );
};
export default Comment;
