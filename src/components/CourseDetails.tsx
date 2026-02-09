"use client";

import ExamCard from "@/components/ExamCard";
import RoomHeader from "@/components/RoomHeader";
import CourseActivitiesTable from "@/components/tables/CourseActivitiesTable";
import RankTable from "@/components/tables/RankTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientPrivateData, getClientData } from "@/helpers/client-fetch";
import { ApiResponse, ICourseDetails, IExamCard, IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import Empty from "./Empty";
import InfiniteScroll from "./InfinteScroll";
import LoadingSpinner from "./LoadingSpinner";
import RoomAccordion from "./RoomAccordion";

type Props = {
  details: ICourseDetails;
  profile: IUser;
};

const CourseTabs = [
  {
    id: 1,
    title: "الحصص",
    iconSrc: "/assets/classrooms-fill.svg",
    value: "lessons",
  },
  {
    id: 2,
    title: "الامتحانات",
    iconSrc: "/assets/ExamsColor.svg",
    value: "exams",
  },
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
  const [selectedTab, setSelectedTab] = useState("lessons");

  const {
    data: courseExams,
    isLoading: isLoadingExams,
    error: examError,
  } = useQuery({
    queryKey: [`/students/get-exams/${SingleCourse}`],
    queryFn: getClientPrivateData as () => Promise<
      ApiResponse<{
        incoming_exams: IExamCard[];
        past_exams: IExamCard[];
      }>
    >,
    enabled: !!profile,
    retry: 1,
  });

  const fetchMoreData = useCallback(
    async (page = 1) => {
      const res = await getClientData({
        queryKey: [
          `/students/get-rooms/${SingleCourse}?page=${page}&per_page=10`,
        ],
        isAuth: !!profile,
      });

      return res?.body?.rooms;
    },
    [SingleCourse, profile],
  );

  const hasExams =
    !!courseExams?.body?.incoming_exams?.length ||
    !!courseExams?.body?.past_exams?.length;

  const visibleTabs = useMemo(
    () =>
      CourseTabs.filter((tab) => {
        if (tab.value === "exams") return hasExams;
        return true;
      }),
    [hasExams],
  );

  return (
    <Tabs
      defaultValue="lessons"
      className={`wrapper mt-10 mb-12 flex flex-col gap-10 md:mb-[100px]`}
      dir="rtl"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      {details?.is_subscriped && (
        <TabsList className="mt-10 flex w-full justify-center">
          <div className="flex w-full justify-center gap-2 font-bold max-sm:flex-col md:gap-6">
            {visibleTabs.map((tab, index) => (
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
            fetchData={fetchMoreData}
            initialData={details?.rooms}
            pagination={details?.pagination}
            render={(data) => {
              return (
                <div className="flex flex-col gap-4">
                  {data?.map((room, index) => {
                    return (
                      <RoomAccordion
                        key={index}
                        room={room}
                        subscribe={
                          details?.is_subscriped ||
                          details?.subscription_type === "حصة"
                        }
                        verify={true || profile?.parent_phone_verification}
                        classroomId={SingleCourse.toString()}
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
        {isLoadingExams ? (
          <LoadingSpinner />
        ) : examError ? (
          <Empty isError text="حدث خطاء اثناء عرض الامتحانات" />
        ) : !hasExams ? (
          <Empty text="لا يوجد امتحانات بعد" />
        ) : (
          <div>
            {!!courseExams?.body?.incoming_exams?.length && (
              <div>
                <RoomHeader
                  title="الامتحانات القادمة"
                  icon="/assets/assignment-colored.svg"
                />
                <div className="flex flex-col gap-6">
                  {courseExams.body.incoming_exams.map((exam, index) => (
                    <ExamCard exam={exam} key={index} />
                  ))}
                </div>
              </div>
            )}

            {!!courseExams?.body?.past_exams?.length && (
              <div className="mt-10">
                <RoomHeader
                  title="الامتحانات السابقة"
                  // icon="/assets/english-icon.svg"
                  icon="/assets/assignment-colored.svg"
                />
                <div className="flex flex-col gap-6">
                  {courseExams.body.past_exams.map((exam, index) => (
                    <ExamCard isPreviousExam exam={exam} key={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="activities">
        <RoomHeader title="الأنشطة" icon="/assets/star-colored.svg" />

        <CourseActivitiesTable enabled={selectedTab === "activities"} />
      </TabsContent>

      <TabsContent value="rank">
        <RoomHeader title="ترتيب الطلاب" icon="/assets/rank-colored.svg" />

        <RankTable />
      </TabsContent>
    </Tabs>
  );
};
export default CourseDetails;
