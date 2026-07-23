import { Animate } from "@/components/shared/Animate";
import { mapSummaryLandingContent } from "@/helpers/map-summary-landing-content";
import type { LandingPageData } from "@/types/tenant.types";
import SummaryBooking from "./summary/SummaryBooking";
import SummaryCourse from "./summary/SummaryCourse";
import SummaryFaq from "./summary/SummaryFaq";
import SummaryHero from "./summary/SummaryHero";

import { cn } from "@/lib/utils";
import { Readex_Pro } from "next/font/google";
import SummaryBenefits from "./summary/SummaryBenefits";

const readexPro = Readex_Pro({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

function TemplateSummary({ data }: { data: LandingPageData }) {
  const content = mapSummaryLandingContent(data);

  return (
    <div className={cn("bg-white", readexPro.className)}>
      {!content?.hero?.hidden && (
        <Animate preset="slideUp">
          <SummaryHero hero={content.hero} />
        </Animate>
      )}
      {!content?.benefits?.hidden && (
        <Animate
          preset="fadeIn"
          delay={0.1}
          className="first:bg-primary-50 first:pt-25 sm:first:pt-25"
        >
          <SummaryBenefits benefits={content.benefits} />
        </Animate>
      )}
      {!content?.course?.hidden && (
        <Animate
          preset="slideUp"
          delay={0.1}
          className="first:pt-25 sm:first:pt-25"
        >
          <SummaryCourse course={content.course} />
        </Animate>
      )}

      <SummaryBooking booking={content.booking} />

      {!content?.faq?.hidden && (
        <Animate
          preset="fadeIn"
          delay={0.1}
          className="first:pt-40 sm:first:pt-40"
        >
          <SummaryFaq faq={content.faq} />
        </Animate>
      )}
    </div>
  );
}

export default TemplateSummary;
