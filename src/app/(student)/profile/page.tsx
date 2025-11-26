"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/Loading";
import { StudentSelectCenter } from "@/components/modals/StudentSelectCenter";
import Room from "@/components/Room";
import RoomHeader from "@/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfilePointsTable from "@/modules/profile/components/ProfilePointsTable";
import StudentTasksOverview from "@/modules/profile/components/StudentTasksOverview";
import { IUser } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";

const Tabs = [
  {
    id: 1,
    title: "الحصص",
    iconSrc: "/assets/RoomsColor.svg",
  },
  {
    id: 2,
    title: "الامتحانات",
    iconSrc: "/assets/ExamsColor.svg",
  },
  {
    id: 3,
    title: "الأنشطة",
    iconSrc: "/assets/star-colored.svg",
  },
  {
    id: 4,
    title: "ترتيب الطلاب",
    iconSrc: "/assets/RankColor.svg",
  },
];

const ProfilePage = () => {
  const { grade } = useAuthContext();
  const modal = useModal();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getDataClient,
  });

  const { data: profileData } = useQuery({
    queryKey: ["/students/profile"],
    queryFn: getDataClient as () => Promise<{ body: IUser }>,
  });

  useEffect(() => {
    if (profileData?.body?.type === 3 && !profileData?.body?.has_center) {
      modal.setDialogContent(<StudentSelectCenter />);
      modal.openModal();
    }
  }, [profileData]);

  return (
    <div className="mb-12 mt-[140px]">
      <div className="wrapper">
        <ProfileHeaderCard profileData={profileData?.body} />

        <StudentTasksOverview />

        {/* profile latest rooms */}
        <div className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />

          {!isLoadingRooms ? (
            <div className="mt-8">
              {rooms?.body?.length > 100 ? (
                <div className="flex flex-col gap-4">
                  {rooms?.body?.map((room) => {
                    return (
                      <Room
                        key={room?.id}
                        isProfile={true}
                        room={room}
                        verify={true}
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
                    href={`/bundles?grade=${grade}`}
                    className="bg-primary-800 w-full max-w-[172px] py-2 rounded-lg text-white text-center font-bold text-base  "
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
