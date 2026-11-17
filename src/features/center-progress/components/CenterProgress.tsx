import Empty from "@/components/shared/Empty";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CenterHomeworkChart } from "@/features/center-progress/components/CenterHomeworkChart";
import { CenterQuizChart } from "@/features/center-progress/components/CenterQuizChart";
import { CenterProgressRooms } from "@/features/center-progress/components/CenterProgressRooms";
import { CenterProgressStats } from "@/features/center-progress/components/CenterProgressStats";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { getCenterProgress } from "@/services/center-progress.service";
import { ApiResponse, IUser } from "@/types";
import { CENTER_STUDENT_TYPE } from "@/types/center-progress.types";
import { redirect } from "next/navigation";

export default async function CenterProgress() {
  const profileResponse = await getServerData<ApiResponse<IUser | null>>({
    queryKey: ["/students/profile"],
  });
  const profile = profileResponse?.body;

  if (!profile) redirect("/login?redirect=/center-progress");
  if (profile.type !== CENTER_STUDENT_TYPE) redirect("/profile");

  const progress = await getCenterProgress();

  return (
    <section
      className="wrapper mt-28 mb-10 flex flex-col gap-4 lg:mt-32 lg:gap-5"
      dir="rtl"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold">الحضور والتقييمات</h1>
        {progress && (
          <Card className="rounded-xl shadow-none md:border-0 md:bg-transparent">
            <CardContent className="flex items-center gap-3 p-4 md:p-0">
              <Avatar className="size-11 rounded-xl">
                <AvatarFallback className="bg-primary-50 text-primary rounded-xl text-lg font-bold">
                  {progress.student.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1.5">
                <h2 className="text-sm font-bold [overflow-wrap:anywhere]">
                  {progress.classroom.title}
                </h2>
                <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span>{progress.student.name}</span>
                  <span aria-hidden="true">·</span>
                  <bdi>{progress.student.code}</bdi>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {!progress ? (
        <Empty text="لا توجد بيانات للحضور والتقييمات حتى الآن" />
      ) : (
        <>
          <CenterProgressStats stats={progress.stats} />
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
            <CenterHomeworkChart homework={progress.charts.homework} />
            <CenterQuizChart quizzes={progress.charts.quiz_progress} />
          </div>
          <CenterProgressRooms rooms={progress.rooms} />
        </>
      )}
    </section>
  );
}
