import CourseDetails from "@/components/CourseDetails";
import CourseFloatingCards from "@/components/CourseFloatingCards";
import CoursesHeader from "@/components/CoursesHeader";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { getData } from "@/utils/api";

const SingleCourse = async ({ params }) => {
  const { SingleCourse } = await params;
  const profile = await getData({
    queryKey: [`/students/profile`],
  });
  const data = await getData({
    queryKey: [`/students/get-rooms/${SingleCourse}?page=1&per_page=10`],
  });

  console.log("🚀 ~ data singleCourse: ", data);

  return (
    <ProtectedRoute
      // isLoading={isLoading}
      data={data}
      subscribed={profile?.body?.type == 3 ? data?.body?.is_subscriped : true}
      verify={true}
    >
      <div className="mt-[80px]">
        <CoursesHeader body={data?.body} />

        <CourseFloatingCards
          SingleCourse={SingleCourse}
          data={data}
          profile={profile?.body}
        />

        <CourseDetails body={data?.body} profileData={profile} />
      </div>
    </ProtectedRoute>
  );
};
export default SingleCourse;
