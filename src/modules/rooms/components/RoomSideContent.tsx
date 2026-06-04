"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import { IRoomDetails } from "@/types";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { memo } from "react";
import {
  AssignmentCard,
  AttachmentCard,
  LessonCard,
  QuizCard,
} from "./RoomSidebarCards";

type RoomSideContentProps = {
  data: IRoomDetails | undefined;
  onLessonClick?: (url: string) => void;
  locked: boolean;
  isLoading: boolean;
  className?: string;
  activeLessonId?: number;
};

const RoomSideContent = ({
  data,
  onLessonClick,
  locked,
  className,
  isLoading,
  activeLessonId,
}: RoomSideContentProps) => {
  const params = useParams();
  const classroomId = Array.isArray(params.classroomId)
    ? params.classroomId[0]
    : params.classroomId;
  const room = Array.isArray(params.room) ? params.room[0] : params.room;

  const { features } = useTenant();
  const router = useRouter();

  const hasTasksEnabled = features?.quizzes;

  if (isLoading) {
    return (
      <div
        className={cn(
          "border-gray-light sticky top-22 flex h-fit max-h-[max(calc(100vh-90px),600px)] min-h-96 w-full items-center justify-center overflow-y-auto rounded-lg border p-4 group-data-[template=landing-v3]/template:top-29",
          className,
        )}
      >
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  if (!data)
    return (
      <div
        className={cn(
          "border-gray-light sticky top-22 flex h-fit max-h-[max(calc(100vh-90px),600px)] min-h-96 w-full items-center justify-center overflow-y-auto rounded-lg border p-4 group-data-[template=landing-v3]/template:top-29",
          className,
        )}
      >
        <p className="text-sm font-bold">لا يوجد بيانات</p>
      </div>
    );

  return (
    <div
      className={cn(
        "border-gray-light sticky top-22 flex min-h-0 w-full flex-col overflow-hidden rounded-lg border p-4 group-data-[template=landing-v3]/template:top-29 lg:h-[calc(100vh-90px)] lg:min-h-96",
        className,
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-4">
        <Image
          src="/assets/grade-placeholder.png"
          className="size-16 rounded-lg"
          width={64}
          height={64}
          alt="grade placeholder"
        />

        <div className="flex w-full flex-col gap-2">
          <h1 className="line-clamp-1 text-[18px] font-bold">
            {data?.room?.title}
          </h1>
          <hr className="border-gray-light h-px w-full" />
          <p className="text-gray-dark text-xs">{data?.room?.grade?.title}</p>
        </div>
      </div>

      {/* Back Button */}
      <Button
        onClick={() => router.push(`/bundles/${classroomId}`)}
        className="text-primary-800 border-primary-800 hover:bg-primary-800 group mt-6 h-11 w-full shrink-0 border bg-white py-2.5 hover:text-white"
      >
        <ChevronRight className="group-hover:stroke-white" />
        <span>العودة للكورس</span>
      </Button>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["lessons", "quizzes", "assignments", "attachments"]}
        className="mt-6 min-h-0 w-full flex-1"
      >
        <ScrollArea dir="rtl" className="h-full min-h-0">
          <div className="border-gray-light space-y-4 rounded-lg border p-1">
            {/* Lessons Section */}
            <AccordionItem
              value="lessons"
              className={cn(
                "rounded-none border-transparent p-0 pb-2",
                "not-last-of-type:border-b-gray-light",
              )}
            >
              <AccordionTrigger className="text-gray-dark hover:text-gray-darker py-1 text-sm font-bold hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>الدروس</span>
                  <span className="text-primary-800 text-xs">
                    ({data?.lessons.length})
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="space-y-2 pt-2 pb-2">
                {data?.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    locked={locked}
                    active={activeLessonId === lesson.id}
                    roomId={data?.room.id}
                    classroomId={classroomId ?? ""}
                    onClick={() =>
                      onLessonClick
                        ? onLessonClick(
                            `/bundles/${classroomId}/${data?.room.id}/${lesson.id}`,
                          )
                        : router.push(
                            `/bundles/${classroomId}/${data?.room.id}/${lesson.id}`,
                          )
                    }
                  />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Quizzes Section */}
            {hasTasksEnabled && !!data?.quizzes?.length && (
              <AccordionItem
                value="quizzes"
                className={cn(
                  "rounded-none border-transparent p-0 pb-2",
                  "not-last-of-type:border-b-gray-light!",
                )}
              >
                <AccordionTrigger className="text-gray-dark hover:text-gray-darker text-sm font-bold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>الكويزات</span>
                    <span className="text-primary-800 text-xs">
                      ({data?.quizzes.length})
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-2 pt-2 pb-2">
                  {data?.quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      href={`/bundles/${classroomId}/${room}/exams/${quiz.id}`}
                      locked={locked}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Assignments Section */}
            {hasTasksEnabled && !!data?.assignments?.length && (
              <AccordionItem
                value="assignments"
                className={cn(
                  "rounded-none border-transparent p-0 pb-2",
                  "not-last-of-type:border-b-gray-light",
                )}
              >
                <AccordionTrigger className="text-gray-dark hover:text-gray-darker text-sm font-bold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>الواجبات</span>
                    <span className="text-primary-800 text-xs">
                      ({data?.assignments.length})
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-2 pt-2 pb-2">
                  {data?.assignments.map((ass) => (
                    <AssignmentCard
                      key={ass.id}
                      assignment={ass}
                      locked={locked}
                      href={`/bundles/${classroomId}/${room}/assignment/${ass.id}`}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Attachments Section */}
            {!!data?.room.attachments?.length && (
              <AccordionItem
                value="attachments"
                className={cn(
                  "rounded-none border-transparent p-0 pb-2",
                  "not-last-of-type:border-b-gray-light",
                )}
              >
                <AccordionTrigger className="text-gray-dark hover:text-gray-darker text-sm font-bold hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>الملفات</span>
                    <span className="text-primary-800 text-xs">
                      ({data?.room.attachments.length})
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-2 pt-2 pb-2">
                  {data?.room.attachments.map((attachment, index) => (
                    <AttachmentCard
                      key={attachment.url ?? `attachment-${index}`}
                      attachment={attachment}
                      locked={locked}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
          </div>
        </ScrollArea>
      </Accordion>
    </div>
  );
};

export default memo(RoomSideContent);
