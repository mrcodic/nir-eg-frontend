"use client";

import { motion, MotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type MotionWrapperProps<T extends ElementType> = {
  children?: ReactNode;
  className?: string;
  as?: T;
} & MotionProps &
  Omit<ComponentPropsWithoutRef<T>, keyof MotionProps | "as" | "children">;

export default function MotionWrapper<T extends ElementType = "div">({
  children,
  className,
  as,
  ...props
}: MotionWrapperProps<T>) {
  const MotionComponent = motion(as || "div");

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionComponent
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
