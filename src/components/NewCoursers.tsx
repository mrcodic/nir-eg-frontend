"use client";

import { useAuthContext } from "@/context/auth-context";
import { useSearchParams } from "next/navigation";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import MappingComp from "./MappingComp";
import RoomHeader from "./RoomHeader";

const NewCourses = () => {
  const { token } = useAuthContext();
  const searchParams = useSearchParams();

  let api = token
    ? `/students/classrooms`
    : `/guest/classrooms/${searchParams.get("grade")}`;

  return (
    <div className=" mt-[50px] md:mt-[100px] h-full w-full ">
      <RoomHeader
        className="mx-auto  w-[85%]"
        title="احدث الكورسات المضافة"
        icon="/assets/english-icon.svg"
        textClassName="text-xl md:text-[40px]"
      />

      <div className="relative  mt-[24px] overflow-hidden ">
        <div
          className=" w-full   bg-color-primary  "
          style={{ backgroundImage: "url('/assets/paper.png')" }}
        >
          <div className="mx-auto  md:w-[90%] py-10">
            <MappingComp
              queryKey={api}
              render={(data) => {
                console.log("new courses : ", data);

                return (
                  // <div className="bg-[#FFF] justify-items-center min-h-[455px]  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-5 rounded-[8px] p-8">
                  <div className="bg-[#FFF]  min-h-[455px] cards-grid rounded-[8px] p-8 md:px-[2.5%] px-[7.5%]">
                    {data?.data?.length &&
                    data?.data?.some((course) => !course?.isSubscribed) ? (
                      data?.data?.map(
                        (course, index) =>
                          !course?.isSubscribed && (
                            <CourseCard
                              key={index}
                              isNewCourse={true}
                              courseDetails={course}
                            />
                          )
                      )
                    ) : (
                      <Empty
                        className="col-span-full"
                        text="لا يوجد كورسات جديدة"
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewCourses;
