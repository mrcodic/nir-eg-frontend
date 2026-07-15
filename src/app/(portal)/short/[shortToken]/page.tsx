import { getServerData } from "@/helpers/fetchers/server-fetch";
import type { Metadata } from "next";
import RedirectToPortal from "./RedirectToPortal";

export const metadata: Metadata = {
  title: "التحقق من الرابط",
  description:
    "جاري التحقق من الرابط المختصر وتحويلك إلى الوجهة المناسبة داخل المنصة.",
};

type IRedirectData = {
  data: {
    token?: string;
  };
  ok?: boolean;
};

async function page({ params }: { params: Promise<{ shortToken: string }> }) {
  const paramsData = await params;
  const shortToken = paramsData.shortToken;

  const redirectData = shortToken
    ? ((await getServerData({
        queryKey: [`/parent/short-key?key=${shortToken}`],
        isAuth: false,
      })) as IRedirectData)
    : null;

  if (!redirectData || !redirectData?.data?.token) {
    throw new Error("Invalid or expired token");
  }

  return (
    <div className="mx-auto my-10 flex min-h-[500px] w-[85%] items-center justify-center">
      <RedirectToPortal token={redirectData?.data?.token} />

      <div className="text-center">
        <div className="border-secondary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-secondary font-bold">جاري اعادة توجيهك...</p>
      </div>
    </div>
  );
}

export default page;
