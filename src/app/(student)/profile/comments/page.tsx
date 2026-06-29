import { getServerData } from "@/helpers/fetchers/server-fetch";
import { getTenantSettingsServer } from "@/services/tenant.service";
import { ApiResponse, IUser } from "@/types";
import { redirect } from "next/navigation";
import CommentsView from "./CommentsView";

export default async function CommentsPage() {
  const [profileData, tenantSettings] = await Promise.all([
    getServerData<ApiResponse<IUser | null>>({
      queryKey: ["/students/profile"],
    }),
    getTenantSettingsServer(),
  ]);

  const profile = profileData?.body;
  const isCenterStudent = profile?.type === 3;
  const hasCommunityEnabled = tenantSettings?.features?.community_system;

  if (isCenterStudent || !hasCommunityEnabled) {
    redirect("/profile");
  }

  return <CommentsView />;
}
