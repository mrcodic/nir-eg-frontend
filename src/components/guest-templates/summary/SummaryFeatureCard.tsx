import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  FileText,
  MessageCircle,
  UsersRound,
  Video,
} from "lucide-react";

import { SummaryTemplateFeature } from "@/types/summary-template.types";

const featureIcons = {
  book: BookOpen,
  chart: BarChart3,
  file: FileText,
  message: MessageCircle,
  users: UsersRound,
  video: Video,
};

function SummaryFeatureCard({
  feature,
  compact = false,
}: {
  feature: SummaryTemplateFeature;
  compact?: boolean;
}) {
  const Icon = featureIcons[feature.icon];

  return (
    <article
      className={cn(
        "group rounded-2xl bg-white p-5 shadow-[0_12px_30px_-24px_rgba(18,48,75,0.5)] transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-reduce:transition-none",
        compact ? "flex items-center gap-4" : "text-center",
      )}
    >
      <span
        className={cn(
          "bg-secondary/15 text-secondary inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
          !compact && "mx-auto",
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className={cn(!compact && "mt-4")}>
        <h3 className="font-bold text-[#12304b]">{feature.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {feature.description}
        </p>
      </div>
    </article>
  );
}

export default SummaryFeatureCard;
