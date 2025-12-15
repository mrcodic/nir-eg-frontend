"use client";

import BundlesCom from "@/components/BundlesCom";
import Courses from "@/components/Courses";
import LoadingSpinner from "@/components/Loading";
import NewCourses from "@/components/NewCoursers";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BundlesPage = () => {
  const router = useRouter();
  const { token, profile, isLoading } = useAuthContext();

  // const grade = searchParams.get("grade");

  // useEffect(() => {
  //   const html = document.documentElement;
  //   html.classList.remove("grade3", "grade2"); // clear all first
  //   if (typeof window == "undefined" || !grade) return;
  //   if (grade == "2") {
  //     html.classList.add("grade2");
  //   } else if (grade == "3") {
  //     html.classList.add("grade3");
  //   }
  // }, [grade]);

  useEffect(() => {
    if (!profile || profile?.type !== 3) return;

    if (profile?.has_center == false) {
      router.push("/profile");
    } else {
      router.push(`/bundles/${profile?.center_id}`);
    }
  }, [profile, router]);

  if (isLoading || profile?.type === 3) {
    return (
      <div className="mb-12 mt-[120px] grow flex items-center justify-center ">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mb-12 grow mt-[120px] ">
      <BundlesCom />
      {token && <Courses />}
      <NewCourses />
    </div>
  );
};
export default BundlesPage;
