"use client";

import RoomExpireBadge from "@/components/cards/RoomExpireBadge";
import RoomProgressBadge from "@/components/cards/RoomProgressBadge";
import { PaymentModel } from "@/components/modals/PaymentModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModal } from "@/context/ModalProvider";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import LessonRoomCard from "@/modules/rooms/components/LessonRoomCard";
import RoomFileDownloadLink from "@/modules/rooms/components/RoomFileDownloadLink";
import { IRoomData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import RoomTaskCard from "./RoomTaskCard";

const RoomAccordion = ({
  isProfile,
  room,
  isSubscribed,
  verify,
  courseName,
  classroomId,
  tasksEnabled = true,
}: {
  isProfile?: boolean;
  room: IRoomData;
  isSubscribed?: boolean;
  verify?: boolean;
  courseName?: string;
  classroomId: string;
  tasksEnabled?: boolean;
}) => {
  const lock_after = "lock_after" in room && room?.lock_after;
  const isRoomPurchasable = lock_after !== null && Number(lock_after) === 0;

  const isEmptyRoom =
    !room?.quizzes?.length &&
    !room?.lessons?.length &&
    !room?.attachments?.length &&
    !room?.assignments?.length;

  return (
    <Accordion className="relative" type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="data-[state=open]:border-primary-800 hover:border-primary-800 shadow-sm transition-all"
      >
        <AccordionTrigger className="bg-white">
          <RoomAccordionTrigger
            isProfile={isProfile}
            room={room}
            isSubscribed={isSubscribed}
            lockAfter={lock_after}
            courseName={courseName}
            classroomId={classroomId}
            isRoomPurchasable={isRoomPurchasable}
          />
        </AccordionTrigger>

        <AccordionContent>
          <div className="mt-6 space-y-2">
            {!isEmptyRoom && room?.locked_to_pass && (
              <div className="bg-background border-gray-light flex items-center gap-2 rounded-lg border p-2">
                <Image
                  src="/assets/warning-fill.svg"
                  width={32}
                  height={32}
                  alt="warning icon"
                  className="animate-pulse"
                />
                <p className="text-sm font-bold">
                  يجب أن تنجح في الكويز لتتمكن من عرض محتويات الحصة
                </p>
              </div>
            )}

            {isEmptyRoom && (
              <div className="bg-background border-gray-light flex items-center gap-2 rounded-lg border p-2">
                <Image
                  src="/assets/warning-fill.svg"
                  width={32}
                  height={32}
                  alt="warning icon"
                  className="animate-pulse"
                />
                <p className="text-sm font-bold">
                  لا يوجد محتوى في هذه الحصة حتى الان
                </p>
              </div>
            )}

            {tasksEnabled &&
              room?.quizzes &&
              (room?.quizzes).map((quiz) => {
                return (
                  <RoomTaskCard
                    key={"quiz-" + quiz.id}
                    task={quiz}
                    room={room}
                    classroomId={classroomId}
                    subscribe={isSubscribed || room?.is_subscriped}
                    verify={verify}
                    locked={lock_after == 0}
                    linkText="فتح الكويز"
                    type="exam"
                  />
                );
              })}

            {tasksEnabled &&
              room?.assignments &&
              (room?.assignments).map((ass) => {
                return (
                  <RoomTaskCard
                    key={"ass-" + ass.id}
                    task={ass}
                    room={room}
                    classroomId={classroomId}
                    subscribe={isSubscribed || room?.is_subscriped}
                    verify={verify || room?.student_phone_verification}
                    locked={room?.locked_to_pass || lock_after == 0}
                    linkText="فتح الواجب"
                    type="assignment"
                  />
                );
              })}

            {room?.lessons?.map((lesson, index) => {
              return (
                <LessonRoomCard
                  key={index}
                  lesson={lesson}
                  subscribe={isSubscribed || room?.is_subscriped}
                  verify={verify || room?.student_phone_verification}
                  roomId={room?.id}
                  locked={room?.locked_to_pass || lock_after == 0}
                  classroomId={classroomId}
                />
              );
            })}

            {room?.attachments &&
              (room?.attachments).map((attachment, index) => {
                return (
                  <RoomFileDownloadLink
                    key={index}
                    attachment={attachment}
                    room={room}
                    subscribe={isSubscribed || room?.is_subscriped}
                    verify={verify || room?.student_phone_verification}
                    locked={isRoomPurchasable}
                    index={index}
                  />
                );
              })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RoomAccordion;

const RoomAccordionTrigger = ({
  isProfile,
  room,
  isSubscribed,
  lockAfter,
  courseName,
  classroomId,
  isRoomPurchasable,
}: {
  isProfile?: boolean;
  room: IRoomData;
  isSubscribed?: boolean;
  lockAfter: number | null;
  courseName?: string;
  classroomId: string;
  isRoomPurchasable: boolean;
}) => {
  const modal = useModal();
  const isRoomPurchased = lockAfter !== null && Number(lockAfter) !== 0;

  return (
    <div className="me-2 flex w-full gap-2 sm:me-4 sm:gap-4 md:gap-6">
      <Image
        className="size-20 rounded-lg sm:size-[104px]"
        src="/assets/grade-placeholder.png"
        alt=""
        width={104}
        height={104}
      />

      <div className="w-full flex-1">
        <div className="flex w-full flex-wrap items-center justify-between gap-y-2">
          <h3 className="line-clamp-2 text-start text-base font-bold text-black sm:text-lg">
            {room?.title}
          </h3>

          <div className="ms-auto flex flex-col gap-2">
            {!isProfile &&
              isSubscribed &&
              (lockAfter == null || Number(lockAfter) !== 0) && (
                <RoomProgressBadge progress={room?.progress || 0} />
              )}

            {isRoomPurchasable && (
              <div className="ms-auto flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
                <div
                  aria-label="اشترك الآن فى هذه الحصة"
                  role="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();

                    modal.setDialogContent(
                      <PaymentModel
                        roomId={room?.id}
                        courseId={classroomId}
                        price={room?.price}
                      />,
                    );

                    modal.openModal();
                  }}
                >
                  اشترك الآن
                </div>

                <PriceBadge className="h-8" price={room?.price} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-light my-3 h-px md:my-4" />

        <div className="flex flex-wrap justify-between gap-x-2 gap-y-3">
          <div className="flex flex-col items-start gap-2">
            {courseName && (
              <h3 className="text-foreground line-clamp-1 text-right text-base font-bold">
                {courseName}
              </h3>
            )}
            <h3 className="text-gray-dark line-clamp-1 text-right text-sm">
              {room?.description}
            </h3>
          </div>

          <div className="ms-auto flex flex-col items-end gap-2 empty:hidden">
            {isSubscribed && (
              <Link
                href={`/bundles/${classroomId}/${room?.id}`}
                className="bg-primary-800 hover:bg-primary-800/80 flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm text-white"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                تفاصيل الحصة
                <div
                  style={{
                    maskImage: "url(/assets/classrooms-fill.svg)",
                    WebkitMaskImage: "url(/assets/classrooms-fill.svg)",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                  className="h-4 w-4 bg-white"
                />
              </Link>
            )}

            {isRoomPurchased && (
              <RoomExpireBadge lock_after={lockAfter} className="ms-auto" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
