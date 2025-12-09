import { cn } from "@/lib/utils";
import { ElementType } from "react";

type StyledTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
};

export default function StyledText({
  text,
  as: Component = "span",
  className,
}: StyledTextProps) {
  return (
    <Component
      className={cn("text-primary-800 drop-shadow-text font-bold", className)}
    >
      {text}
    </Component>
  );
}
