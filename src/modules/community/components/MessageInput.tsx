"use client";

import VoiceMessageRecorder from "@/components/shared/VoiceMessageRecorder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { File } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useSendComment from "../hooks/useSendComment";
import useSendReply from "../hooks/useSendReply";
import FilePreview from "./FilePreview";

type MessageInputProps = {
  className?: string;
  lessonId: string | number;
  currentTime: number;
  isReply?: boolean;
  commentId?: string | number;
  placeholder?: string;
  id?: string;
  avatar?: string;
  renderDescription?: () => React.ReactNode;
};

const MessageInput = ({
  className,
  lessonId,
  currentTime,
  isReply,
  commentId,
  placeholder,
  id,
  avatar,
  renderDescription,
}: MessageInputProps) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [audios, setAudios] = useState([]);
  const [isRecorder, setIsRecorder] = useState(false);

  const { mutate: sendComment } = useSendComment();
  const { mutate: sendReply } = useSendReply();

  const handleSend = async (currentTime) => {
    if (isRecorder && !audios.length) {
      return;
    }
    if (!text && files.length === 0 && audios.length === 0) {
      return;
    }

    if (isReply) {
      sendReply({
        data: { body: text, audios, files },
        currentTime,
        lessonId,
        commentId,
      });
    } else {
      sendComment({
        data: { body: text, audios, files },
        currentTime,
        lessonId,
      });
    }

    setText("");
    setFiles([]);
    setAudios([]);
    setIsRecorder(false);
  };

  return (
    <div className={cn("flex flex-col gap-2 md:flex-row", className)}>
      <div className="flex h-full w-full flex-col">
        <FilePreview files={files} onChange={setFiles} className="mb-1" />

        <div
          className={cn("flex flex-col gap-2 md:flex-row", {
            "md:flex-col": isRecorder,
          })}
        >
          <div
            className={cn("flex shrink-0 items-center gap-2", {
              "w-full": isRecorder,
            })}
          >
            <Image
              unoptimized
              src={avatar || "/assets/avatar-user.svg"}
              className="size-11 rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
              width={44}
              height={44}
              alt="avatar"
            />

            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center">
              <File className="text-primary-800 size-6" />

              <input
                type="file"
                accept="application/pdf,image/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files),
                    ]);
                  }
                }}
                onClick={() => {
                  useVideoPlayerStore.getState().pause();
                }}
              />
            </label>

            <VoiceMessageRecorder
              setAudios={setAudios}
              isRecorder={isRecorder}
              toggleRecorder={(val) => setIsRecorder(val)}
            />
          </div>

          {renderDescription?.()}

          {/* {!isRecorder && ( */}
          <div className="flex w-full items-center gap-2">
            <input
              id={id || "input-field"}
              // ref={ref}
              style={{
                scrollMarginTop: "100px",
              }}
              className="text-gray-dark border-gray-light h-11 w-full flex-1 rounded-lg border bg-transparent px-3 py-1 outline-hidden"
              placeholder={placeholder || "اكتب ملاحظتك هنا"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(currentTime);
              }}
              onClick={() => {
                useVideoPlayerStore.getState().pause();
              }}
            />

            <Button
              disabled={
                (text.length === 0 &&
                  files.length === 0 &&
                  audios.length === 0) ||
                (isRecorder && !audios.length)
              }
              onClick={() => handleSend(currentTime)}
              className="h-11 w-full max-w-16 sm:max-w-32"
            >
              إدخال
            </Button>
          </div>
        </div>
      </div>

      {/* {isReply && (
          <button
            disabled={
              text.length === 0 &&
              files.length === 0 &&
              images.length === 0 &&
              audios.length === 0
            }
            className="bg-primary-800 max-md:ms-auto disabled:opacity-50 disabled:cursor-not-allowed gap-2 w-[109px] justify-center flex rounded-lg items-center p-2 text-white "
            onClick={handleSend}
          >
            <span>إرسال</span>
            <Image src="/assets/Send.svg" width={20} height={20} alt="send" />
          </button>
        )} */}
    </div>
  );
};
MessageInput.displayName = "MessageInput";

export default MessageInput;
