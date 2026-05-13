"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { StudentSelectCenterModal } from "@/components/modals/StudentSelectCenterModal";

import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useTenant } from "@/context/TenantProvider";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfileRoomsWrapper from "@/modules/profile/components/ProfileRoomsWrapper";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";

const ProfilePointsTable = dynamic(
  () => import("@/modules/profile/components/ProfilePointsTable"),
);

const StudentTasksOverview = dynamic(
  () => import("@/modules/profile/components/StudentTasksOverview"),
);

// const ProfileVerifyPhoneCard = dynamic(
//   () => import("@/modules/profile/components/ProfileVerifyPhoneCard"),
// );

const ProfilePage = () => {
  const { profile, isLoading } = useAuthContext();
  const { features } = useTenant();

  const modal = useModal();
  const centerModalShown = useRef(false);

  useEffect(() => {
    if (centerModalShown.current) return;
    if (profile?.type === 3 && !profile?.has_center) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
      centerModalShown.current = true;
    }
  }, [profile, modal]);

  const hasPointsEnabled = features?.points_system;
  const hasQuizzesEnabled = features?.quizzes;

  // console.log("profile rooms : ", rooms);

  return (
    <div className="mt-[140px] mb-12">
      <div className="wrapper">
        {/* <Suspense fallback={null}>
          {profile?.parent_phone_verification === false && (
            <ProfileVerifyPhoneCard phone={profile?.parent_phone} />
          )}
        </Suspense> */}

        <ProfileHeaderCard profileData={profile} isLoadingProfile={isLoading} />

        <Suspense fallback={<LoadingSpinner />}>
          {hasQuizzesEnabled && <StudentTasksOverview />}
        </Suspense>

        {/* profile latest rooms */}
        <div className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />

          <ProfileRoomsWrapper />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {hasPointsEnabled && (
            <div id="points-table" className="mt-24 scroll-mt-24">
              <RoomHeader icon={"/assets/star-colored.svg"} title={"النقاط"} />

              <ProfilePointsTable />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};
export default ProfilePage;
