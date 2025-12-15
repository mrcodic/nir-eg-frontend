import { Button } from "@/components/ui/button";
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
    <Button
      className={cn(
        "max-w-32 w-full px-2 flex justify-center items-center  rounded-md   text-white h-9 transition-all",
        {
          "pointer-events-none cursor-not-allowed opacity-50": locked,
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
    </Button>
  );
};

export default LinkLocked;
