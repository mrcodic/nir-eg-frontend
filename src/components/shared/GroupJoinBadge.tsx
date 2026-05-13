import { Button } from "@/components/ui/button";

function GroupJoinBadge({ groupLink }: { groupLink: string }) {
  return (
    <div className="border-secondary flex flex-col items-center gap-2 rounded-lg border p-2">
      <p className="font-bold text-white">انضم لجروب الكورس</p>
      <Button variant="secondary" className="w-full">
        <a href={groupLink} target="_blank">
          انضم للجروب
        </a>
      </Button>
    </div>
  );
}

export default GroupJoinBadge;
