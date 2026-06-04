import { getServerData } from "@/helpers/fetchers/server-fetch";
import RedirectToPortal from "./RedirectToPortal";

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
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#D9B45C] border-t-transparent" />
        <p className="font-bold text-[#D9B45C]">جاري اعادة توجيهك...</p>
      </div>
    </div>
  );
}

export default page;
