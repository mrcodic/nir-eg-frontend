"use client";

import { Button } from "@/components/ui/button";
import { convertDate, secondsToHms } from "@/utils/clientFun";
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
};

const UserMessage = ({
  comment,
  avatar,
  lessonId,
  isReply,
  currentTime,
  ref,
}: UserMessageProps) => {
  // const hasRightBorder = comment?.replies?.length > 0;
  const [showReply, setShowReply] = useState(false);
  const isAdmin = comment.user.type === "admin";

  return (
    <div
      ref={ref}
      className={`flex flex-col  
        rounded-lg
        items-center 
        gap-4
        ${!isAdmin ? "  " : ""}
        `}
      id={isReply ? `reply-${comment.reply_id}` : `comment-${comment.id}`}
      // gap-4 ${hasRightBorder ? "border-r border-r-primary-700" : ""}`}
    >
      <div
        className={`flex flex-col shrink-0 p-2 py-2  w-full gap-2 ${
          isAdmin
            ? "bg-background  border border-gray-light   rounded-lg"
            : "bg-white border border-[#cccc] rounded-lg"
        }  `}
      >
        <div className="flex w-full px-2  gap-2 shrink-0">
          <Image
            unoptimized
            width={48}
            height={48}
            src={avatar || "/assets/avatar-user.svg"}
            alt="avatar"
            className="shrink-0 sm:size-12 size-10"
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar-user.svg";
            }}
          />

          <div className="flex   flex-col w-full">
            <p className="text-sm text-gray-dark inline-block font-bold">
              {comment.user.name}
            </p>

            <div className="justify-between w-full items-center flex flex-wrap gap-x-2">
              {!isReply && comment.user.type !== "admin" && (
                <span className="text-[12px] text-gray-dark inline-block font-medium">
                  {secondsToHms(comment.at_second)}
                </span>
              )}

              <span className="text-[12px] text-gray-dark inline-block font-medium ms-auto">
                {convertDate(comment.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="w-full h-px bg-[#EFEFEF]"></div> */}
        <p className="text-[15px] mr-16 text-gray-dark font-medium wrap-break-word whitespace-pre-line">
          {comment.body}
        </p>

        {comment?.images?.length > 0 && (
          <div className="flex mr-12  flex-col gap-2">
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
          <div className="flex mr-12  flex-col gap-2">
            {comment?.documents?.map((document, index) => {
              return (
                <Link
                  target="_blank"
                  className="w-full  border border-[#F8DEC5] py-2 
                                bg-[#FFFFFF] 
                                 text-[12px]
                                 font-medium
                                rounded-lg 
                                gap-2
                                p-2
                                flex 
                                items-center 
                                "
                  href={document?.url}
                >
                  <Image
                    src="/assets/image4.svg"
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
          <div className="flex mr-12 flex-col gap-2 max-w-[calc(100%-48px)] overflow-x-auto">
            {comment?.recordings?.map((recording, index) => {
              return <audio key={index} controls src={recording.url}></audio>;
            })}
          </div>
        )}

        {comment?.replies?.length > 0 && (
          <div className="flex flex-col gap-2 pr-4 mr-8  border-r border-[#cccc] ">
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
              />
            ))}
          </div>
        )}

        {!showReply && !isReply && (
          <div className="flex items-center justify-end ps-2 sm:ps-[33px]">
            <Button
              onClick={() => setShowReply(true)}
              className="sm:text-sm text-xs h-8  text-[#f8b312] bg-primary-800  rounded-xl font-medium"
            >
              إضافة رد
            </Button>
          </div>
        )}

        {showReply && !isReply && (
          <div className="border flex items-start gap-4 border-gray-light rounded-lg p-2 mt-4 max-sm:flex-wrap relative">
            <div className="absolute size-5 top-0 right-0  bg-primary-800 flex items-center justify-center rounded-full  ">
              <button
                onClick={() => setShowReply(false)}
                className="top-0 right-0"
              >
                <Image
                  src="/assets/close.svg"
                  width={24}
                  height={24}
                  alt="close"
                  className="brightness-0 invert"
                />
              </button>
            </div>

            <Image
              unoptimized
              src={avatar || "/assets/avatar-user.svg"}
              className="rounded-lg"
              width={52}
              height={52}
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
