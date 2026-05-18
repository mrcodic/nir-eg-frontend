import ScoreBadge from "@/components/ui/ScoreBadge";
import ScorePercent from "@/components/ui/ScorePercent";
import { TaskType } from "@/types";

function StudentScoreResult({
  score,
  pass = true,
  pending,
  type,
}: {
  score: number;
  pass?: boolean;
  pending?: boolean;
  type: TaskType;
}) {
  return (
    <div className="relative flex min-w-[116px] gap-2 text-lg font-bold text-nowrap sm:text-xl">
      {type !== "واجب" && <ScorePercent score={score} passed={pass} />}
      <ScoreBadge
        passed={pass}
        type={type}
        pending={pending || score === null}
      />
    </div>
  );
}

export default StudentScoreResult;
