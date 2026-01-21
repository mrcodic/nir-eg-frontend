"use client";

import { FormField, FormItem } from "@/components/ui/form";
import ReadingBorder from "@/components/ui/paragraph-borders";
import { Textarea } from "@/components/ui/textarea";
import { useTaskContext } from "@/context/TaskProvider";
import { cn } from "@/lib/utils";
import { File, Files, Trash } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, memo, useCallback } from "react";
import { useFormState, useWatch } from "react-hook-form";
import QuestionHeader from "./QuestionHeader";
import QuestionTitle from "./QuestionTitle";

type Props = {
  question: any;
  index: number;
  listRef: React.MutableRefObject<HTMLDivElement[]>;
};

const WrittenQuestion = ({ question, index, listRef }: Props) => {
  const { control, setValue, isSubmitting } = useTaskContext();

  // ✅ subscribe ONLY to this field
  const value = useWatch({
    control,
    name: `questions.${question.id}`,
  });

  // ✅ subscribe ONLY to this field’s error
  const { errors } = useFormState({
    control,
    name: `questions.${question.id}`,
  });

  const fieldError =
    errors?.questions?.[question.id] || (!value?.text && !value?.attachment);

  const answered = question?.essay?.graded;
  const disabled = isSubmitting || answered;
  const isCorrect = question?.essay?.is_correct;
  const selectedFile = value?.attachment;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(`questions.${question.id}`, {
        attachment: value?.attachment ?? null,
        text: e.target.value,
      });
    },
    [question.id, setValue, value?.attachment],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setValue(`questions.${question.id}`, value);
        return;
      }

      setValue(`questions.${question.id}`, {
        attachment: file,
        text: value?.text ?? "",
      });
    },
    [question.id, setValue, value],
  );

  return (
    <div
      dir="ltr"
      ref={(el) => {
        listRef.current[index] = el!;
      }}
      style={{ scrollMarginTop: "100px" }}
      id={`question-${index}`}
      className="bg-background rounded-lg p-4"
    >
      <QuestionHeader index={index} error={fieldError} />

      {!!answered && !!isCorrect && (
        <p className="text-end text-xs text-green-600">
          لقد قمت بالإجابة على هذا السؤال بنجاح
        </p>
      )}

      <div className="space-y-2">
        <QuestionTitle title={question.title} video={question?.answer_video} />

        <FormField
          control={control}
          name={`questions.${question.id}.text`}
          render={({ field }) => (
            <FormItem>
              <div className="bg-gray-light relative flex w-full items-start rounded-xl border border-gray-300">
                <Textarea
                  {...field}
                  dir="rtl"
                  disabled={disabled}
                  placeholder="قم بإدخال إجابتك هنا"
                  className={cn(
                    "w-full rounded-xl p-2 pr-9 text-sm placeholder-shown:text-end disabled:text-black disabled:opacity-100",
                  )}
                  value={
                    answered
                      ? question?.essay?.text &&
                        question?.essay?.text !== "null"
                        ? question.essay.text
                        : "لم يتم ادخال إجابة"
                      : (value?.text ?? "")
                  }
                  onChange={handleInputChange}
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
                  <>
                    <input
                      type="file"
                      className="hidden"
                      id={`pickFile-${question.id}`}
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={disabled}
                    />

                    {!selectedFile && (
                      <label
                        htmlFor={`pickFile-${question.id}`}
                        className="group absolute top-1 right-1 cursor-pointer p-1"
                      >
                        <Files className="size-6 transition-all group-hover:stroke-blue-500" />
                      </label>
                    )}
                  </>
                )}
              </div>

              {fieldError && (
                <p className="text-xs text-red-600">
                  {fieldError.message as string}
                </p>
              )}

              {(selectedFile || question?.essay?.attachments?.[0]) && (
                <Overview
                  file={selectedFile || question?.essay?.attachments?.[0]}
                  onClick={() =>
                    setValue(`questions.${question.id}`, {
                      attachment: null,
                      text: value?.text ?? "",
                    })
                  }
                  isAnswer={answered}
                />
              )}

              {answered && question?.explanation && (
                <div className="mt-2">
                  <ReadingBorder text="شرح الإجابة" />
                  <p
                    className="break-all *:break-all"
                    dangerouslySetInnerHTML={{
                      __html: question.explanation,
                    }}
                  />
                </div>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default memo(WrittenQuestion);

/* ---------- Overview ---------- */

const Overview = ({
  file,
  onClick,
  isAnswer,
}: {
  file: any;
  onClick: () => void;
  isAnswer: boolean;
}) => {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-100 p-2">
        <div className="flex w-full items-center gap-4">
          {isAnswer && file?.mime?.startsWith("image") ? (
            <ImagePreview src={file.url} />
          ) : file?.type?.startsWith("image") ? (
            <ImagePreview src={URL.createObjectURL(file)} />
          ) : (
            <File className="h-6 w-6" />
          )}

          <p className="text-xs font-bold break-all">{file.name}</p>
        </div>

        {!isAnswer && (
          <Trash
            className="cursor-pointer hover:text-red-500"
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
};

const ImagePreview = ({ src }: { src: string }) => (
  <div className="relative aspect-square w-20 shrink-0">
    <Image
      src={src}
      fill
      alt="image"
      className="cursor-pointer rounded-lg object-cover"
      onClick={(e) => e.currentTarget.requestFullscreen()}
    />
  </div>
);
