"use client";

import MotionWrapper from "@/components/MotionWrapper";
import type { ElementType } from "react";

type AnimatedTextProps<T extends ElementType> = {
  text: string;
  by?: "word" | "letter";
  stagger?: number;
  delay?: number;
  once?: boolean;
  as?: T;
  className?: string;
};

export default function AnimatedText<T extends ElementType = "span">({
  text,
  by = "word",
  stagger = 0.05,
  delay = 0,
  once = true,
  as,
  className,
}: AnimatedTextProps<T>) {
  const Component = (as ?? "span") as ElementType;

  const items = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <MotionWrapper
      as={Component}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {items.map((item, index) => (
        <MotionWrapper
          key={`${item}-${index}`}
          as="span"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
          }}
        >
          {item}
          {by === "word" && "\u00A0"}
        </MotionWrapper>
      ))}
    </MotionWrapper>
  );
}
