"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function UnderlineStyle({
  isActive,
  children,
  className,
}: {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative ", className)}>
      {children}
      <motion.div
        className=" ms-2 bg-secondary absolute h-0.5"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "40px" : 0 }}
        whileHover={{ width: "40px" }}
      />
    </div>
  );
}

export default UnderlineStyle;
