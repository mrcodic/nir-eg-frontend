"use client";

import LessonRoomCard from "@/components/LessonRoomCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModal } from "@/context/ModalProvider";
import { RoomData } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import PriceBadge from "../modules/payment/components/PriceBadge";
import { PaymentModel } from "./modals/PaymentModel";
import RoomDropDownQuiz from "./RoomDropDownItem";
import RoomFileDownloadLink from "./RoomFileDownloadLink";
import RoomProgressBadge from "./RoomProgressBadge";

const RoomAccordion = ({
  isProfile,
  room,
  subscribe,
  verify,
}: {
  isProfile?: any;
  room: RoomData;
  subscribe?: any;
  verify?: any;
}) => {
  const modal = useModal();
  const { SingleCourse } = useParams();

  const lock_after = "lock_after" in room && room?.lock_after;
  const isEmptyRoom =
    !room?.quizzes?.length &&
    !room?.lessons?.length &&
    !room?.attachments?.length &&
    !room?.assignments?.length;

  return (
    <>
      <Accordion className="relative" type="single" collapsible>
        <AccordionItem
          isProfile={isProfile}
          value="item-1"
          className="data-[state=open]:border-secondary"
        >
          <AccordionTrigger className="bg-white">
            <div className="me-2 flex w-full gap-2 sm:me-4 sm:gap-4 md:gap-6">
              <Image
                className="size-[104px] rounded-lg"
                src="/assets/grade-placeholder.png"
                alt=""
                width={104}
                height={104}
              />

              <div className="w-full flex-1">
                <div className="flex w-full flex-wrap items-center justify-between gap-y-2 sm:pl-6">
                  <h3 className="line-clamp-2 text-[18px] font-bold text-[#121212]">
                    {room?.title}
                  </h3>

                  <div className="ms-auto flex flex-col gap-2">
                    {subscribe &&
                      (lock_after == null || Number(lock_after) !== 0) && (
                        <RoomProgressBadge progress={room?.progress || 0} />
                      )}

                    {lock_after !== null && (
                      <div className="ms-auto flex gap-6 text-sm font-bold">
                        {Number(lock_after) !== 0 ? (
                          <div
                            style={{
                              boxShadow:
                                "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
                            }}
                            className="border-gray-light bg-background hidden items-center gap-1 rounded-[12px] border py-1 pr-px pl-2 text-[10px] font-bold md:flex"
                          >
                            <Image
                              src={"/assets/LockColor.svg"}
                              alt=""
                              width={24}
                              height={24}
                            />
                            <span> محتويات الحصة متاحة لمدة </span>
                            {Math.floor(lock_after / 24) > 0 && (
                              <p className="mr-1">
                                {" "}
                                &nbsp; {Math.floor(lock_after / 24)}أيام &nbsp;
                                {Math.floor(lock_after % 24)} ساعة{" "}
                              </p>
                            )}{" "}
                            {/* <p className="mr-1"> {lock_after % 24} دقيقة </p> */}
                          </div>
                        ) : (
                          <div className="ms-auto flex flex-col gap-x-4 gap-y-2 md:flex-row">
                            <div
                              aria-label="اشترك الآن فى هذه الحصة"
                              role="button"
                              className="bg-primary text-primary-foreground hover:bg-primary/80 flex h-8 cursor-pointer items-center rounded-lg px-4 py-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();

                                modal.setDialogContent(
                                  <PaymentModel
                                    roomId={room?.id}
                                    centerId={
                                      SingleCourse?.toString() || room.id
                                    }
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
                    )}
                  </div>
                </div>

                <div className="bg-gray-light my-3 h-px md:my-4" />

                <h3 className="text-gray-dark text-right text-sm">
                  {room?.description}
                </h3>
              </div>
            </div>
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
                  <p className="text-lg font-bold">
                    يجب أن تنجح في الامتحان لتتمكن من عرض محتويات الحصة
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
                  <p className="text-lg font-bold">
                    لا يوجد محتوى في هذه الحصة حتى الان
                  </p>
                </div>
              )}

              {room?.quizzes &&
                (room?.quizzes).map((quiz) => {
                  return (
                    <RoomDropDownQuiz
                      key={"quiz-" + quiz.id}
                      item={quiz}
                      room={room}
                      SingleCourse={SingleCourse}
                      subscribe={subscribe || room?.is_subscriped}
                      verify={verify}
                      locked={lock_after == 0}
                      linkText="فتح الامتحان"
                      type="exam"
                    />
                  );
                })}

              {room?.lessons?.map((lesson, index) => {
                return (
                  <LessonRoomCard
                    key={index}
                    lesson={lesson}
                    subscribe={subscribe || room?.is_subscriped}
                    verify={verify || room?.parent_phone_verification}
                    roomId={room?.id}
                    locked={room?.locked_to_pass || lock_after == 0}
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
                      subscribe={subscribe || room?.is_subscriped}
                      verify={verify || room?.parent_phone_verification}
                      lock_after={lock_after}
                      index={index}
                    />
                  );
                })}

              {room?.assignments &&
                (room?.assignments).map((ass) => {
                  return (
                    <RoomDropDownQuiz
                      key={"ass-" + ass.id}
                      item={ass}
                      room={room}
                      SingleCourse={SingleCourse}
                      subscribe={subscribe || room?.is_subscriped}
                      verify={verify || room?.parent_phone_verification}
                      locked={room?.locked_to_pass || lock_after == 0}
                      linkText="فتح الواجب"
                      type="ass"
                    />
                  );
                })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default RoomAccordion;
