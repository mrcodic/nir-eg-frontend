"use client";

import { Animate } from "@/components/shared/Animate";
import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import LessonRoomCard from "@/modules/rooms/components/LessonRoomCard";
import RoomDetailsHeader from "@/modules/rooms/components/RoomDetailsHeader";
import RoomDropDownQuiz from "@/modules/rooms/components/RoomDropDownQuiz";
import RoomFileDownloadLink from "@/modules/rooms/components/RoomFileDownloadLink";
import RoomFloatingCards from "@/modules/rooms/components/RoomFloatingCards";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { useRoomDetailsData } from "@/modules/rooms/hooks/useRoomDetailsData";
import { useParams } from "next/navigation";

export default function RoomDetailsPage() {
  const params = useParams();
  const classroomId = params.classroomId?.toString() ?? "";
  const roomId = params.room?.toString() ?? "";

  const { roomDetails, isLoadingRoomDetails } = useRoomDetailsData({
    classroomId,
    roomId,
  });

  const data = roomDetails?.body;
  const room = data?.room;
  const quizzes = data?.quizzes ?? [];
  const assignments = data?.assignments ?? [];
  const lessons = data?.lessons ?? [];
  const attachments = data?.attachments ?? [];

  const lockAfter = data && "lock_after" in data ? data.lock_after : null;

  const isRoomPurchasable =
    data &&
    "lock_after" in data &&
    lockAfter !== null &&
    Number(lockAfter) === 0;

  const isRoomPurchased =
    data &&
    "lock_after" in data &&
    lockAfter !== null &&
    Number(lockAfter) !== 0;

  const lockedToPass = data?.locked_to_pass;

  return (
    <ProtectedRoute
      subscribed={roomDetails?.body?.is_subscriped}
      data={roomDetails}
      isLoading={isLoadingRoomDetails}
    >
      <div className="mt-20">
        <Animate preset="slideDown">
          <RoomDetailsHeader
            data={data}
            classroomId={classroomId}
            isRoomPurchasable={isRoomPurchasable}
            isRoomPurchased={isRoomPurchased}
          />
        </Animate>

        <Animate preset="fadeIn" delay={0.2}>
          <RoomFloatingCards data={data} lockedToPass={lockedToPass} />
        </Animate>

        <div className="wrapper py-22">
          {!room ? (
            <LoadingSpinner />
          ) : (
            <Accordion
              type="multiple"
              defaultValue={["tasks", "videos", "files"]}
              className="space-y-10"
            >
              <AccordionItem
                value="tasks"
                className="border-none bg-transparent p-0 shadow-none"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  <RoomHeader
                    title="الامتحانات والواجبات"
                    icon="/assets/assignment-colored.svg"
                    className="mb-0"
                  />
                </AccordionTrigger>

                <AccordionContent className="pt-4 pb-0">
                  {!quizzes.length && !assignments.length ? (
                    <Empty text="لا توجد امتحانات" className="py-2" />
                  ) : (
                    <div className="space-y-3">
                      {quizzes.map((quiz) => (
                        <RoomDropDownQuiz
                          key={`quiz-${quiz.id}`}
                          item={quiz}
                          room={room}
                          classroomId={classroomId}
                          subscribe={data.is_subscriped}
                          verify={true || data.parent_phone_verification}
                          locked={isRoomPurchasable}
                          linkText="فتح الامتحان"
                          type="exam"
                        />
                      ))}

                      {assignments.map((assignment) => (
                        <RoomDropDownQuiz
                          key={`assignment-${assignment.id}`}
                          item={assignment}
                          room={room}
                          classroomId={classroomId}
                          subscribe={data.is_subscriped}
                          verify={true || data.parent_phone_verification}
                          locked={lockedToPass || isRoomPurchasable}
                          linkText="فتح الواجب"
                          type="ass"
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="videos"
                className="border-none bg-transparent p-0 shadow-none"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  <RoomHeader
                    title="فيديوهات الحصة"
                    icon="/assets/videos-fill.svg"
                    className="mb-0"
                  />
                </AccordionTrigger>

                <AccordionContent className="pt-4 pb-0">
                  {!lessons.length ? (
                    <Empty text="لا توجد فيديوهات" className="py-2" />
                  ) : (
                    <div className="space-y-3">
                      {lessons.map((lesson) => (
                        <LessonRoomCard
                          key={lesson.id}
                          lesson={lesson}
                          subscribe={data.is_subscriped}
                          verify={true || data.parent_phone_verification}
                          roomId={room.id}
                          locked={lockedToPass || isRoomPurchasable}
                          classroomId={classroomId}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="files"
                className="border-none bg-transparent p-0 shadow-none"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  <RoomHeader
                    title="ملفات الحصة"
                    icon="/assets/files-fill.svg"
                    className="mb-0"
                  />
                </AccordionTrigger>

                <AccordionContent className="pt-4 pb-0">
                  {!attachments.length ? (
                    <Empty text="لا توجد ملفات" className="py-2" />
                  ) : (
                    <div className="space-y-3">
                      {attachments.map((attachment, index) => (
                        <RoomFileDownloadLink
                          key={attachment.url ?? `attachment-${index}`}
                          attachment={attachment}
                          room={room}
                          subscribe={data.is_subscriped}
                          verify={true || data.parent_phone_verification}
                          locked={isRoomPurchasable}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
