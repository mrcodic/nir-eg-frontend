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
        "max-w-32 w-full px-2 flex justify-center items-center bg-primary-800 border border-gray-light rounded-md   text-white h-9",
        {
          "pointer-events-none cursor-not-allowed": locked,
          "cursor-pointer": !locked,
        },
        className
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
