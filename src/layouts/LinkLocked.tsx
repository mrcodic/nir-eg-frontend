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
        "rounded-lg h-[32px] border text-white border-primary-700 flex justify-center items-center bg-primary min-w-[68px],",
        className
      )}
    >
      <div className="rounded-lg h-[32px] border text-white border-primary-700 flex justify-center items-center bg-primary min-w-[68px]">
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
    </div>
  );
};

export default LinkLocked;
