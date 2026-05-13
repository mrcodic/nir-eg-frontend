import CourseDetails from "@/modules/courses/components/CourseDetails";
import CourseFloatingCards from "@/modules/courses/components/CourseFloatingCards";
import CoursesHeader from "@/modules/courses/components/CoursesHeader";
import { getServerData } from "@/helpers/server-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { ICourseDetails } from "@/types";
import { redirect } from "next/navigation";

const SingleCourse = async ({ params }) => {
  const { SingleCourse } = await params;

  const profileData = await getServerData({
    queryKey: [`/students/profile`],
  });

  if (profileData?.body?.type == 3 && profileData?.body?.has_center === false) {
    redirect("/profile");
  }

  const bundleRooms = await getServerData<{ body: ICourseDetails }>({
    queryKey: [`/students/get-rooms/${SingleCourse}?page=1&per_page=10`],
    isAuth: !!profileData,
  });

  console.log("bundleRooms -> ", bundleRooms);

  return (
    <ProtectedRoute
      data={bundleRooms}
      subscribed={
        profileData?.body?.type == 3 ? bundleRooms?.body?.is_subscriped : true
      }
      verifyPhone={false}
    >
      <div className="">
        <CoursesHeader details={bundleRooms?.body} />

        <CourseFloatingCards
          SingleCourse={SingleCourse}
          data={bundleRooms}
          profile={profileData?.body}
        />

        <CourseDetails
          details={bundleRooms?.body}
          profile={profileData?.body}
        />
      </div>
    </ProtectedRoute>
  );
};
export default SingleCourse;
