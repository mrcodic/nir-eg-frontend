"use client";

import type { MotionProps } from "motion/react";
import { motion } from "motion/react";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useMemo,
} from "react";

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
  const MotionComponent = useMemo(() => motion.create(as || "div"), [as]);

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionComponent {...props}>{children}</MotionComponent>
  );
}
