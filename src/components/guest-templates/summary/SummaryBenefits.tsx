import SummaryFeatureCard from "./SummaryFeatureCard";
import SummarySectionHeading from "./SummarySectionHeading";

import { SummaryTemplateContent } from "@/types/summary-template.types";

const floatingIcons = [
  "/assets/icons/instructor.png",
  "/assets/icons/talent.png",
  "/assets/icons/course.png",
];

function SummaryBenefits({
  benefits,
}: {
  benefits: SummaryTemplateContent["benefits"];
}) {
  if (!benefits.features?.length) return null;
  return (
    <section
      id="summary-benefits"
      className="bg-primary-50 scroll-mt-24 py-16 sm:py-20"
    >
      <div className="wrapper">
        <SummarySectionHeading {...benefits} />
        <div className="mt-10 grid gap-4 xl:grid-cols-3">
          {benefits.features.map((feature, idx) => (
            <SummaryFeatureCard
              key={feature.title}
              feature={feature}
              floatingIcon={floatingIcons[idx % floatingIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SummaryBenefits;
