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

  const room = roomDetails?.room;
  const quizzes = roomDetails?.quizzes ?? [];
  const assignments = roomDetails?.assignments ?? [];
  const lessons = roomDetails?.lessons ?? [];
  const attachments = roomDetails?.attachments ?? [];

  const lockAfter =
    roomDetails && "lock_after" in roomDetails ? roomDetails.lock_after : null;

  const isRoomPurchasable =
    roomDetails &&
    "lock_after" in roomDetails &&
    lockAfter !== null &&
    Number(lockAfter) === 0;

  const isRoomPurchased =
    roomDetails &&
    "lock_after" in roomDetails &&
    lockAfter !== null &&
    Number(lockAfter) !== 0;

  const lockedToPass = roomDetails?.locked_to_pass;

  console.log("roomDetails", roomDetails);

  return (
    <ProtectedRoute
      subscribed={roomDetails?.is_subscriped}
      data={roomDetails}
      isLoading={isLoadingRoomDetails}
    >
      <div className="mt-20">
        <Animate preset="slideDown">
          <RoomDetailsHeader
            data={roomDetails}
            classroomId={classroomId}
            isRoomPurchasable={isRoomPurchasable}
            isRoomPurchased={isRoomPurchased}
          />
        </Animate>

        <Animate preset="fadeIn" delay={0.2}>
          <RoomFloatingCards data={roomDetails} />
        </Animate>

        <div className="wrapper py-22">
          {!room ? (
            <LoadingSpinner />
          ) : (
            <Animate preset="blurIn">
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
                            className="bg-transparent"
                            task={quiz}
                            room={room}
                            classroomId={classroomId}
                            subscribe={roomDetails.is_subscriped}
                            verify={
                              true || roomDetails.parent_phone_verification
                            }
                            locked={isRoomPurchasable}
                            linkText="فتح الامتحان"
                            type="exam"
                          />
                        ))}

                        {assignments.map((assignment) => (
                          <RoomDropDownQuiz
                            key={`assignment-${assignment.id}`}
                            task={assignment}
                            room={room}
                            classroomId={classroomId}
                            subscribe={roomDetails.is_subscriped}
                            verify={
                              true || roomDetails.parent_phone_verification
                            }
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
                            className="bg-transparent"
                            lesson={lesson}
                            subscribe={roomDetails.is_subscriped}
                            verify={
                              true || roomDetails.parent_phone_verification
                            }
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
                            className="bg-transparent"
                            attachment={attachment}
                            room={room}
                            subscribe={roomDetails.is_subscriped}
                            verify={
                              true || roomDetails.parent_phone_verification
                            }
                            locked={isRoomPurchasable}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Animate>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
