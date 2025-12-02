"use client";

import RoomRevision from "@/components/RoomRevision";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModal } from "@/context/ModalProvider";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PaymentModel } from "./modals/PaymentModel";
import RoomDropDownQuiz from "./RoomDropDownItem";
import RoomFileDownloadLink from "./RoomFileDownloadLink";
import RoomProgressBadge from "./RoomProgressBadge";
import PriceBadge from "./ui/PriceBadge";

const Room = ({
  isProfile,
  room,
  subscribe,
  verify,
  subType,
}: {
  isProfile?: any;
  room: any;
  subscribe?: any;
  verify?: any;
  subType?: any;
}) => {
  const modal = useModal();
  const { SingleCourse } = useParams();

  const lock_after =
    "lock_after" in room ? room?.lock_after : room?.latest_room?.lock_after;

  return (
    <>
      <Accordion className="relative bg-white" type="single" collapsible>
        <AccordionItem
          isProfile={isProfile}
          value="item-1"
          className="bg-background"
        >
          <AccordionTrigger className="bg-white">
            <div className="flex w-full md:gap-6 gap-4 me-4">
              <Image
                className="w-[104px] rounded-lg  "
                src="/assets/grade-placeholder.png"
                alt=""
                width={104}
                height={104}
              />

              <div className="flex-1 w-full">
                <div className="pl-6">
                  <div className="flex  items-center justify-between w-full flex-wrap-reverse gap-y-2">
                    <h3 className="text-[18px] font-bold text-[#121212]">
                      {room?.title || room?.latest_room?.title}
                    </h3>

                    <div className="flex flex-col gap-2">
                      {subscribe &&
                        (lock_after == null || lock_after !== 0) && (
                          <RoomProgressBadge progress={room?.progress || 0} />
                        )}

                      {lock_after !== null && (
                        <div className="flex gap-[24px] text-sm font-bold ms-auto ">
                          {lock_after !== 0 ? (
                            <div
                              style={{
                                boxShadow:
                                  "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
                              }}
                              className=" hidden md:flex font-bold text-[#523412]  border border-gray-light text-[10px] items-center  gap-[4px] py-1 pr-px pl-[8px] rounded-[12px] bg-background"
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
                                  &nbsp; {Math.floor(lock_after / 24)}أيام
                                  &nbsp;
                                  {Math.floor(lock_after % 24)} ساعة{" "}
                                </p>
                              )}{" "}
                              {/* <p className="mr-1"> {lock_after % 24} دقيقة </p> */}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row ms-auto">
                              <div
                                aria-label="اشترك الآن فى هذه الحصة"
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  modal.setDialogContent(
                                    <PaymentModel
                                      roomId={room?.latest_room?.id || room?.id}
                                      centerId={SingleCourse || room.id}
                                      price={
                                        room?.price || room?.latest_room?.price
                                      }
                                    />
                                  );

                                  modal.openModal();
                                }}
                                className="w-[116px] rounded-lg h-[3 text-white border border-[#9D8242] bg-primary text-sm font-bold flex items-center justify-center"
                              >
                                اشترك الآن
                              </div>

                              <PriceBadge
                                price={room?.price || room?.latest_room?.price}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:my-4  my-3   bg-gray-light  h-px" />

                <h3 className="text-right text-sm text-gray-dark">
                  {room?.description || room?.latest_room?.description}
                </h3>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="mt-6">
              {(room?.locked_to_pass ||
                room?.latest_room?.locked_to_pass ||
                lock_after == 0) && (
                <div className="flex items-center gap-2 bg-background p-2 rounded-lg border border-gray-light">
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
              {(room?.latest_room?.quizzes || room?.quizzes) &&
                (room?.latest_room?.quizzes || room?.quizzes).map(
                  (quiz, index) => {
                    return (
                      <RoomDropDownQuiz
                        key={"quiz-" + quiz.id}
                        item={quiz}
                        room={room}
                        SingleCourse={SingleCourse}
                        subscribe={subscribe || room?.is_subscriped}
                        verify={verify || room?.parent_phone_verification}
                        locked={lock_after == 0}
                        linkText="فتح الامتحان"
                        type="exam"
                      />
                    );
                  }
                )}

              {(room?.latest_room?.lessons || room?.lessons)?.map(
                (lesson, index) => {
                  return (
                    <RoomRevision
                      key={index}
                      lesson={lesson}
                      subscribe={subscribe || room?.is_subscriped}
                      verify={verify || room?.parent_phone_verification}
                      roomId={room?.id}
                      latestRoomId={room?.latest_room?.id}
                      locked={
                        room?.locked_to_pass ||
                        room?.latest_room?.locked_to_pass ||
                        lock_after == 0
                      }
                    />
                  );
                }
              )}

              {(room?.attachments || room?.latest_room?.attachments) &&
                (room?.attachments || room?.latest_room?.attachments).map(
                  (attachment, index) => {
                    return (
                      <RoomFileDownloadLink
                        attachment={attachment}
                        room={room}
                        subscribe={subscribe || room?.is_subscriped}
                        disabled={room?.quizzes?.must_pass}
                        verify={verify || room?.parent_phone_verification}
                        lock_after={lock_after}
                        index={index}
                      />
                    );
                  }
                )}

              {(room?.latest_room?.assignments || room?.assignments) &&
                (room?.latest_room?.assignments || room?.assignments).map(
                  (ass, index) => {
                    return (
                      <RoomDropDownQuiz
                        key={"ass-" + ass.id}
                        item={ass}
                        room={room}
                        SingleCourse={SingleCourse}
                        subscribe={subscribe || room?.is_subscriped}
                        verify={verify || room?.parent_phone_verification}
                        locked={
                          room?.locked_to_pass ||
                          room?.latest_room?.locked_to_pass ||
                          lock_after == 0
                        }
                        linkText="فتح الواجب"
                        type="ass"
                      />
                    );
                  }
                )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Room;
