"use client";

import { useAuthContext } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import MappingComp from "./MappingComp";
import PaginationComponent from "./Pagination";
import RoomHeader from "./RoomHeader";
import { Skeleton } from "./ui/skeleton";
import { CourseType } from "@/types";

const NewCourses = () => {
  const [page, setPage] = useState(1);
  const { token, grade } = useAuthContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const coursesGrade = searchParams.get("grade");

  useEffect(() => {
    if (!grade && !token) {
      router.replace(`/bundles?grade=1`);
    }
  }, [grade, router, token]);

  let api = token
    ? `/students/classrooms`
    : `/guest/classrooms/${coursesGrade || 1}`;

  return (
    <div className="wrapper">
      <RoomHeader
        className=""
        title={grade?.name ? `كورسات ${grade?.name}` : "كورسات جديدة"}
        icon="/assets/gifs/book-gif.gif"
      />

      <div className="relative mt-6">
        <MappingComp
          queryKey={api}
          render={(data: { data: CourseType[] }) => {
            const allCourses = data?.data || [];
            // const filteredCourses = allCourses.filter(
            //   (course: any) => !course?.isSubscribed,
            // );

            const pageSize = 6;
            const total = allCourses.length;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const currentCourses = allCourses.slice(start, end);

            console.log("NEW Courses : ", data);

            return (
              <div className="cards-grid min-h-[455px] rounded-lg">
                {currentCourses.length > 0 ? (
                  <>
                    {currentCourses.map((course: any, index: number) => (
                      <CourseCard
                        key={index}
                        isNewCourse={true}
                        courseDetails={course}
                      />
                    ))}
                    <div className="col-span-full w-full">
                      <PaginationComponent
                        currentPage={page}
                        total={total}
                        setPage={setPage}
                        pageSize={pageSize}
                      />
                    </div>
                  </>
                ) : (
                  <Empty
                    className="col-span-full"
                    text="لا يوجد كورسات جديدة"
                  />
                )}
              </div>
            );
          }}
          customLoading={
            <div className="cards-grid mt-6">
              <Skeleton className="mx-auto h-[430px] w-full max-w-[500px] rounded-lg" />
              <Skeleton className="mx-auto h-[430px] w-full max-w-[500px] rounded-lg" />
              <Skeleton className="mx-auto h-[430px] w-full max-w-[500px] rounded-lg" />
            </div>
          }
        />
      </div>
    </div>
  );
};
export default NewCourses;
