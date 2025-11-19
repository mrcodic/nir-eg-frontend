"use client";

import AuthContext from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { CourseType } from "@/types";
import { mapGradeToText } from "@/utils/clientFun";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useContext, useState } from "react";
import { Congrats } from "./modals/Congrats";
import { PaymentModel } from "./modals/PaymentModel";
import TopCourseStudentsBadges from "./TopCourseStudentsBadges";
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
  const [isSubscribeNow, setIsSubscribeNow] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { token, profile } = useContext(AuthContext);
  const isOnline = profile?.type === 4;

  return (
    <div className=" flex relative group w-full sm:max-w-[346.667px] flex-col items-center rounded-[8px] h-full ">
      <div className="h-[200px] bg-background flex justify-center w-full rounded-lg overflow-hidden ">
        <img
          src={courseDetails.thumbnail || "/assets/grade-placeholder.png"}
          className="group-hover:scale-110 transition-all group-hover:opacity-80"
        />

        {courseDetails?.has_promocode && isOnline && (
          <SaleBubble className="absolute -top-2 -right-2" text={"كوبون"} />
        )}
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
        className={`relative p-4 -top-2 grow rounded-[8px] bg-white w-[95%]    border  ${
          courseDetails?.discountPrice
            ? "border-[#1EAD7B]"
            : "border-primary-700"
        }`}
      >
        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between">
            <h3 className="text-[#121212] font-bold text-[14px]">
              {courseDetails.title}
            </h3>
            <span className="text-[#454545] font-medium text-[12px] inline-block">
              {mapGradeToText(courseDetails?.grade?.id)}
            </span>
          </div>

          <div className="h-px  w-full bg-primary-700" />

          {courseDetails?.sale?.id && (
            <SaleBubble
              discountType={courseDetails.sale?.discount_type}
              discountValue={courseDetails.sale?.discount_value}
            />
          )}

          <div>
            <span className="text-[#454545] empty:hidden font-medium text-[12px] inline-block">
              {courseDetails.description}
            </span>

            {courseDetails?.top_3?.length > 0 && (
              <TopCourseStudentsBadges students={courseDetails.top_3} />
            )}
          </div>

          {isNewCourse && courseDetails?.subscription_type !== "حصة" && (
            <div className="flex flex-wrap-reverse gap-1 font-bold justify-between items-center mt-auto w-full pt-2">
              <div
                className={cn(
                  "flex w-fit justify-between gap-1 flex-wrap-reverse  items-center empty:hidden"
                )}
              >
                {!isBundles && (
                  <button
                    onClick={() => {
                      if (token) {
                        setIsSubscribeNow(true);
                      } else {
                        router.push("/login");
                      }
                    }}
                    className="bg-primary w-[120px] text-[12px] text-center flex items-center justify-center  py-2 border-2 border-primary-700 px-[24px] rounded-[10px] text-white"
                  >
                    اشترك الآن
                  </button>
                )}
              </div>

              <PriceBubbles
                sale={courseDetails?.sale}
                price={courseDetails?.price}
              />
            </div>
          )}

          <div
            className={cn(" mt-auto justify-between flex", {
              "mt-0": isNewCourse && courseDetails?.subscription_type !== "حصة",
            })}
          >
            {!isNewCourse && (
              <button
                onClick={() => router.push(`/bundles/${courseDetails?.id}`)}
                className="bg-primary font-bold text-[12px] text-center flex items-center justify-center  py-1 border-2 border-primary-700 px-[24px] rounded-[10px] text-white"
              >
                عرض المحتوى
              </button>
            )}

            {isNewCourse && token && (
              <Link
                // href={`bundles/${courseDetails.id}`}
                href={`/bundles/${courseDetails?.id}`}
                className="border-color-primary font-bold w-[120px] text-[12px] text-[#121212] text-center flex items-center justify-center py-1 border-2  px-[16px] rounded-[10px] "
              >
                الدخول للكورس
              </Link>
            )}

            <div className="flex justify-between flex-col items-center  font-medium gap-2 ">
              <div className="flex items-center text-[10px] text-[#523412] gap-2">
                <img className="w-[16px] h-[16px]" src="/assets/Update.svg" />
                <span>{courseDetails?.updated_at?.split(" ")?.[0]}</span>
              </div>
              <div className="flex items-center text-[10px] text-[#523412] gap-2">
                <img className="w-[16px] h-[16px]" src="/assets/create.svg" />
                <span>{courseDetails?.created_at?.split(" ")?.[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isSubscribeNow && (
        <PaymentModel
          open={isSubscribeNow}
          setOpen={setIsSubscribeNow}
          courseId={courseDetails.id?.toString()}
          price={Number(courseDetails.price)}
          sale={courseDetails?.sale}
          hasCoupon={courseDetails?.has_promocode}
        />
      )}
      {open && <Congrats open={open} setOpen={setOpen} />}
    </div>
  );
};
export default CourseCard;
