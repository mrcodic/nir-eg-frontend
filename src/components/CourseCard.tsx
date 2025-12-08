"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import { CourseType } from "@/types";
import { mapGradeToText } from "@/utils/clientFun";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { PaymentModel } from "./modals/PaymentModel";
import { Button } from "./ui/button";
import DataWithLabel from "./ui/DataWithLabel";
import PriceBubbles from "./ui/price-bubble";
import SaleBubble from "./ui/sale-bubble";

const CourseCard = ({
  courseDetails,
  isNewCourse,
  isBundles,
}: {
  courseDetails: CourseType;
  isNewCourse: boolean;
  isBundles: boolean;
}) => {
  const router = useRouter();
  const modal = useModal();

  const { token, profile } = useAuthContext();
  const isOnline = profile?.type === 4;

  return (
    <div className=" flex relative group w-full flex-col items-center rounded-lg h-full ">
      {courseDetails?.has_promocode && isOnline && (
        <SaleBubble className="absolute -top-2 -right-2 z-10" text={"كوبون"} />
      )}

      <div className="h-[232px] bg-background flex justify-center w-full rounded-lg overflow-hidden relative">
        <Image
          src={courseDetails?.thumbnail || "/assets/grade-placeholder.png"}
          className="group-hover:scale-110 transition-all group-hover:opacity-80 object-contain"
          fill
          alt="course cover image"
        />

        <div className="absolute left-4 top-4">
          <PriceBubbles
            sale={courseDetails?.sale}
            price={courseDetails?.price}
            badgeClassName="bg-semantics-green-dark"
            currencyClassName="text-sm"
          />
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className={`relative p-2 mt-4  grow rounded-lg bg-white w-full  border  border-gray-light`}
      >
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-4 pb-2 border-b border-gray-light">
            <div className="flex justify-between flex-wrap-reverse">
              <h3 className=" font-bold text-lg">{courseDetails.title}</h3>

              <span className="text-gray-dark font-medium text-xs inline-block ms-auto">
                {mapGradeToText(courseDetails?.grade?.id)}
              </span>
            </div>

            <div className="flex gap-2 items-center ">
              <Image
                className=""
                width={24}
                height={24}
                alt="calendar icon"
                src="/assets/calendar.svg"
              />

              <DataWithLabel
                className="gap-1"
                label="تاريخ الاضافة"
                data={courseDetails?.created_at?.split(" ")?.[0]}
                labelClassName="text-xs text-gray-dark"
                dataClassName="text-sm"
              />
            </div>
          </div>

          <p className="text-gray-dark empty:hidden font-medium text-xs inline-block">
            {courseDetails.description}
          </p>

          <div
            className={cn(" mt-auto pt-4 gap-4 grid grid-cols-2", {
              // "mt-0": isNewCourse && courseDetails?.subscription_type !== "حصة",
            })}
          >
            {isNewCourse &&
              courseDetails?.subscription_type !== "حصة" &&
              !isBundles && (
                <Button
                  onClick={() => {
                    if (token) {
                      modal.setDialogContent(
                        <PaymentModel
                          courseId={courseDetails.id?.toString()}
                          price={Number(courseDetails.price)}
                          sale={courseDetails?.sale}
                          hasCoupon={courseDetails?.has_promocode}
                        />
                      );

                      modal.openModal();
                    } else {
                      router.push(
                        `/login?redirect=/bundles/${courseDetails?.id}`
                      );
                    }
                  }}
                >
                  اشترك الآن
                </Button>
              )}

            {!isNewCourse && (
              <Button
                onClick={() => router.push(`/bundles/${courseDetails?.id}`)}
              >
                عرض المحتوى
              </Button>
            )}

            {isNewCourse && token && (
              <Link
                href={`/bundles/${courseDetails?.id}`}
                className="inline-block"
              >
                <Button variant="secondary" className="w-full">
                  الدخول للكورس
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* {true && <Congrats open={true} setOpen={setOpen} />} */}
    </div>
  );
};
export default CourseCard;
