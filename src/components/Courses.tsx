"use client";

import MappingComp from "@/components/MappingComp";
import { useState } from "react";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import PaginationComponent from "./Pagination";
import RoomHeader from "./RoomHeader";

const Coursers = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="wrapper ">
      <RoomHeader
        className="mb-6  items-start "
        title="الاشتراكات"
        icon="/assets/success.svg"
        subText="أنت مشترك في هذه الفصول"
      />

      <MappingComp
        queryKey="/students/courses/enrolled"
        render={(data) => {
          console.log("courses data:", data);

          if (data?.data?.length === 0)
            return <Empty text="لم تشترك في اي كورس" />;

          const allCourses = data?.data || [];
          const pageSize = 6;
          const total = allCourses.length;
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const currentCourses = allCourses.slice(start, end);

          return (
            <div className="mt-6 cards-grid ">
              {currentCourses.map((courseDetails: any, index: number) => (
                <CourseCard
                  key={index}
                  courseDetails={courseDetails}
                  isNewCourse={false}
                  isBundles={false}
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
      />
    </div>
  );
};

export default Coursers;
