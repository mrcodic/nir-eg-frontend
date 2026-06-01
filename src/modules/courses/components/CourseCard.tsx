"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import { Button } from "@/components/ui/button";
import DataWithLabel from "@/components/ui/DataWithLabel";
import PriceBubbles from "@/components/ui/price-bubble";
import SubbedBadge from "@/components/ui/SubbedBadge";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import SaleBubble from "@/modules/payment/components/sale-bubble";
import { CourseType } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

/* ----------------------------------------
 * Animation Variants (shared parent → child)
 * ---------------------------------------- */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.08,
    },
  },
};

const cardContentVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.3,
    },
  },
};

const CourseCard = ({
  courseDetails,
  isNewCourse = false,
  isBundles = false,
  isSubbed = false,
  standalone = false,
}: {
  courseDetails: CourseType;
  isNewCourse?: boolean;
  isBundles?: boolean;
  isSubbed?: boolean;
  standalone?: boolean;
}) => {
  const router = useRouter();
  const modal = useModal();

  const { profile } = useAuthContext();
  const isOnline = profile?.type === 4;

  const isCodeCenterRoomType =
    profile?.type === 5 && courseDetails?.subscription_type === "حصة";

  const isSingleButton =
    Number(
      isNewCourse && courseDetails?.subscription_type !== "حصة" && !isBundles,
    ) +
      Number(!isNewCourse) +
      Number(isNewCourse && !!profile) ===
    1;

  return (
    <motion.div
      className="group relative mx-auto flex h-full w-full max-w-[500px] flex-col items-center rounded-lg"
      variants={cardVariants}
      {...(standalone && {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-100px" },
      })}
    >
      {courseDetails?.has_promocode && isOnline && !isCodeCenterRoomType && (
        <SaleBubble className="absolute -top-2 -right-2 z-10" text="كوبون" />
      )}

      {/* ---------- Image Section ---------- */}
      <motion.div
        variants={cardVariants}
        className="bg-background relative flex h-[232px] w-full justify-center overflow-hidden rounded-lg"
      >
        <Image
          src={courseDetails?.thumbnail || "/assets/grade-placeholder.png"}
          className="object-cover transition-all group-hover:scale-110 group-hover:opacity-80"
          fill
          alt="course cover image"
          fetchPriority="high"
          loading="eager"
        />

        {!isCodeCenterRoomType && (
          <div className="absolute top-4 left-4">
            {isSubbed ? (
              <SubbedBadge />
            ) : (
              <PriceBubbles
                sale={courseDetails?.sale}
                price={courseDetails?.price}
                badgeClassName="bg-semantics-green-dark"
                currencyClassName="text-sm"
              />
            )}
          </div>
        )}
      </motion.div>

      {/* ---------- Content Section ---------- */}
      <motion.div
        variants={cardContentVariants}
        className="border-gray-light relative mt-4 w-full grow rounded-lg border bg-white p-2"
      >
        <div className="flex h-full flex-col gap-2">
          <div className="border-gray-light flex flex-col gap-4 border-b pb-2">
            <div className="flex flex-wrap-reverse justify-between">
              <h3 className="text-lg font-bold">{courseDetails.title}</h3>

              <span className="text-gray-dark ms-auto inline-block text-xs font-medium">
                {courseDetails?.grade?.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Image
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

          <p className="text-gray-dark inline-block text-xs font-medium empty:hidden">
            {courseDetails.description}
          </p>

          {/* ---------- Actions ---------- */}
          <div
            className={cn(
              "mt-auto grid grid-cols-1 gap-4 pt-4 min-[300px]:grid-cols-2",
              {
                "min-[300px]:grid-cols-1": isSingleButton,
              },
            )}
          >
            {isNewCourse &&
              courseDetails?.subscription_type !== "حصة" &&
              !isBundles && (
                <Button
                  onClick={() => {
                    if (!!profile) {
                      modal.setDialogContent(
                        <PaymentModel
                          courseId={courseDetails.id?.toString()}
                          price={Number(courseDetails.price)}
                          sale={courseDetails?.sale}
                          hasCoupon={courseDetails?.has_promocode}
                        />,
                      );
                      modal.openModal();
                    } else {
                      router.push(
                        `/login?redirect=/bundles/${courseDetails?.id}`,
                      );
                    }
                  }}
                >
                  اشترك الآن
                </Button>
              )}

            {!!profile && (
              <Link
                href={`/bundles/${courseDetails?.id}`}
                className="inline-block"
              >
                <Button variant="outline-primary" className="w-full">
                  الدخول للكورس
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CourseCard;
