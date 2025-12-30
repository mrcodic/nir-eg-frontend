import FeaturesSection from "@/components/about/FeaturesSection";
import WhatIsNirHero from "@/components/about/WhatIsNirSection";
import WhoCanUseUs from "@/components/about/WhoCanUseUs";
import { getPublicData } from "@/config/client-fetch";
import { AboutFeaturesSection } from "@/types/about.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على منصة نَيِّر وكيف نساعدك في إدارة العملية التعليمية.",
};

async function page() {
  const data: { data: AboutFeaturesSection } | null = await getPublicData({
    queryKey: ["/settings/about/nir"],
  });

  console.log("about us page content : ", data);

  if (!data?.data) {
    throw new Error("About us page content not found");
  }

  const aboutContent = data.data;

  return (
    <main className="flex w-full flex-col gap-22 md:my-22 my-16 wrapper">
      {(aboutContent.small_description || aboutContent.video_url) && (
        <WhatIsNirHero
          description={aboutContent.small_description}
          video_url={aboutContent.video_url}
        />
      )}

      {aboutContent.items.length > 0 && (
        <FeaturesSection features={aboutContent.items} />
      )}

      <WhoCanUseUs />
    </main>
  );
}

export default page;
