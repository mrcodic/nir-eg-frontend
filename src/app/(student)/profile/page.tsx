"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StudentSelectCenterModal } from "@/components/modals/StudentSelectCenterModal";

import RoomAccordion from "@/components/RoomAccordion";
import RoomHeader from "@/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfilePointsTable from "@/modules/profile/components/ProfilePointsTable";
import StudentTasksOverview from "@/modules/profile/components/StudentTasksOverview";
import { ApiResponse, LatestRoom } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";

const ProfileVerifyPhoneCard = dynamic(
  () => import("@/modules/profile/components/ProfileVerifyPhoneCard"),
);

const ProfilePage = () => {
  const { profile } = useAuthContext();

  const modal = useModal();
  const modalShown = useRef(false);

  const { data: rooms, isLoading: isLoadingRooms } = useQuery<
    ApiResponse<LatestRoom[]>
  >({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getClientPrivateData,
  });

  useEffect(() => {
    if (modalShown.current) return;
    if (profile?.type === 3 && !profile?.has_center) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
      modalShown.current = true;
    }
  }, [profile, modal]);

  console.log("profile rooms : ", rooms);

  return (
    <div className="mt-[140px] mb-12">
      <div className="wrapper">
        <Suspense fallback={null}>
          {profile?.parent_phone_verification === false && (
            <ProfileVerifyPhoneCard phone={profile?.parent_phone} />
          )}
        </Suspense>

        <ProfileHeaderCard profileData={profile} />

        <StudentTasksOverview />

        {/* profile latest rooms */}
        <div className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />

          {!isLoadingRooms ? (
            <div className="mt-8">
              {rooms && rooms?.body?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {rooms?.body?.map((room) => {
                    return (
                      <RoomAccordion
                        key={room?.id}
                        isProfile={true}
                        room={room?.latest_room}
                        verify={profile?.parent_phone_verification}
                        subscribe={room?.is_subscriped}
                        courseName={room?.classroom}
                      />
                    );
                  })}
                </div>
              ) : profile?.type === 4 ? (
                <div className="flex flex-col items-center justify-center">
                  <Empty
                    text="لم تشترك في أي باقة بعد"
                    icon="/assets/bg/illustration-empty-students.svg"
                  />
                  <Link
                    href={`/bundles`}
                    className="bg-primary-800 w-full max-w-[172px] rounded-lg py-2 text-center text-base font-bold text-white"
                  >
                    اذهب للباقات
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Empty
                    text="لم يتم إضافة حصص بعد"
                    icon="/assets/bg/illustration-empty-students.svg"
                  />
                </div>
              )}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>

        <div className="mt-24">
          <RoomHeader icon={"/assets/star-colored.svg"} title={"النقاط"} />

          <ProfilePointsTable />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
