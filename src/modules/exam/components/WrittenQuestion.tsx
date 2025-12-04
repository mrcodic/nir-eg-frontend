"use client";

import { FormField, FormItem } from "@/components/ui/form";
import ReadingBorder from "@/components/ui/paragraph-borders";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { File, Files, Trash } from "lucide-react";
import Image from "next/image";
import { ChangeEvent } from "react";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

const WrittenQuestion = ({ form, question, listRef, index }) => {
  const fieldError = form.formState.errors.questions?.[question.id];
  const fieldValue = form.watch(`questions.${question.id}`);
  const selectedFile = fieldValue?.attachment;
  const answered = question?.essay?.graded;
  const disabled = form.formState.isSubmitting || answered;
  const isCorrect = question?.essay?.is_correct;

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    form.setValue(`questions.${question.id}`, {
      attachment: fieldValue?.attachment,
      text: value,
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    // 1) Check file size
    if (file?.size > 5 * 1024 * 1024) {
      form.setError(`questions.${question.id}`, {
        type: "manual",
        message: "File size must be less than 5MB",
      });
      return;
    }

    form.setValue(`questions.${question.id}`, {
      attachment: file,
      text: fieldValue?.text,
    });
  }

  return (
    <div
      dir="ltr"
      ref={(el) => {
        listRef.current[index] = el;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
      className="bg-background p-4 rounded-lg"
    >
      <QuestionHeader index={index} error={fieldError} />

      {answered && (
        <div className="space-y-2 text-end ">
          {isCorrect ? (
            <p className="text-xs text-green-600">
              لقد قمت بالإجابة على هذا السؤال بنجاح
            </p>
          ) : (
            <p className="text-xs text-red-600">
              لم تقم بالإجابة على هذا السؤال بنجاح
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <QuestionTitle title={question.title} video={question?.answer_video} />

        <FormField
          control={form.control}
          name={`questions.${question.id}.text`}
          render={({ field }) => (
            <FormItem>
              <div className="w-full">
                <div
                  className={cn(
                    "relative flex w-full items-start border rounded-xl  border-gray-300 bg-gray-light "
                  )}
                >
                  <Textarea
                    dir="rtl"
                    {...field}
                    onChange={handleInputChange}
                    value={
                      answered
                        ? question?.essay?.text &&
                          question?.essay?.text !== "null"
                          ? question?.essay?.text
                          : "لم يتم ادخال إجابة"
                        : fieldValue?.text
                    }
                    disabled={disabled}
                    placeholder={"قم بإدخال إجابتك هنا"}
                    className={cn(
                      "rounded-xl  w-full p-2 pr-9  text-sm placeholder-shown:text-end disabled:text-black disabled:opacity-100"
                    )}
                    style={{
                      unicodeBidi: "plaintext",
                      ...(answered
                        ? {
                            border: isCorrect
                              ? "3px solid lightgreen"
                              : "3px solid red",
                          }
                        : {}),
                    }}
                  />

                  {!answered && (
                    <input
                      type="file"
                      className="hidden"
                      id={"pickFile" + question.id}
                      accept="image/*"
                      // accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={disabled}
                    />
                  )}

                  {!selectedFile && !answered && (
                    <label
                      className="absolute group p-1 right-1 top-1 cursor-pointer"
                      htmlFor={"pickFile" + question.id}
                    >
                      {/* <Image
                        src="/file.svg"
                        className="dark:invert"
                        alt="image"
                        width={20}
                        height={20}
                      /> */}
                      <Files className="size-6 group-hover:stroke-blue-500 transition-all" />
                    </label>
                  )}
                </div>

                {fieldError && (
                  <p className="text-xs text-red-600">{fieldError.message}</p>
                )}

                {selectedFile || question?.essay?.attachments?.[0] ? (
                  <Overview
                    file={selectedFile || question?.essay?.attachments?.[0]}
                    onClick={() => {
                      form.setValue(`questions.${question.id}`, {
                        attachment: null,
                        text: fieldValue?.text,
                      });
                    }}
                    isAnswer={answered}
                  />
                ) : null}

                {answered && question?.explanation && (
                  <div className="mt-2">
                    <ReadingBorder text="شرح الإجابة" />
                    <p
                      className="break-all *:break-all "
                      dangerouslySetInnerHTML={{
                        __html: question?.explanation,
                      }}
                    ></p>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default WrittenQuestion;

const Overview = ({ file, onClick, isAnswer }) => {
  return (
    <div className="mt-2 flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-100 p-2">
        <div className="flex items-center gap-4 w-full">
          {isAnswer && file?.mime?.startsWith("image") ? (
            <div
              className="relative shrink-0"
              style={{
                aspectRatio: "1 / 1",
                width: "80px",
              }}
            >
              <Image
                className="cursor-pointer rounded-lg object-cover"
                src={file.url}
                fill
                alt="image"
                onClick={(e) => {
                  e.currentTarget.requestFullscreen();
                }}
              />
            </div>
          ) : file.type?.startsWith("image") ? (
            <div
              className="relative shrink-0"
              style={{
                aspectRatio: "1 / 1",
                width: "80px",
              }}
            >
              <Image
                className="cursor-pointer rounded-lg object-cover"
                src={URL.createObjectURL(file)}
                fill
                alt="image"
                onClick={(e) => {
                  e.currentTarget.requestFullscreen();
                }}
              />
            </div>
          ) : (
            <File className="h-6 w-6" />
          )}

          <p
            className="text-xs font-bold  text-black-3   "
            style={{
              wordBreak: "break-all",
            }}
          >
            {file.name}
          </p>
        </div>

        {isAnswer ? null : (
          <Trash
            className="cursor-pointer hover:text-red-500 transition-all"
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
};
