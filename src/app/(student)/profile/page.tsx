import LoadingSpinner from "@/components/shared/LoadingSpinner";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import ProfileHeaderCard from "@/modules/profile/components/ProfileHeaderCard";
import ProfileRoomsWrapper from "@/modules/profile/components/ProfileRoomsWrapper";
import { getServerData } from "@/helpers/server-fetch";
import { getTenantSettingsServer } from "@/services/tenantServices";
import { ApiResponse, IUser } from "@/types";
import { Suspense } from "react";
import dynamic from "next/dynamic";
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

        <ProfileHeaderCard profileData={profile} />

        <Suspense fallback={<LoadingSpinner />}>
          {hasQuizzesEnabled && <StudentTasksOverview />}
        </Suspense>

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
}
