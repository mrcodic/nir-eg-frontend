import { mapSummaryLandingContent } from "@/helpers/map-summary-landing-content";
import type { LandingPageData } from "@/types/tenant.types";
import SummaryBenefits from "./summary/SummaryBenefits";
import SummaryBooking from "./summary/SummaryBooking";
import SummaryCourse from "./summary/SummaryCourse";
import SummaryFaq from "./summary/SummaryFaq";
import SummaryHero from "./summary/SummaryHero";

function TemplateSummary({ data }: { data: LandingPageData }) {
  const content = mapSummaryLandingContent(data);

  return (
    <div className="bg-white">
      <SummaryHero hero={content.hero} />
      <SummaryBenefits benefits={content.benefits} />
      <SummaryCourse course={content.course} />
      <SummaryBooking booking={content.booking} />
      <SummaryFaq faq={content.faq} />
    </div>
  );
}

export default TemplateSummary;
