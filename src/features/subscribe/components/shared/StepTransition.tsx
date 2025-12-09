"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StepTransitionProps {
  children: ReactNode;
  isTransitioning: boolean;
  className?: string;
}

export default function StepTransition({
  children,
  isTransitioning,
  className,
}: StepTransitionProps) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isTransitioning
          ? "opacity-0 translate-y-4"
          : "opacity-100 translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}
