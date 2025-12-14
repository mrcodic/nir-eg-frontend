import FeaturesSection from "@/components/about/FeaturesSection";
import WhatIsNirHero from "@/components/about/WhatIsNirSection";
import WhoCanUseUs from "@/components/about/WhoCanUseUs";

function page() {
  return (
    <main className="flex w-full flex-col gap-22 md:my-22 my-16">
      <WhatIsNirHero />
      <FeaturesSection />
      <WhoCanUseUs />
    </main>
  );
}

export default page;
