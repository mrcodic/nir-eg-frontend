"use client";

import MappingComp from "@/components/MappingComp";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import RoomHeader from "./RoomHeader";

const Coursers = () => {
  return (
    <div className="w-[85%] mx-auto">
      <RoomHeader
        className="mb-6 mt-4  "
        title="الاشتراكات"
        icon="/assets/english-icon.svg"
        textClassName="text-xl md:text-[40px]"
        subText="أنت مشترك في هذه الفصول"
        subTextClassName="text-[16px] md:text-[20px]"
      />

      <MappingComp
        queryKey="/students/courses/enrolled"
        render={(data) => {
          console.log("courses data:", data);

          if (data?.data?.length === 0)
            return <Empty text="لم تشترك في اي كورس" />;

          return (
            // <div className="mt-[24px] grid grid-cols-1 max-md:justify-items-center  md:grid-cols-2 lg:grid-cols-3 gap-5 ">
            <div className="mt-[24px] cards-grid">
              {data?.data?.map((courseDetails, index) => (
                <CourseCard key={index} courseDetails={courseDetails} />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Coursers;
