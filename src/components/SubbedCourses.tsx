"use client";

import MappingComp from "@/components/MappingComp";
import { useState } from "react";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import PaginationComponent from "./Pagination";
import RoomHeader from "./RoomHeader";
import { Skeleton } from "./ui/skeleton";

const SubbedCourses = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="wrapper">
      <RoomHeader
        className="mb-6 items-start"
        title="الاشتراكات"
        icon="/assets/success.svg"
        subText="أنت مشترك في هذه الفصول"
      />

      <MappingComp
        queryKey="/students/courses/enrolled"
        render={(data) => {
          if (data?.data?.length === 0)
            return <Empty text="لم تشترك في اي كورس" />;

          const allCourses = data?.data || [];
          const pageSize = 6;
          const total = allCourses.length;
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const currentCourses = allCourses.slice(start, end);

          return (
            <div className="cards-grid mt-6">
              {currentCourses.map((courseDetails: any, index: number) => (
                <CourseCard
                  key={index}
                  courseDetails={courseDetails}
                  isSubbed={true}
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
  );
};

export default SubbedCourses;
