"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import SubbedBadge from "@/components/ui/SubbedBadge";
import { useModal } from "@/context/ModalProvider";
import { formatApiDateShort } from "@/helpers/format-api-date";
import CourseInfoBadge from "@/modules/courses/components/CourseInfoBadge";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { IRoomDetails } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RoomDetailsHeader({
  data,
  classroomId,
  isRoomPurchasable,
  isRoomPurchased,
}: {
  data: IRoomDetails;
  classroomId: string;
  isRoomPurchasable: boolean;
  isRoomPurchased: boolean;
}) {
  const modal = useModal();
  const { lessons, quizzes, assignments, attachments, room } = data;

  return (
    <div className="bg-primary-radial relative group-data-[template=landing-v3]/template:pt-28">
      <div
        className="bg-primary-800/50 absolute inset-0 z-1"
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
              icon="/assets/icons/assignment-fill.svg"
            />
            <CourseInfoBadge
              value={attachments?.length}
              text="ملف"
              icon="/assets/files-fill.svg"
            />
          </div>

          <div className="flex flex-col items-start gap-3">
            {isRoomPurchasable && (
              <div className="ms-auto flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
                <div
                  aria-label="اشترك الآن فى هذه الحصة"
                  role="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center transition-colors"
                  onClick={(event) => {
                    event.stopPropagation();

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

            <Link
              href={`/bundles/${classroomId}`}
              className="border-secondary text-secondary hover:bg-secondary flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors hover:text-white"
            >
              العودة للكورس
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap-reverse items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <CustomImage
              src={room?.thumbnail}
              width={72}
              height={72}
              fallback="/assets/grade-placeholder.png"
              alt={room?.title}
              className="size-18 rounded-xl"
            />
            <h1 className="line-clamp-1 text-base font-bold text-white md:text-2xl">
              {room?.title || "--"}
            </h1>
          </div>

          {data?.is_subscriped || (!isRoomPurchasable && isRoomPurchased) ? (
            <SubbedBadge className="ms-auto" />
          ) : null}
        </div>

        <div className="bg-gray-light my-3 h-px w-full" />

        {room?.description && (
          <h3 className="text-gray-light mb-6 line-clamp-3 text-sm empty:hidden md:text-xl">
            {room?.description}
          </h3>
        )}

        <div className="flex flex-wrap gap-8">
          <DataWithLabel
            className="gap-1"
            label="اسم الحصة"
            data={room?.title || "--"}
            labelClassName="text-xs text-gray-light"
            dataClassName="text-sm text-white"
            icon={
              <div
                style={{
                  maskImage: 'url("/assets/videos-fill.svg")',
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                }}
                className="bg-primary-800 size-5"
              />
            }
          />

          <DataWithLabel
            className="gap-1"
            label="تاريخ الإضافة"
            data={formatApiDateShort(room?.created_at)}
            labelClassName="text-xs text-gray-light"
            dataClassName="text-sm text-white"
            icon={
              <div
                style={{
                  maskImage: 'url("/assets/calendar.svg")',
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                }}
                className="bg-primary-800 size-5"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
