"use client";

import CustomImage from "@/components/ui/CustomImage";
import { useModal } from "@/context/ModalProvider";
import { IUser } from "@/types";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import ProfileCoupon from "./ProfileCoupon";
import ProfileGradeCard from "./ProfileGradeCard";
import StudentPointsCard from "./StudentPointsCard";
import { useTenant } from "@/context/TenantProvider";

const StudentSelectCenterModal = dynamic(async () =>
  import("@/components/modals/StudentSelectCenterModal").then(
    (mod) => mod.StudentSelectCenterModal,
  ),
);

function ProfileHeaderCard({ profileData }: { profileData: IUser }) {
  const modal = useModal();
  const { features } = useTenant();

  const hasPointsEnabled = features.points_system;
  const hasPromoCode = features.promo_code;

  // if (isLoadingProfile)
  //   return <Skeleton className="min-h-[325px] rounded-xl md:min-h-[290px]" />;

  return (
    <motion.div
      className="bg-background relative rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
        <div className="flex gap-2">
          <div className="flex flex-wrap items-center gap-6">
            <CustomImage
              src={profileData?.avatar || "/assets/avatar-user.svg"}
              fallback="/assets/avatar-user.svg"
              className="h-12 w-12 rounded-full"
              alt="avatar"
            />

            <h3 className="text-lg font-bold text-[#523412] md:text-2xl">
              {(profileData?.first_name.substring(0, 10) || "--") +
                " " +
                (profileData?.last_name.substring(0, 10) || "--")}
            </h3>
          </div>

          {/* crown */}
          {/* <div className="flex w-full gap-6 items-center">
                        <DotLottieReact
                          className="w-[48px] h-[48px] mx-auto"
                          src="/Animations/crown.lottie"
                          autoplay
                          loop
                        />
                      </div> */}
        </div>

        <div className="flex flex-col items-center justify-end gap-x-4 gap-y-8 p-2 sm:flex-row">
          {profileData?.grade_name && (
            <ProfileGradeCard text={profileData?.grade_name} />
          )}

          {profileData?.id && profileData?.type === 3 && (
            <QRCodeSVG
              value={String(profileData?.id)}
              size={56}
              bgColor="#ffffff"
              fgColor="#000000"
              className="shrink-0 max-sm:mx-auto max-sm:size-24"
            />
          )}
        </div>
      </div>

      {/* <div className="h-px bg-gray-light my-6" /> */}

      <div className="border-gray-light mt-6 flex w-full flex-col gap-4 border-t pt-6 empty:mt-0 empty:hidden empty:border-0 empty:pt-0 max-xl:flex-wrap md:flex-row">
        {/* <StudentRankCard /> */}

        {hasPointsEnabled && (
          <StudentPointsCard points={profileData?.points || 0} />
        )}

        {hasPromoCode && <ProfileCoupon />}
      </div>

      {profileData?.type === 3 &&
        (profileData?.has_center ? (
          <Link
            href={`/bundles/${profileData?.center_id}`}
            className="bg-secondary group absolute -bottom-8 left-1/2 flex w-[242px] -translate-x-1/2 items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-white md:-bottom-7"
          >
            <span>اذهب للسنتر</span>
            <ChevronLeft className="transition-all duration-300 group-hover:-translate-x-2" />
          </Link>
        ) : (
          <button
            onClick={() => {
              modal.setDialogContent(<StudentSelectCenterModal />);
              modal.openModal();
            }}
            className="bg-secondary group absolute -bottom-8 left-1/2 flex w-[242px] -translate-x-1/2 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-white md:-bottom-7"
          >
            <span>اشترك في سنتر</span>
            <ChevronLeft className="transition-all duration-300 group-hover:-translate-x-2" />
          </button>
        ))}
    </motion.div>
  );
}

export default ProfileHeaderCard;
