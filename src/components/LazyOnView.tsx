"use client";

import { cn } from "@/lib/utils";
import { useInView, UseInViewOptions } from "motion/react";
import { useRef } from "react";

interface LazyOnViewProps {
  children: React.ReactNode;
  offset?: string;
  className?: string;
  options?: UseInViewOptions;
}

export default function LazyOnView({
  children,
  offset = "300px",
  className,
  options,
}: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: offset as "300px",
    ...options,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "w-full ",
        { "min-h-[300px]": !isInView },
        !isInView && className,
        { "min-h-0": !children },
      )}
    >
      {isInView ? children : null}
    </div>
  );
}
