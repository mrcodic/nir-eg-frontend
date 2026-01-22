import { telegramLiks } from "@/constants";
import { Button } from "./ui/button";

function GroupJoinBadge({ gradeId }: { gradeId: number }) {
  return (
    <div className="border-secondary flex flex-col items-center gap-2 rounded-lg border p-2">
      <p className="font-bold text-white">انضم لجروب الكورس</p>
      <Button variant="secondary" className="w-full">
        <a href={telegramLiks[gradeId]} target="_blank">
          انضم للجروب
        </a>
      </Button>
    </div>
  );
}

export default GroupJoinBadge;
