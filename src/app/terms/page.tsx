import { getPublicData } from "@/config/client-fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "الشروط والأحكام لاستخدام منصة نَيِّر.",
};

async function page() {
  const data: { data: { content: string } } | null = await getPublicData({
    queryKey: ["/settings/legal/terms"],
    next: {
      revalidate: 60 * 60 * 60 * 24 * 7,
    },
  });

  console.log("terms page content : ", data?.data?.content);

  return (
    <main className="flex w-full flex-col gap-22 md:my-22 my-16 wrapper">
      <div className="section">
        <h1 className="text-3xl font-bold mb-10">الشروط و الأحكام</h1>
        <div className="space-y-6">
          <div>{data?.data?.content || "لا يوجد شروط و أحكام"}</div>
        </div>
      </div>
    </main>
  );
}

export default page;
