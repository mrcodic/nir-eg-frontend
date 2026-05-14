import BundlesWrapper from "@/modules/bundles/components/BundlesWrapper";
import NewCourses from "@/modules/courses/components/NewCoursers";
import { getServerData } from "@/helpers/server-fetch";
import { ApiResponse, IUser } from "@/types";
import { redirect } from "next/navigation";

const BundlesPage = async () => {
  const profileData = await getServerData<ApiResponse<IUser | null>>({
    queryKey: [`/students/profile`],
  });

  const profile = profileData?.body;
  const isCenterUser = profile?.type === 3;

  if (isCenterUser && !profile?.has_center) redirect("/profile");
  if (isCenterUser && profile?.has_center)
    redirect(`/bundles/${profile?.center_id}`);

  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] group-data-[template=landing-v3]/template:mt-[140px] md:space-y-[100px]">
      <BundlesWrapper profile={profile} />
      <NewCourses />
    </div>
  );
};
export default BundlesPage;
