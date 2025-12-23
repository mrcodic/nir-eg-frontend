"use client";

import { cn } from "@/lib/utils";
import { useInView } from "motion/react";
import { useRef } from "react";

interface LazyOnViewProps {
  children: React.ReactNode;
  offset?: string;
  className?: string;
  minHeight?: string;
}

export default function LazyOnView({
  children,
  offset = "300px",
  className = "",
}: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: offset as "0px" });

  return (
    <div ref={ref} className={cn(`w-full min-h-[300px]`, className)}>
      {isInView ? children : null}
    </div>
  );
}
