import { IUser } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import GradeCard from "./GradeCard";
import ProfileCoupon from "./ProfileCoupon";
import StudentPointsCard from "./StudentPointsCard";
import StudentRankCard from "./StudentRankCard";

function ProfileHeaderCard({ profileData }: { profileData: IUser }) {
  return (
    <motion.div
      className="bg-background relative rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row  justify-between gap-4 items-center">
        <div className="flex  gap-2">
          <div className="flex flex-wrap  items-center gap-6">
            <img
              className="w-12 h-12 rounded-full"
              src={profileData?.avatar || "/assets/avatar-user.svg"}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
            />
            <h3 className="text-[#523412] font-bold text-lg md:text-2xl">
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

        <div className="flex gap-8  items-center justify-end flex-wrap p-2 md:p-5">
          <GradeCard
            text={profileData?.grade_name}
            grade={profileData?.grade}
          />

          {profileData?.id && profileData?.type === 3 && (
            <QRCodeSVG
              value={String(profileData?.id)}
              size={100}
              bgColor="#ffffff"
              fgColor="#000000"
              className="max-md:mx-auto"
            />
          )}
        </div>
      </div>

      {/* <div className="h-px bg-gray-light my-6" /> */}

      <div className="flex flex-col md:flex-row w-full pt-6 mt-6 border-t border-gray-light empty:border-0 empty:pt-0 empty:mt-0  gap-4 max-lg:flex-wrap">
        <StudentRankCard />

        <StudentPointsCard points={profileData?.points || 0} />

        <ProfileCoupon />
      </div>

      {profileData?.type === 3 && profileData?.has_center && (
        <Link
          href={`/bundles/${profileData?.center_id}`}
          className="bg-primary-800 flex justify-center items-center gap-2 py-2.5 font-bold text-white border border-[#9D8242] rounded-[10px] absolute -bottom-8 md:-bottom-7 left-[15%] md:left-[42.5%] w-[242px]"
        >
          <span>اذهب للسنتر</span>
          <img className="w-5 h-5" src="/assets/LeftArrowColor.svg" />
        </Link>
      )}
    </motion.div>
  );
}

export default ProfileHeaderCard;
