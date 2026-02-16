"use client";

import { useMemo, useState } from "react";
import RoomAccordion from "@/components/RoomAccordion";
import { ApiResponse, LatestRoom } from "@/types";
import { Link } from "lucide-react";
import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantProvider";

const VISIBLE_ROOMS_COUNT = 3;

function ProfileRoomsWrapper() {
  const { profile } = useAuthContext();
  const [showAll, setShowAll] = useState(false);
  const { features } = useTenant();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery<
    ApiResponse<LatestRoom[]>
  >({
    queryKey: ["/students/profile/latest_classes"],
    queryFn: getClientPrivateData,
  });

  const hasMore = rooms?.body?.length > VISIBLE_ROOMS_COUNT;

  const visibleRooms = useMemo(() => {
    if (showAll) return rooms?.body;
    return rooms?.body.slice(0, VISIBLE_ROOMS_COUNT);
  }, [rooms?.body, showAll]);

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

          {hasMore && (
            <Button
              variant="outline"
              className="mx-auto mt-2 w-fit"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "عرض أقل" : "عرض المزيد"}
            </Button>
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
