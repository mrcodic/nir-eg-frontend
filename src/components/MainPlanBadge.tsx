import { cn } from "@/lib/utils";

function MainPlanBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -left-13.5 top-5 -rotate-45 bg-secondary px-12 py-1.5 font-semibold tracking-wide text-white shadow-md text-base",
        className,
      )}
    >
      الأكثر شيوعًا
    </div>
  );
}

export default MainPlanBadge;
