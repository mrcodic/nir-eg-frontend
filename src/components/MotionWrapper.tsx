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
  as,
  ...props
}: MotionWrapperProps<T>) {
  const MotionComponent = motion.create(as || "div");

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionComponent {...props}>{children}</MotionComponent>
  );
}
