import CustomImage from "@/components/ui/CustomImage";
import { cn } from "@/lib/utils";

import { SummaryTemplateFeature } from "@/types/summary-template.types";

function SummaryFeatureCard({
  feature,
  className,
}: {
  feature: SummaryTemplateFeature;
  floatingIcon?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-reduce:transition-none",
        className,
      )}
    >
      {feature.icon && (
        <CustomImage
          src={feature.icon}
          fallback="/assets/icons/BookColor.svg"
          startWithFallback={false}
          width={44}
          height={44}
          alt=""
          className="size-11 shrink-0 object-contain"
        />
      )}

      <div>
        <h3 className="font-bold">{feature.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {feature.description}
        </p>
      </div>
    </article>
  );
}

export default SummaryFeatureCard;
