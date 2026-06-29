import { cn } from "@/lib/utils";
import { ElementType } from "react";

type StyledTextProps = {
  text: string | number;
  as?: ElementType;
  className?: string;
  withUnderLine?: boolean;
};

export default function StyledText({
  text,
  as: Component = "span",
  className,
  withUnderLine,
}: StyledTextProps) {
  return (
    <Component
      className={cn("text-primary-800 drop-shadow-text font-bold", className)}
    >
      {text}
      {withUnderLine && <div className="bg-secondary h-0.5 w-9 origin-right" />}
    </Component>
  );
}
