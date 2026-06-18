// components/skeleton/TextSkeleton.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Animate } from "../shared/Animate";

type TextSkeletonProps = {
  lines?: number;
  className?: string;
  lineClassName?: string;
  height?: number;
  gap?: number;
  widths?: string[];
  rounded?: string;
  showCursor?: boolean;
  staggerDelay?: number;
};

export default function TextSkeleton({
  lines = 3,
  className,
  lineClassName,
  height = 13,
  gap = 10,
  widths = ["100%", "92%", "75%"],
  rounded = "rounded-md",
  showCursor = true,
  staggerDelay = 0.06,
}: TextSkeletonProps) {
  return (
    <Animate
      as="div"
      trigger="mount"
      preset="none"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={cn("w-full", className)}
      role="status"
      aria-label="Loading text"
    >
      <div className="flex w-full flex-col" style={{ gap }}>
        {Array.from({ length: lines }).map((_, index) => {
          const width = widths[index % widths.length];

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 4 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  rounded,
                  lineClassName,
                  "animate-shimmer-wave",
                  "from-muted via-muted-foreground/10 to-muted bg-gradient-to-r",
                  "bg-size-[200%_100%]",
                )}
                style={{
                  width,
                  height,
                  animationDelay: `${index * 0.12}s`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <span className="sr-only">Loading...</span>
    </Animate>
  );
}
