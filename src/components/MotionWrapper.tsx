"use client";

import type { MotionProps } from "motion/react";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useMemo } from "react";

type MotionWrapperProps<T extends ElementType> = {
  children?: ReactNode;
  className?: string;
  as?: T;
  ref?: React.RefObject<HTMLElement | null>;
} & MotionProps &
  Omit<ComponentPropsWithoutRef<T>, keyof MotionProps | "as" | "children">;

export default function MotionWrapper<T extends ElementType = "div">({
  children,
  as,
  ref,
  ...props
}: MotionWrapperProps<T>) {
  const MotionComponent = useMemo(() => motion.create(as || "div"), [as]);

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionComponent {...props} ref={ref}>
      {children}
    </MotionComponent>
  );
}
