import FeaturesSection from "@/components/about/FeaturesSection";
import WhatIsNirHero from "@/components/about/WhatIsNirSection";
import WhoCanUseUs from "@/components/about/WhoCanUseUs";
import { getPublicData } from "@/config/client-fetch";
import { AboutFeaturesSection } from "@/types/about.types";

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
      <WhatIsNirHero
        description={aboutContent.section_title}
        video_url={aboutContent.video_url}
      />
      <FeaturesSection features={aboutContent.items} />
      <WhoCanUseUs />
    </main>
  );
}

export default page;
