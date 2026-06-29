import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { ReactNode } from "react";

const LinkLocked = ({
  locked,
  children,
  className,
}: {
  locked: boolean;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-primary-800 hover:bg-primary-800/80 flex h-9 min-w-28 items-center justify-center rounded-md px-2 text-center text-white transition-all max-sm:text-sm sm:min-w-32 [&>svg]:size-5",
        {
          "pointer-events-none cursor-not-allowed opacity-50": locked,
          "cursor-pointer": !locked,
        },
        className,
      )}
    >
      {locked ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <Button variant="outline">Hover</Button> */}
              <Lock />
            </TooltipTrigger>
            <TooltipContent>
              <p>عليك اجتياز الاختبار أولا</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        children
      )}
    </div>
  );
};

export default LinkLocked;
