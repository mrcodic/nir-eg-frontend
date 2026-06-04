import { getServerData } from "@/helpers/fetchers/server-fetch";
import StudentSummary from "@/modules/parent-portal/components/StudentSummary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بيانات الطالب | Parent Portal",
};

async function page({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  const studentSummaryData = token
    ? await getServerData({
        queryKey: [`/parent/progress?token=${token}`],
        isAuth: false,
      })
    : null;

  if (
    !token ||
    !studentSummaryData ||
    studentSummaryData?.ok === false ||
    !studentSummaryData?.data
  ) {
    throw new Error("Invalid or expired token");
  }

  return (
    <div className="mx-auto my-10 w-[85%]">
      <StudentSummary
        data={studentSummaryData?.data}
        meta={studentSummaryData?.meta}
      />
    </div>
  );
}

export default page;
