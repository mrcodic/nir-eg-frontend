"use client";

import MappingComp from "@/components/shared/MappingComp";
import { useState } from "react";
import CourseCard from "@/modules/courses/components/CourseCard";
import Empty from "@/components/shared/Empty";
import PaginationComponent from "@/components/shared/Pagination";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        render={(data: { data: CourseType[] }) => {
          if (data?.data?.length === 0)
            return (
              <Empty text="لم تشترك في اي كورس">
                <Link href="/bundles">
                  <Button className="mt-4">اذهب للباقات</Button>
                </Link>
              </Empty>
            );

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
