import { getPublicData } from "@/config/client-fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لمنصة نَيِّر.",
};

async function page() {
  const data: { data: { content: string } } | null = await getPublicData({
    queryKey: ["/settings/legal/privacy"],
  });

  return (
    <main className="flex w-full flex-col gap-22 md:my-22 my-16 wrapper">
      <div className="section">
        <h1 className="text-3xl font-bold mb-10">سياسة الخصوصية</h1>
        <div className="space-y-6">
          {data?.data?.content?.startsWith("<") ? (
            <div
              className="break-all"
              dangerouslySetInnerHTML={{ __html: data?.data?.content }}
            />
          ) : (
            <pre className="break-all whitespace-pre-wrap">
              {data?.data?.content || "لا يوجد شروط و أحكام"}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}

export default page;
