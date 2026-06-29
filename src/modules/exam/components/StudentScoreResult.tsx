import ScoreBadge from "@/components/ui/ScoreBadge";
import ScorePercent from "@/components/ui/ScorePercent";
import { cn } from "@/lib/utils";
import { TaskType } from "@/types";

function StudentScoreResult({
  score,
  pass = true,
  pending,
  type = "امتحان",
  className,
  badgeClassName,
}: {
  score: number;
  pass?: boolean;
  pending?: boolean;
  type?: TaskType;
  className?: string;
  badgeClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-w-[123px] shrink-0 gap-2 text-lg font-bold text-nowrap sm:text-xl",
        className,
      )}
    >
      {type !== "واجب" && <ScorePercent score={score} passed={pass} />}

      <ScoreBadge
        passed={pass}
        type={type}
        pending={pending || score === null}
        className={badgeClassName}
      />
    </div>
  );
}

export default StudentScoreResult;
