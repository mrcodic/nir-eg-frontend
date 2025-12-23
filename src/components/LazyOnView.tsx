"use client";

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
  minHeight = "400px",
}: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: offset as "0px" });

  return (
    <div ref={ref} className={`w-full ${className}`} style={{ minHeight }}>
      {isInView ? children : null}
    </div>
  );
}
