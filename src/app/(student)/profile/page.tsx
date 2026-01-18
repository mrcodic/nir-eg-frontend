"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StudentSelectCenterModal } from "@/components/modals/StudentSelectCenterModal";

import Room from "@/components/Room";
import RoomHeader from "@/components/RoomHeader";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfilePointsTable from "@/modules/profile/components/ProfilePointsTable";
import StudentTasksOverview from "@/modules/profile/components/StudentTasksOverview";
import { ApiResponse, IUser, LatestRoom } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";

const ProfileVerifyPhoneCard = dynamic(
  () => import("@/modules/profile/components/ProfileVerifyPhoneCard"),
);

const ProfilePage = () => {
  const modal = useModal();
  const modalShown = useRef(false);

  const { data: rooms, isLoading: isLoadingRooms } = useQuery<
    ApiResponse<LatestRoom[]>
  >({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getClientPrivateData,
  });

  const { data: profileData } = useQuery({
    queryKey: ["/students/profile"],
    queryFn: getClientPrivateData as () => Promise<{ body: IUser }>,
  });

  useEffect(() => {
    if (modalShown.current) return;
    if (profileData?.body?.type === 3 && !profileData?.body?.has_center) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
      modalShown.current = true;
    }
  }, [profileData, modal]);

  return (
    <div className="mt-[140px] mb-12">
      <div className="wrapper">
        <Suspense fallback={null}>
          {profileData?.body?.parent_phone_verification === false && (
            <ProfileVerifyPhoneCard phone={profileData?.body?.parent_phone} />
          )}
        </Suspense>

        <ProfileHeaderCard profileData={profileData?.body} />

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
                      <Room
                        key={room?.id}
                        isProfile={true}
                        room={room?.latest_room}
                        verify={true}
                        subscribe={room?.is_subscriped}
                      />
                    );
                  })}
                </div>
              ) : profileData?.body?.type === 4 ? (
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
