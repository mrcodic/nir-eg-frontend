import { telegramLiks } from "@/constants";
import { Button } from "./ui/button";

function SupportBadge({ gradeId }: { gradeId: number }) {
  return (
    <div className="flex items-center flex-col gap-2 rounded-lg border border-secondary p-2">
      <p className="text-white font-bold">انضم لجروب الكورس</p>
      <Button variant="secondary" className="w-full">
        <a href={telegramLiks[gradeId]} target="_blank">
          انضم للجروب
        </a>
      </Button>
    </div>
  );
}

export default SupportBadge;
