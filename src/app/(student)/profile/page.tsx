"use client";

import { StudentSelectCenterModal } from "@/components/modals/StudentSelectCenterModal";

import RoomHeader from "@/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfilePointsTable from "@/modules/profile/components/ProfilePointsTable";
import ProfileRoomsWrapper from "@/modules/profile/components/ProfileRoomsWrapper";
import StudentTasksOverview from "@/modules/profile/components/StudentTasksOverview";
import { useEffect, useRef } from "react";

// const ProfileVerifyPhoneCard = dynamic(
//   () => import("@/modules/profile/components/ProfileVerifyPhoneCard"),
// );

const ProfilePage = () => {
  const { profile } = useAuthContext();

  const modal = useModal();
  const modalShown = useRef(false);

  useEffect(() => {
    if (modalShown.current) return;
    if (profile?.type === 3 && !profile?.has_center) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
      modalShown.current = true;
    }
  }, [profile, modal]);

  // console.log("profile rooms : ", rooms);

  return (
    <div className="mt-[140px] mb-12">
      <div className="wrapper">
        {/* <Suspense fallback={null}>
          {profile?.parent_phone_verification === false && (
            <ProfileVerifyPhoneCard phone={profile?.parent_phone} />
          )}
        </Suspense> */}

        <ProfileHeaderCard profileData={profile} />

        <StudentTasksOverview />

        {/* profile latest rooms */}
        <div className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />

          <ProfileRoomsWrapper />
        </div>

        <div id="points-table" className="mt-24 scroll-mt-24">
          <RoomHeader icon={"/assets/star-colored.svg"} title={"النقاط"} />

          <ProfilePointsTable />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
