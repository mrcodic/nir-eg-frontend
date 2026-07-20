import { cn } from "@/lib/utils";

type SummarySectionHeadingProps = {
  eyebrow: string;
  title: string;
  titleClassName?: string;
  descriptionClassName?: string;
  description?: string;
  titleId?: string;
};

function SummarySectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  titleClassName,
  descriptionClassName,
}: SummarySectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className={
          "bg-secondary-50 text-secondary inline-flex rounded-full px-3 py-1 text-sm font-bold"
        }
      >
        {eyebrow}
      </span>
      <h2
        id={titleId}
        className={cn(
          "mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-sm leading-7 text-slate-500 sm:text-base",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default SummarySectionHeading;
