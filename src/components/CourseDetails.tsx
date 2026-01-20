"use client";

import Exam from "@/components/Exam";
import RoomHeader from "@/components/RoomHeader";
import CourseActivitiesTable from "@/components/tables/CourseActivitiesTable";
import RankTable from "@/components/tables/RankTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPublicData } from "@/helpers/client-fetch";
import { ICourseDetails, IUser } from "@/types";
import { useParams } from "next/navigation";
import Empty from "./Empty";
import InfiniteScroll from "./InfinteScroll";
import Room from "./Room";

type Props = {
  details: ICourseDetails;
  profile: IUser;
};

const Tabs3 = [
  {
    id: 1,
    title: "الحصص",
    iconSrc: "/assets/classrooms-fill.svg",
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
    title: "الانشطة",
    iconSrc: "/assets/stars-blue.svg",
    value: "activities",
  },
  {
    id: 4,
    title: "ترتيب الطلاب",
    iconSrc: "/assets/rank-filled.svg",
    value: "rank",
  },
];

const CourseDetails = ({ details, profile }: Props) => {
  const { SingleCourse } = useParams();

  const fetchData = async (page = 1) => {
    const res = await getPublicData({
      queryKey: [
        `/students/get-rooms/${SingleCourse}?page=${page}&per_page=10`,
      ],
      isAuth: !!profile,
    });

    return res?.body?.rooms;
  };

  return (
    <Tabs
      defaultValue="lessons"
      className={`wrapper mt-10 mb-12 flex flex-col gap-10 md:mb-[100px]`}
      dir="rtl"
    >
      {details?.is_subscriped && (
        <TabsList className="mt-10 flex w-full justify-center">
          <div className="flex w-full justify-center gap-2 font-bold max-sm:flex-col md:gap-6">
            {Tabs3.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className={`group data-[state=active]:bg-primary-800 border-primary-800 flex min-w-24 cursor-pointer items-center gap-2 rounded-lg border bg-white px-px py-1 text-[#523412] data-[state=active]:text-white md:p-2`}
              >
                <span
                  className="bg-primary size-6 transition-colors duration-300 group-data-[state=active]:bg-white"
                  style={{
                    WebkitMask: `url(${tab.iconSrc}) no-repeat center / contain`,
                    mask: `url(${tab.iconSrc}) no-repeat center / contain`,
                  }}
                />

                <span className="text-primary-800 text-sm font-bold transition-all duration-300 ease-in-out group-data-[state=active]:text-white">
                  {tab.title}
                </span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      )}

      <TabsContent value="lessons">
        <RoomHeader title="محتوى الكورس" icon="/assets/books-colored.svg" />

        {details?.rooms?.length ? (
          <InfiniteScroll
            fetchData={fetchData}
            initialData={details?.rooms}
            pagination={details?.pagination}
            render={(data) => {
              return (
                <div className="flex flex-col gap-4">
                  {data?.map((room, index) => {
                    return (
                      <Room
                        key={index}
                        room={room}
                        subscribe={
                          details?.is_subscriped ||
                          details?.subscription_type === "حصة"
                        }
                        verify={profile?.parent_phone_verification}
                        // subType={details?.subscription_type || null}
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
      </TabsContent>

      <TabsContent value="exams">
        <RoomHeader
          title="الامتحانات القادمة"
          icon="/assets/english-icon.svg"
        />

        <div className="flex flex-col gap-6">
          {details?.classroom_exams?.map((exam, index) => (
            <Exam exam={exam} key={index} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="activities">
        <RoomHeader title="الأنشطة" icon="/assets/star-colored.svg" />

        <CourseActivitiesTable />
      </TabsContent>

      <TabsContent value="rank">
        <RoomHeader title="ترتيب الطلاب" icon="/assets/rank-colored.svg" />

        <RankTable />
      </TabsContent>
    </Tabs>
  );
};
export default CourseDetails;
