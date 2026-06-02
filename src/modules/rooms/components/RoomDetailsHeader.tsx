"use client";

import RoomProgressBadge from "@/components/cards/RoomProgressBadge";
import { PaymentModel } from "@/components/modals/PaymentModel";
import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import SubbedBadge from "@/components/ui/SubbedBadge";
import { useModal } from "@/context/ModalProvider";
import CourseInfoBadge from "@/modules/courses/components/CourseInfoBadge";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { IRoomData, IRoomDetails } from "@/types";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

function formatRoomDate(value?: string) {
  if (!value) return "--";

  const date = DateTime.fromISO(value);
  if (!date.isValid) return value;

  return date.toFormat("dd/MM/yyyy");
}

export default function RoomDetailsHeader({
  room,
  data,
  classroomId,
  isRoomPurchasable,
  isRoomPurchased,
}: {
  room: IRoomData;
  data: IRoomDetails;
  classroomId: string;
  isRoomPurchasable: boolean;
  isRoomPurchased: boolean;
}) {
  const { lessons, quizzes, assignments, attachments } = data;
  const modal = useModal();

  return (
    <div className="bg-primary-radial relative">
      <div
        className="bg-primary-800 absolute inset-0 z-1"
        style={{
          maskImage: "url(/assets/bg/bg.png)",
          maskRepeat: "no-repeat",
          maskSize: "contain",
        }}
      />

      <div className="wrapper relative z-2 pt-12 pb-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex grow flex-wrap gap-2 md:max-w-[70%] md:justify-start md:gap-6">
            <CourseInfoBadge
              value={lessons?.length}
              text="فيديو"
              icon="/assets/videos-fill.svg"
            />
            <CourseInfoBadge
              value={quizzes?.length}
              text="امتحان"
              icon="/assets/icons/exam-fill.svg"
            />
            <CourseInfoBadge
              value={assignments?.length}
              text="واجب"
              icon="/assets/assignment-fill.svg"
            />
            <CourseInfoBadge
              value={attachments?.length}
              text="ملف"
              icon="/assets/files-fill.svg"
            />
          </div>

          <div className="flex flex-col items-start gap-3">
            {data?.is_subscriped || (!isRoomPurchasable && isRoomPurchased) ? (
              <SubbedBadge />
            ) : null}

            <div className="ms-auto flex flex-col gap-2">
              {data?.is_subscriped &&
                (data?.lock_after == null ||
                  Number(data?.lock_after) !== 0) && (
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

            <Link
              href={`/bundles/${classroomId}`}
              className="border-secondary text-secondary hover:bg-secondary rounded-lg border px-4 py-2 text-sm font-bold transition-colors hover:text-white"
            >
              العودة للكورس
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-start justify-between gap-4">
          <div className="flex items-center gap-6">
            <CustomImage
              src={room?.thumbnail}
              width={72}
              height={72}
              fallback={"/assets/grade-placeholder.png"}
              alt={room?.title}
              className="size-18 rounded-xl"
            />
            <h1 className="text-2xl font-bold text-white">
              {room?.title || "--"}
            </h1>
          </div>
        </div>

        <div className="bg-gray-light my-4 h-px w-full" />

        <div className="flex flex-wrap gap-8">
          <DataWithLabel
            className="gap-1"
            label="اسم الحصة"
            data={room?.title || "--"}
            labelClassName="text-xs text-gray-light"
            dataClassName="text-sm text-white"
            icon={
              <Image
                src="/assets/videos-fill.svg"
                width={20}
                height={20}
                className="size-5"
                alt="lesson"
              />
            }
          />

          {/* <DataWithLabel
            className="gap-1"
            label="مدة الكورس"
            data={room?.duration || "--"}
            labelClassName="text-xs text-gray-light"
            dataClassName="text-sm text-white"
            icon={
              <Image
                src="/assets/time.svg"
                width={20}
                height={20}
                className="size-5"
                alt="time"
              />
            }
          /> */}

          <DataWithLabel
            className="gap-1"
            label="تاريخ الإضافة"
            data={formatRoomDate(room?.created_at)}
            labelClassName="text-xs text-gray-light"
            dataClassName="text-sm text-white"
            icon={
              <Image
                src="/assets/calendar.svg"
                width={20}
                height={20}
                className="size-5"
                alt="calendar"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
