"use client";
import Exam from "@/components/Exam";
import RoomHeader from "@/components/RoomHeader";
import CourseActivitiesTable from "@/components/tables/CourseActivitiesTable";
import RankTable from "@/components/tables/RankTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPublicData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { ICourseDetails, IUser } from "@/types";
import Image from "next/image";
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
      className={`wrapper flex flex-col gap-10  mb-12 mt-10  md:mb-[100px]`}
      dir="rtl"
    >
      {details?.is_subscriped && (
        <TabsList className="flex justify-center  w-full mt-10  ">
          <div className="flex font-bold max-sm:flex-col justify-center w-full gap-2 md:gap-6 my-10 ">
            {Tabs3.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className={`group min-w-24 rounded-lg data-[state=active]:bg-primary-800 cursor-pointer data-[state=active]:text-white bg-white text-[#523412] flex items-center gap-2 border border-primary-800 px-px py-1 md:p-2 `}
              >
                <Image
                  className="size-6 group-data-[state=active]:invert group-data-[state=active]:brightness-0 transition-all duration-300 ease-in-out"
                  src={tab.iconSrc}
                  alt={tab.title}
                  width={24}
                  height={24}
                />
                <span className="text-sm text-primary-800 group-data-[state=active]:text-white transition-all duration-300 ease-in-out font-bold">
                  {tab.title}
                </span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      )}

      <TabsContent value="lessons" className={cn("mt-8", {})}>
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
                        verify={details?.parent_phone_verification}
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

      <TabsContent value="exams" className="mt-8">
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

      <TabsContent value="activities" className=" mt-8">
        <RoomHeader title="الأنشطة" icon="/assets/star-colored.svg" />

        <CourseActivitiesTable />
      </TabsContent>

      <TabsContent value="rank" className=" mt-8">
        <RoomHeader title="ترتيب الطلاب" icon="/assets/rank-colored.svg" />

        <RankTable />
      </TabsContent>
    </Tabs>
  );
};
export default CourseDetails;
