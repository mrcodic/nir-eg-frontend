"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/Loading";
import { StudentSelectCenter } from "@/components/modals/StudentSelectCenter";
import Room from "@/components/Room";
import RoomHeader from "@/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import StudentTasksOverview from "@/modules/profile/components/StudentTasksOverview";
import { IUser } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

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
    iconSrc: "/assets/Star.svg",
  },
  {
    id: 4,
    title: "ترتيب الطلاب",
    iconSrc: "/assets/RankColor.svg",
  },
];

const ProfilePage = () => {
  const { grade } = useAuthContext();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getDataClient,
  });

  const { data: profileData } = useQuery({
    queryKey: ["/students/profile"],
    queryFn: getDataClient as () => Promise<{ body: IUser }>,
  });

  const [isModal, setIsModal] = useState(true);

  return (
    <div className="mb-12 mt-[140px]">
      <div className="wrapper">
        <ProfileHeaderCard profileData={profileData?.body} />

        <StudentTasksOverview />

        {/* profile latest rooms */}
        <div className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />

          {/* {isNewUser && (
            <div className="mt-[32px] flex flex-col items-center justify-center gap-[32px]">
              <img src="/assets/BoxColor.svg" className="w-[120px] h-[120px]" />
              <p className="text-gray-dark text-[24px] font-medium">
                لم تشترك في أي باقة بعد
              </p>
              <Link
                href={"/bundles"}
                className="bg-[#012D5A] text-center flex justify-center items-center text-[18px] font-bold h-[40px] w-[364px] border border-[#9D8242] rounded-lg text-[#FFFFFF]"
              >
                اذهب للباقات
              </Link>
            </div>
          )} */}

          {!isLoadingRooms ? (
            <div className="mt-[32px]">
              {rooms?.body?.length > 0 ? (
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
                  <Empty text="لم تشترك في أي باقة بعد" />
                  <Link
                    href={`/bundles?grade=${grade}`}
                    className="bg-[#012D5A] w-[368px] py-2 rounded-[10px] text-white text-center font-bold text-[18px] border border-[#9D8242]"
                  >
                    اذهب للباقات
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Empty text="لم يتم إضافة حصص بعد" />
                </div>
              )}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>

        {/* <div className="mt-[96px]">
          <RoomHeader icon={"/assets/Star.svg"} title={"النقاط"} />

          <ProfilePointsTable />
        </div> */}
      </div>

      {profileData?.body?.type === 3 && !profileData?.body?.has_center && (
        <StudentSelectCenter open={isModal} setOpen={setIsModal} />
      )}
    </div>
  );
};
export default ProfilePage;
