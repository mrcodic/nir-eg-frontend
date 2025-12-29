import CourseDetails from "@/components/CourseDetails";
import CourseFloatingCards from "@/components/CourseFloatingCards";
import CoursesHeader from "@/components/CoursesHeader";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { getServerData } from "@/helpers/server-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { ICourseDetails } from "@/types";
import { redirect } from "next/navigation";

const SingleCourse = async ({ params }) => {
  const { SingleCourse } = await params;

  const profileData = await getClientPrivateData({
    queryKey: [`/students/profile`],
  });

  const bundleRooms = await getServerData<{ body: ICourseDetails }>({
    queryKey: [`/students/get-rooms/${SingleCourse}?page=1&per_page=10`],
    isAuth: !!profileData,
  });

  if (profileData?.body?.has_center === false) {
    redirect("/profile");
  }

  console.log("🚀 ~ data singleCourse: ", bundleRooms);

  return (
    <ProtectedRoute
      // isLoading={isLoading}
      data={bundleRooms}
      subscribed={
        profileData?.body?.type == 3 ? bundleRooms?.body?.is_subscriped : true
      }
      verify={true}
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
