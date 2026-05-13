"use client";

import BundlesWrapper from "@/modules/bundles/components/BundlesWrapper";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NewCourses from "@/modules/courses/components/NewCoursers";
import { useAuthContext } from "@/context/auth-context";
import { useMounted } from "@/hooks/useMounted";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BundlesPage = () => {
  const router = useRouter();
  const { profile, isLoading } = useAuthContext();
  const isMounted = useMounted();

  useEffect(() => {
    if (!profile || profile?.type !== 3) return;

    if (profile?.has_center == false) {
      router.push("/profile");
    } else {
      router.push(`/bundles/${profile?.center_id}`);
    }
  }, [profile, router]);

  if (!isMounted || isLoading || profile?.type === 3) {
    return (
      <div className="mt-[120px] mb-12 flex grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] group-data-[template=landing-v3]/template:mt-[140px] md:space-y-[100px]">
      <BundlesWrapper />
      {/* {!!profile && <SubbedCourses />} */}
      <NewCourses />
    </div>
  );
};
export default BundlesPage;
