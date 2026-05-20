import { Animate } from "@/components/shared/Animate";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getServerData } from "@/helpers/server-fetch";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfileRoomsWrapper from "@/modules/profile/components/ProfileRoomsWrapper";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { getTenantSettingsServer } from "@/services/tenant.service";
import { ApiResponse, IUser } from "@/types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import CenterSelectModalTrigger from "./CenterSelectModalTrigger";

const ProfilePointsTable = dynamic(
  () => import("@/modules/profile/components/ProfilePointsTable"),
);

const StudentTasksOverview = dynamic(
  () => import("@/modules/profile/components/StudentTasksOverview"),
);

export default async function ProfilePage() {
  const [profileData, tenantSettings] = await Promise.all([
    getServerData<ApiResponse<IUser | null>>({
      queryKey: ["/students/profile"],
    }),
    getTenantSettingsServer(),
  ]);

  const profile = profileData?.body;
  const hasPointsEnabled = tenantSettings?.features?.points_system;
  const hasQuizzesEnabled = tenantSettings?.features?.quizzes;

  return (
    <div className="mt-[140px] mb-12">
      <div className="wrapper">
        {/* Auto-opens center modal for center-type students without a center */}
        <CenterSelectModalTrigger profile={profile} />

        <Animate preset="slideDown">
          <ProfileHeaderCard profileData={profile} />
        </Animate>

        <Suspense fallback={<LoadingSpinner />}>
          {hasQuizzesEnabled && (
            <Animate preset="slideUp" delay={0.2}>
              <StudentTasksOverview />
            </Animate>
          )}
        </Suspense>

        <Animate preset="slideUp" delay={0.4} className="mt-24">
          <RoomHeader icon={"/assets/books-colored.svg"} title={"آخر الحصص"} />
          <ProfileRoomsWrapper />
        </Animate>

        <Suspense fallback={<LoadingSpinner />}>
          {hasPointsEnabled && (
            <Animate
              preset="slideUp"
              delay={0.6}
              id="points-table"
              className="mt-24 scroll-mt-24"
            >
              <RoomHeader icon={"/assets/star-colored.svg"} title={"النقاط"} />
              <ProfilePointsTable />
            </Animate>
          )}
        </Suspense>
      </div>
    </div>
  );
}
