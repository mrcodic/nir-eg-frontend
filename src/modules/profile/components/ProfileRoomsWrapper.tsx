"use client";

import { useMemo, useState } from "react";
import RoomAccordion from "@/modules/rooms/components/RoomAccordion";
import { ApiResponse, LatestRoom } from "@/types";
import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantProvider";
import Link from "next/link";

const VISIBLE_ROOMS_COUNT = 3;

function ProfileRoomsWrapper() {
  const { profile } = useAuthContext();
  const [visibleCount, setVisibleCount] = useState(VISIBLE_ROOMS_COUNT);
  const { features } = useTenant();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery<
    ApiResponse<LatestRoom[]>
  >({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getClientPrivateData,
  });

  const visibleRooms = useMemo(() => {
    return rooms?.body?.slice(0, visibleCount) || [];
  }, [rooms?.body, visibleCount]);

  const hasMore = (rooms?.body?.length || 0) > visibleCount;
  const canShowLess = visibleCount > VISIBLE_ROOMS_COUNT;

  if (isLoadingRooms) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8">
      {rooms?.body?.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visibleRooms.map((room) => (
            <RoomAccordion
              key={room.id}
              isProfile
              room={room.latest_room}
              verify={true || profile?.parent_phone_verification}
              subscribe={room.is_subscriped}
              courseName={room.classroom}
              classroomId={String(room?.id)}
              tasksEnabled={features?.quizzes}
            />
          ))}

          {(hasMore || canShowLess) && (
            <div className="mt-2 flex justify-center gap-4">
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={() => setVisibleCount((prev) => prev + VISIBLE_ROOMS_COUNT)}
                >
                  عرض المزيد
                </Button>
              )}
              {canShowLess && (
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={() => setVisibleCount(VISIBLE_ROOMS_COUNT)}
                >
                  عرض أقل
                </Button>
              )}
            </div>
          )}
        </div>
      ) : profile?.type === 4 ? (
        <div className="flex flex-col items-center justify-center">
          <Empty
            text="لم تشترك في أي كورس بعد"
            icon="/assets/bg/illustration-empty-students.svg"
          />
          <Link
            href="/bundles"
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
  );
}

export default ProfileRoomsWrapper;
