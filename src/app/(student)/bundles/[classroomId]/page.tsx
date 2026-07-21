import { Animate } from "@/components/shared/Animate";
import Empty from "@/components/shared/Empty";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import CourseDetails from "@/modules/courses/components/CourseDetails";
import CourseFloatingCards from "@/modules/courses/components/CourseFloatingCards";
import CoursesHeader from "@/modules/courses/components/CoursesHeader";
import { ICourseDetails } from "@/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "تفاصيل الباقة",
  description: "استعرض تفاصيل الباقة  والدروس والمحتوى المتاح لك.",
};

const classroomId = async ({ params }) => {
  const { classroomId } = await params;

  const profileData = await getServerData({
    queryKey: [`/students/profile`],
  });

  if (profileData?.body?.type == 3 && profileData?.body?.has_center === false) {
    redirect("/profile");
  }

  const bundleRooms = await getServerData<{ body: ICourseDetails }>({
    queryKey: [`/students/get-rooms/${classroomId}?page=1&per_page=10`],
    isAuth: !!profileData,
  });

  // console.log("bundleRooms -> ", bundleRooms);

  if (!bundleRooms) {
    return <Empty isPageError text="لم يتم العثور على هذا الكورس" />;
  }

  return (
    <ProtectedRoute
      data={bundleRooms}
      subscribed={
        profileData?.body?.type == 3 ? bundleRooms?.body?.is_subscriped : true
      }
      verifyPhone={false}
    >
      <div className="">
        <Animate preset="slideDown">
          <CoursesHeader details={bundleRooms?.body} />
        </Animate>

        <Animate preset="fadeIn" delay={0.2}>
          <CourseFloatingCards
            classroomId={classroomId}
            data={bundleRooms}
            profile={profileData?.body}
          />
        </Animate>

        <Animate preset="slideUp" delay={0.4}>
          <CourseDetails
            details={bundleRooms?.body}
            profile={profileData?.body}
          />
        </Animate>
      </div>
    </ProtectedRoute>
  );
};
export default classroomId;
