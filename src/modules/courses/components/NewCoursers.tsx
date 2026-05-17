import MappingFun from "@/components/fetchers/MappingFunc";
import CourseSkeleton from "@/components/shared/CourseSkeleton";
import PaginationServer from "@/components/shared/PaginationServer";
import CourseCard from "@/modules/courses/components/CourseCard";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { CourseType, IUser } from "@/types";
import { Suspense } from "react";

const NewCourses = async ({
  profile,
  searchParams,
}: {
  profile: IUser;
  searchParams: Promise<{ grade?: string; page?: string }>;
}) => {
  const params = await searchParams;
  const page = params?.page ? Number(params?.page) : 1;

  let api = profile
    ? `/students/classrooms`
    : `/guest/classrooms/${params?.grade || 1}`;

  return (
    <div className="wrapper">
      <RoomHeader
        className=""
        title={
          profile?.grade_name ? `كورسات ${profile?.grade_name}` : "كورسات جديدة"
        }
        icon="/assets/gifs/book-gif.gif"
      />

      <div className="relative mt-6">
        <Suspense fallback={<CourseSkeleton />}>
          <MappingFun
            arraypath="data"
            queryKey={api}
            requireAuth={!!profile}
            endPointOptions={{
              next: {
                revalidate: 60 * 10,
              },
            }}
            render={(data: { data: CourseType[] }) => {
              const allCourses = data?.data || [];

              const pageSize = 6;
              const total = allCourses.length;
              const start = (page - 1) * pageSize;
              const end = start + pageSize;
              const currentCourses = allCourses.slice(start, end);

              return (
                <div className="cards-grid min-h-[455px] rounded-lg">
                  <>
                    {currentCourses.map((course: any, index: number) => (
                      <CourseCard
                        key={index}
                        isNewCourse={true}
                        courseDetails={course}
                      />
                    ))}
                    <div className="col-span-full w-full">
                      <PaginationServer
                        currentPage={page}
                        total={total}
                        pageSize={pageSize}
                        searchParams={params}
                      />
                    </div>
                  </>
                </div>
              );
            }}
            emptyProps={{
              className: "col-span-full",
              text: "لا يوجد كورسات جديدة",
            }}
            errorProps={{
              className: "col-span-full",
              text: "حدث خطاء ما اثناء عرض الكورسات ",
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};
export default NewCourses;
