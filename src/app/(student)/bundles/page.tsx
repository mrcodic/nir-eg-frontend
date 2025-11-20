"use client";

import BundlesCom from "@/components/BundlesCom";
import Courses from "@/components/Courses";
import NewCourses from "@/components/NewCoursers";
import { useAuthContext } from "@/context/auth-context";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const BundlesWrapper = () => {
  const searchParams = useSearchParams();
  const grade = searchParams.get("grade");
  const { token } = useAuthContext();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("grade3", "grade2"); // clear all first
    if (typeof window == "undefined" || !grade) return;
    if (grade == "2") {
      html.classList.add("grade2");
    } else if (grade == "3") {
      html.classList.add("grade3");
    }
  }, [grade]);

  return (
    <div className="mb-12 mt-[120px] ">
      <BundlesCom />
      {token && <Courses />}
      <NewCourses />
    </div>
  );
};
export default BundlesWrapper;
