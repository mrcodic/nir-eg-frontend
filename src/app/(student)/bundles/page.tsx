import { getServerData } from "@/helpers/fetchers/server-fetch";
import BundlesWrapper from "@/modules/bundles/components/BundlesWrapper";
import BundlesWrapperSkeleton from "@/modules/bundles/components/BundlesWrapperSkeleton";
import NewCourses from "@/modules/courses/components/NewCoursers";
import { ApiResponse, IUser } from "@/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const BundlesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    grade?: string;
    page?: string;
    bundlesPage?: string;
  }>;
}) => {
  const profileData = await getServerData<ApiResponse<IUser | null>>({
    queryKey: [`/students/profile`],
  });

  const profile = profileData?.body;
  const isCenterUser = profile?.type === 3;

  if (isCenterUser && (!profile?.has_center || !profile?.center_id))
    redirect("/profile");
  if (isCenterUser && profile?.has_center && profile?.center_id)
    redirect(`/bundles/${profile?.center_id}`);

  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] group-data-[template=landing-v3]/template:mt-[140px] md:space-y-[100px]">
      <Suspense fallback={<BundlesWrapperSkeleton />}>
        <BundlesWrapper profile={profile} searchParams={searchParams} />
      </Suspense>

      <NewCourses profile={profile} searchParams={searchParams} />
    </div>
  );
};
export default BundlesPage;
