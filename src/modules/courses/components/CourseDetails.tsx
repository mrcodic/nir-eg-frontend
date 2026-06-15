"use client";

import Empty from "@/components/shared/Empty";
import InfiniteScroll from "@/components/shared/InfinteScroll";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import RoomAccordionSkeleton from "@/components/ui/RoomAccordionSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTenant } from "@/context/TenantProvider";
import {
  getClientData,
  getClientPrivateData,
} from "@/helpers/fetchers/client-fetch";
import ExamCard from "@/modules/exam/components/ExamCard";
import RoomAccordion from "@/modules/rooms/components/RoomAccordion";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { ApiResponse, ICourseDetails, IExamCard, IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

const CourseActivitiesTable = dynamic(
  () => import("@/components/tables/CourseActivitiesTable"),
);
const RankTable = dynamic(() => import("@/components/tables/RankTable"));

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
  const { classroomId } = useParams();
  const [selectedTab, setSelectedTab] = useState("lessons");
  const { features } = useTenant();

  const {
    data: courseExams,
    isLoading: isLoadingExams,
    error: examError,
  } = useQuery({
    queryKey: [`/students/get-exams/${classroomId}`],
    queryFn: getClientPrivateData as () => Promise<
      ApiResponse<{
        incoming_exams: IExamCard[];
        past_exams: IExamCard[];
      }>
    >,
    enabled: !!profile,
    retry: 1,
  });

  const fetchMoreRooms = useCallback(
    async (page = 1) => {
      const res = await getClientData({
        queryKey: [
          `/students/get-rooms/${classroomId}?page=${page}&per_page=10`,
        ],
        optionalAuth: true,
      });

      return res?.body?.rooms;
    },
    [classroomId],
  );

  const hasExams =
    features?.quizzes &&
    (!!courseExams?.body?.incoming_exams?.length ||
      !!courseExams?.body?.past_exams?.length);
  const hasGradesEnabled = features?.student_gradebook;
  const hasPointsEnabled = features?.points_system;

  const visibleTabs = useMemo(
    () =>
      CourseTabs.filter((tab) => {
        if (tab.value === "activities") return hasGradesEnabled;
        if (tab.value === "rank") return hasPointsEnabled;

        return true;
      }),
    [hasGradesEnabled, hasPointsEnabled],
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
                className={`group data-[state=active]:bg-primary-800 border-primary-800 text-primary hover:bg-primary-50 flex min-w-24 cursor-pointer items-center gap-2 rounded-lg border bg-white px-px py-1 hover:shadow-sm data-[state=active]:text-white md:p-2`}
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
            fetchData={fetchMoreRooms}
            initialData={details?.rooms}
            pagination={details?.pagination}
            loadingComponent={
              <div className="mt-4 flex flex-col gap-4">
                {Array.from({ length: 2 }, (_, i) => (
                  <RoomAccordionSkeleton key={i} />
                ))}
              </div>
            }
            render={(data) => {
              return (
                <div className="flex flex-col gap-4">
                  {data?.map((room, index) => {
                    return (
                      <RoomAccordion
                        key={index}
                        room={room}
                        isSubscribed={
                          details?.is_subscriped
                          // || details?.subscription_type === "حصة"
                        }
                        verify={true || profile?.student_phone_verification}
                        classroomId={classroomId.toString()}
                        tasksEnabled={features?.quizzes}
                      />
                    );
                  })}
                </div>
              );
            }}
          ></InfiniteScroll>
        ) : (
          <Empty text="لا يوجد حصص مضافة بعد" />
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

      <Suspense fallback={<LoadingSpinner />}>
        {hasGradesEnabled && (
          <TabsContent value="activities">
            <RoomHeader title="الأنشطة" icon="/assets/star-colored.svg" />

            <CourseActivitiesTable enabled={selectedTab === "activities"} />
          </TabsContent>
        )}
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        {hasPointsEnabled && (
          <TabsContent value="rank">
            <RoomHeader title="ترتيب الطلاب" icon="/assets/rank-colored.svg" />

            <RankTable />
          </TabsContent>
        )}
      </Suspense>
    </Tabs>
  );
};
export default CourseDetails;
