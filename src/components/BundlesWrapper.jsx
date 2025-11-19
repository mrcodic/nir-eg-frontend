"use client";

import { useAuthContext } from "@/context/auth-context";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import BundlesCom from "./BundlesCom";
import Courses from "./Courses";
import NewCourses from "./NewCoursers";

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
    <>
      <BundlesCom />
      {token && <Courses />}
      <NewCourses />
    </>
  );
};
export default BundlesWrapper;
