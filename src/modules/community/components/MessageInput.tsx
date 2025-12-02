"use client";

import { Button } from "@/components/ui/button";
import VoiceMessageRecorder from "@/components/VoiceMessageRecorder";
import { cn } from "@/lib/utils";
import "filepond/dist/filepond.min.css";
import { File } from "lucide-react";
import { useState } from "react";
import { FilePond } from "react-filepond";
import useSendComment from "../hooks/useSendComment";
import useSendReply from "../hooks/useSendReply";

type MessageInputProps = {
  className?: string;
  lessonId: string | number;
  currentTime: number;
  isReply?: boolean;
  commentId?: string | number;
  placeholder?: string;
  id?: string;
};

const MessageInput = ({
  className,
  lessonId,
  currentTime,
  isReply,
  commentId,
  placeholder,
  id,
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
    <div className={cn("flex flex-col  md:flex-row  gap-2", className)}>
      <div className="flex flex-col w-full h-full">
        {files.length > 0 && (
          <FilePond
            acceptedFileTypes={["application/pdf", "image/*"]}
            files={files}
            onupdatefiles={setFiles}
            allowMultiple
          />
        )}

        <div
          className={cn("flex flex-col md:flex-row  gap-2", {
            "md:flex-col": isRecorder,
          })}
        >
          <div
            className={cn("flex items-center  gap-2", {
              "w-full": isRecorder,
            })}
          >
            <label className="cursor-pointer shrink-0 flex items-center justify-center size-8 border border-[#F8DEC5] bg-background rounded-md">
              <File className="size-5" />

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
                  const iframeRef = document.getElementById(
                    "vdocipher-iframe"
                  ) as HTMLIFrameElement;
                  if (!iframeRef) return;
                  const player = window?.VdoPlayer?.getInstance(iframeRef);

                  player?.video?.pause();
                }}
              />
            </label>

            <VoiceMessageRecorder
              setAudios={setAudios}
              isRecorder={isRecorder}
              toggleRecorder={(val) => setIsRecorder(val)}
            />
          </div>

          {/* {!isRecorder && ( */}
          <div className="flex items-center w-full  gap-2">
            <input
              id={id || "input-field"}
              // ref={ref}
              style={{
                scrollMarginTop: "100px",
              }}
              className="flex-1 bg-transparent text-gray-dark px-3 h-11 rounded-lg border border-gray-light  w-full py-1 outline-hidden"
              placeholder={placeholder || "اكتب ملاحظتك هنا"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(currentTime);
              }}
              onClick={() => {
                const iframeRef = document.getElementById(
                  "vdocipher-iframe"
                ) as HTMLIFrameElement;
                if (!iframeRef) return;
                const player = window?.VdoPlayer?.getInstance(iframeRef);

                player?.video?.pause();
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
              className="sm:max-w-32 max-w-16 w-full h-11"
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
