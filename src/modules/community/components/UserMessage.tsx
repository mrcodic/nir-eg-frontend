"use client";

import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/CustomImage";
import { cn } from "@/lib/utils";
import { convertDate, secondsToHms } from "@/utils/clientFun";
import { ChevronDown, ChevronUp, Eye, ImageOff, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MessageInput from "./MessageInput";

type UserMessageProps = {
  comment: any;
  avatar: string;
  lessonId: string | number;
  isReply?: boolean;
  currentTime: number;
  ref?: React.RefObject<HTMLDivElement>;
  isYoutubeVideo?: boolean;
};

const UserMessage = ({
  comment,
  avatar,
  lessonId,
  isReply,
  currentTime,
  ref,
  isYoutubeVideo,
}: UserMessageProps) => {
  // const hasRightBorder = comment?.replies?.length > 0;
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const isAdmin = comment.user.type === "admin";

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-4 rounded-lg ${!isAdmin ? " " : ""} `}
      id={isReply ? `reply-${comment.reply_id}` : `comment-${comment.id}`}
      // gap-4 ${hasRightBorder ? "border-r border-r-primary-700" : ""}`}
    >
      <div
        className={`flex w-full shrink-0 flex-col gap-2 p-2 py-2 ${
          isAdmin
            ? "bg-background border-gray-light rounded-lg border"
            : "rounded-lg border border-[#cccc] bg-white"
        } `}
      >
        <div className="flex w-full shrink-0 gap-2 px-2">
          <CustomImage
            width={44}
            height={44}
            src={avatar || "/assets/avatar-user.svg"}
            fallback="/assets/avatar-user.svg"
            alt="avatar"
            className="size-11 shrink-0 rounded-lg sm:size-12"
          />

          <div
            className={cn("flex w-full flex-col", {
              "flex-row flex-wrap items-center justify-between": isYoutubeVideo,
            })}
          >
            <p className="text-gray-dark inline-block text-sm font-bold">
              {comment.user.name}
            </p>

            <div
              className={cn(
                "flex w-full flex-wrap items-center justify-between gap-x-2",
                {
                  "w-fit": isYoutubeVideo,
                },
              )}
            >
              {!isReply && comment.user.type !== "admin" && !isYoutubeVideo && (
                <span className="text-gray-dark inline-block text-xs font-medium">
                  {secondsToHms(comment.at_second)}
                </span>
              )}

              <span className="text-gray-dark ms-auto inline-block text-xs font-medium">
                {convertDate(comment.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="w-full h-px bg-[#EFEFEF]"></div> */}
        <p className="text-gray-dark mr-16 text-[15px] font-medium wrap-break-word whitespace-pre-line">
          {comment.body}
        </p>

        {comment?.images?.length > 0 && (
          <div className="mr-12 flex flex-wrap gap-2">
            {comment?.images?.map((image, index) => {
              return <CommentImage image={image} key={index} />;
            })}
          </div>
        )}

        {comment?.documents?.length > 0 && (
          <div className="mr-12 flex flex-wrap gap-2">
            {comment?.documents?.map((document, index) => {
              return (
                <Link
                  key={index}
                  target="_blank"
                  className="border-gray-light flex w-full max-w-[300px] items-center gap-2 rounded-lg border bg-white p-2 py-2 text-xs font-medium transition-all hover:bg-gray-50"
                  href={document?.url}
                >
                  <Image
                    src="/assets/pdf.svg"
                    width={32}
                    height={32}
                    alt="document"
                  />
                  <p className="line-clamp-1">{document?.name}</p>
                </Link>
              );
            })}
          </div>
        )}

        {comment?.recordings?.length > 0 && (
          <div className="mr-12 flex max-w-[calc(100%-48px)] flex-col gap-2 overflow-x-auto">
            {comment?.recordings?.map((recording, index) => {
              return <audio key={index} controls src={recording.url}></audio>;
            })}
          </div>
        )}

        <>
          {showReplies && comment?.replies?.length > 0 && (
            <div className="mr-2 flex flex-col gap-2 border-r border-[#cccc] pr-2 md:mr-8 md:pr-4">
              {comment?.replies?.map((reply, index) => (
                <UserMessage
                  avatar={
                    reply.user.type === "user" ? avatar : "/assets/Logo.svg"
                  }
                  isReply={true}
                  key={index}
                  comment={reply}
                  lessonId={lessonId}
                  currentTime={currentTime}
                  isYoutubeVideo={isYoutubeVideo}
                />
              ))}
            </div>
          )}

          {comment?.replies?.length > 0 && (
            <Button
              variant="link"
              className="hover:text-gray-dark ms-auto w-fit gap-1 p-0 text-xs underline"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <>
                  اخفاء الردود
                  <ChevronUp className="size-3" />
                </>
              ) : (
                <>
                  عرض الردود ({comment?.replies?.length}){" "}
                  <ChevronDown className="size-3" />
                </>
              )}
            </Button>
          )}
        </>

        {!showReplyInput && !isReply && (
          <div className="flex items-center justify-end ps-2 sm:ps-[33px]">
            <Button
              onClick={() => setShowReplyInput(true)}
              variant="outline"
              className="h-8 rounded-xl text-xs font-medium sm:text-sm"
            >
              إضافة رد
            </Button>
          </div>
        )}

        {showReplyInput && !isReply && (
          <div className="border-gray-light relative mt-4 flex items-start gap-4 rounded-lg border p-2 max-sm:flex-wrap">
            <div className="bg-primary-800 absolute top-0 right-0 flex size-5 items-center justify-center rounded-full">
              <button
                onClick={() => setShowReplyInput(false)}
                className="top-0 right-0"
              >
                <X className="size-4 text-white" />
              </button>
            </div>

            <MessageInput
              lessonId={lessonId}
              avatar={avatar}
              className="grow"
              commentId={comment.id}
              currentTime={currentTime}
              isReply={true}
              placeholder="اكتب ردك هنا"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;

const CommentImage = ({ image }: { image: any }) => {
  const [isImageError, setImageError] = useState(false);
  return (
    <Link
      target="_blank"
      href={image.url}
      className={cn(
        "border-gray-light relative block aspect-square w-full max-w-[200px] grow overflow-hidden rounded-lg border",
        {
          "pointer-events-none": isImageError,
        },
      )}
    >
      {!isImageError ? (
        <div className="absolute inset-0 z-1 flex h-full w-full items-center justify-center bg-black/50 text-white transition-all hover:opacity-100 md:opacity-0">
          <Eye className="size-8 opacity-80 sm:size-10" />
        </div>
      ) : (
        <div className="absolute inset-0 z-1 flex h-full w-full items-center justify-center bg-gray-200 text-white transition-all">
          <ImageOff className="size-8 text-gray-500 opacity-80 sm:size-10" />
        </div>
      )}

      <Image
        src={image.url}
        fill
        className="w-full object-cover"
        alt="image"
        onError={() => setImageError(true)}
      />
    </Link>
  );
};
