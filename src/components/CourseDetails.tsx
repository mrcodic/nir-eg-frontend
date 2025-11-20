"use client";
import Exam from "@/components/Exam";
import RoomHeader from "@/components/RoomHeader";
import CourseActivitiesTable from "@/components/tables/CourseActivitiesTable";
import RankTable from "@/components/tables/RankTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getData } from "@/utils/api";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import Empty from "./Empty";
import InfiniteScroll from "./InfinteScroll";
import Room from "./Room";

const Tabs3 = [
  {
    id: 1,
    title: "الحصص",
    iconSrc: "/assets/RoomsColor.svg",
    value: "lessons",
  },
  // {
  //   id: 2,
  //   title: "الامتحانات",
  //   iconSrc: "/assets/ExamsColor.svg",
  //   value: "exams",
  // },
  {
    id: 3,
    title: "درجاتي",
    iconSrc: "/assets/Star.svg",
    value: "activities",
  },
  // {
  //   id: 4,
  //   title: "ترتيب الطلاب",
  //   iconSrc: "/assets/RankColor.svg",
  //   value: "rank",
  // },
];

const CourseDetails = ({ body, profileData }) => {
  const { SingleCourse } = useParams();

  const fetchData = async (page = 1) => {
    const res = await getData({
      queryKey: [
        `/students/get-rooms/${SingleCourse}?page=${page}&per_page=10`,
      ],
    });

    return res?.body?.rooms;
  };

  useEffect(() => {
    if (profileData?.body?.has_center === false) {
      redirect("/profile");
    }
  }, [profileData?.body?.has_center]);

  const exams = body?.classroom_exams;

  return (
    <Tabs
      defaultValue="lessons"
      className={` flex flex-col gap-10  mb-[48px] mt-10  md:mb-[100px]`}
      dir="rtl"
    >
      {body?.is_subscriped && (
        <TabsList className="flex justify-center  w-full mt-10  ">
          <div className="flex font-bold justify-center w-full gap-2 md:gap-6 my-10 ">
            {Tabs3.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className={`min-w-24 rounded-lg data-[state=active]:bg-[#012D5A] data-[state=active]:text-white bg-white text-[#523412] flex items-center border border-primary-700 px-px py-1 md:p-2 `}
              >
                <img className=" h-8" src={tab.iconSrc} />
                <span className="text-sm">{tab.title}</span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      )}

      <TabsContent
        value="lessons"
        className={cn("px-2 w-[85%] mx-auto mt-8", {})}
      >
        <div className="">
          <RoomHeader title="محتوى الكورس" icon="/assets/english-icon.svg" />

          {body?.rooms?.length ? (
            <InfiniteScroll
              fetchData={fetchData}
              initialData={body?.rooms}
              pagination={body?.pagination}
              render={(data) => {
                return (
                  <div className="flex flex-col gap-4">
                    {data?.map((room, index) => {
                      return (
                        <Room
                          key={index}
                          room={room}
                          subscribe={
                            body?.is_subscriped ||
                            body?.subscription_type === "حصة"
                          }
                          verify={body?.parent_phone_verification}
                          subType={body?.subscription_type || null}
                        />
                      );
                    })}
                  </div>
                );
              }}
            ></InfiniteScroll>
          ) : (
            <Empty text="لا يوجد محتوى بعد" />
          )}
        </div>
      </TabsContent>

      <TabsContent value="exams" className="w-[85%] mx-auto">
        <div className="mt-[32px]">
          <RoomHeader
            title="الامتحانات القادمة"
            icon="/assets/english-icon.svg"
          />

          <div className="flex flex-col gap-6">
            {exams?.map((exam, index) => (
              <Exam exam={exam} key={index} />
            ))}
          </div>

          {/* <div className="mt-[40px]">
            <RoomHeader
              title="الامتحانات السابقة"
              icon="/assets/english-icon.svg"
            />
            <div className="flex flex-col gap-6">
              {EXAMS.map((exam, index) => (
                <Exam isPreviousExam={true} exam={exam} key={index} />
              ))}
            </div>
          </div> */}
        </div>
      </TabsContent>

      <TabsContent value="activities" className="w-[85%] mx-auto mt-8">
        <RoomHeader title="الأنشطة" icon="/assets/Star.svg" />

        <CourseActivitiesTable />
      </TabsContent>

      <TabsContent value="rank" className="w-[85%] mx-auto mt-8">
        <RankTable />
      </TabsContent>
    </Tabs>
  );
};
export default CourseDetails;
