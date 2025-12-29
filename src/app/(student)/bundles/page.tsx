"use client";

import BundlesCom from "@/components/BundlesCom";
import LoadingSpinner from "@/components/Loading";
import NewCourses from "@/components/NewCoursers";
import SubbedCourses from "@/components/SubbedCourses";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BundlesPage = () => {
  const router = useRouter();
  const { token, profile, isLoading } = useAuthContext();

  useEffect(() => {
    console.log("effect");
    if (!profile || profile?.type !== 3) return;

    if (profile?.has_center == false) {
      router.push("/profile");
    } else {
      router.push(`/bundles/${profile?.center_id}`);
    }
  }, [profile, router]);

  if (typeof window === "undefined" || isLoading || profile?.type === 3) {
    return (
      <div className="mt-[120px] mb-12 flex grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] md:space-y-[100px]">
      <BundlesCom />
      {token && <SubbedCourses />}
      <NewCourses />
    </div>
  );
};
export default BundlesPage;
