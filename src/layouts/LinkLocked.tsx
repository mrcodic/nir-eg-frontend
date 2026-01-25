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
        "bg-primary hover:bg-primary/80 flex h-9 w-full max-w-32 items-center justify-center rounded-md px-2 text-white transition-all [&>svg]:size-5",
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
