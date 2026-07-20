import SummaryFeatureCard from "./SummaryFeatureCard";
import SummarySectionHeading from "./SummarySectionHeading";

import { SummaryTemplateContent } from "@/types/summary-template.types";

function SummaryCourse({
  course,
}: {
  course: SummaryTemplateContent["course"];
}) {
  if (!course.features?.length) return null;

  return (
    <section id="summary-course" className="scroll-mt-24 py-16 sm:py-20">
      <div className="wrapper">
        <SummarySectionHeading {...course} />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.features.map((feature) => (
            <SummaryFeatureCard
              key={feature.title}
              feature={feature}
              className="bg-primary-50/50"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SummaryCourse;
