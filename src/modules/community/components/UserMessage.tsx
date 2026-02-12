"use client";

import { Button } from "@/components/ui/button";
import { convertDate, secondsToHms } from "@/utils/clientFun";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MessageInput from "./MessageInput";
import CustomImage from "@/components/ui/CustomImage";
import { cn } from "@/lib/utils";

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
  const [showReply, setShowReply] = useState(false);
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
            width={48}
            height={48}
            src={avatar || "/assets/avatar-user.svg"}
            fallback="/assets/avatar-user.svg"
            alt="avatar"
            className="size-10 shrink-0 sm:size-12"
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
                <span className="text-gray-dark inline-block text-[12px] font-medium">
                  {secondsToHms(comment.at_second)}
                </span>
              )}

              <span className="text-gray-dark ms-auto inline-block text-[12px] font-medium">
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
          <div className="mr-12 flex flex-col gap-2">
            {comment?.images?.map((image, index) => {
              return (
                <Link target="_blank" key={index} href={image.url}>
                  <Image
                    unoptimized
                    src={image.url}
                    width={100}
                    height={100}
                    alt="image"
                  />
                </Link>
              );
            })}
          </div>
        )}

        {comment?.documents?.length > 0 && (
          <div className="mr-12 flex flex-col gap-2">
            {comment?.documents?.map((document, index) => {
              return (
                <Link
                  key={index}
                  target="_blank"
                  className="flex w-full items-center gap-2 rounded-lg border border-[#F8DEC5] bg-[#FFFFFF] p-2 py-2 text-[12px] font-medium"
                  href={document?.url}
                >
                  <Image
                    src="/assets/pdf-icon.svg"
                    width={32}
                    height={32}
                    alt="document"
                  />
                  <p>{document?.name}</p>
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

        {comment?.replies?.length > 0 && (
          <div className="mr-8 flex flex-col gap-2 border-r border-[#cccc] pr-4">
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

        {!showReply && !isReply && (
          <div className="flex items-center justify-end ps-2 sm:ps-[33px]">
            <Button
              onClick={() => setShowReply(true)}
              variant="outline"
              className="h-8 rounded-xl text-xs font-medium sm:text-sm"
            >
              إضافة رد
            </Button>
          </div>
        )}

        {showReply && !isReply && (
          <div className="border-gray-light relative mt-4 flex items-start gap-4 rounded-lg border p-2 max-sm:flex-wrap">
            <div className="bg-primary-800 absolute top-0 right-0 flex size-5 items-center justify-center rounded-full">
              <button
                onClick={() => setShowReply(false)}
                className="top-0 right-0"
              >
                <X className="size-4 text-white" />
              </button>
            </div>

            <Image
              unoptimized
              src={avatar || "/assets/avatar-user.svg"}
              className="size-11 rounded-lg"
              width={44}
              height={44}
              alt="avatar"
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
            />
            <MessageInput
              lessonId={lessonId}
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
