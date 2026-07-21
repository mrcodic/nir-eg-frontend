import { Animate } from "@/components/shared/Animate";
import { mapSummaryLandingContent } from "@/helpers/map-summary-landing-content";
import type { LandingPageData } from "@/types/tenant.types";
import SummaryBenefits from "./summary/SummaryBenefits";
import SummaryBooking from "./summary/SummaryBooking";
import SummaryCourse from "./summary/SummaryCourse";
import SummaryFaq from "./summary/SummaryFaq";
import SummaryHero from "./summary/SummaryHero";

import { cn } from "@/lib/utils";
import { Readex_Pro } from "next/font/google";

const readexPro = Readex_Pro({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

function TemplateSummary({ data }: { data: LandingPageData }) {
  const content = mapSummaryLandingContent(data);

  return (
    <div className={cn("bg-white", readexPro.className)}>
      <Animate preset="slideUp">
        <SummaryHero hero={content.hero} />
      </Animate>
      <Animate preset="fadeIn" delay={0.1}>
        <SummaryBenefits benefits={content.benefits} />
      </Animate>
      <Animate preset="slideUp" delay={0.1}>
        <SummaryCourse course={content.course} />
      </Animate>
      <SummaryBooking booking={content.booking} />

      <Animate preset="fadeIn" delay={0.1}>
        <SummaryFaq faq={content.faq} />
      </Animate>
    </div>
  );
}

export default TemplateSummary;
