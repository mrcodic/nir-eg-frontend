"use client";

import { Variants } from "motion";
import Image from "next/image";
import MotionWrapper from "../MotionWrapper";

const pinConfig = [
  { origin: "top left", rotate: 3, duration: 3.6 },
  { origin: "top right", rotate: -4.5, duration: 7 },
  { origin: "top left", rotate: 2.8, duration: 4.0 },
  { origin: "top right", rotate: -4, duration: 5 },
  { origin: "top left", rotate: 3.0, duration: 4.4 },
];

const hangingVariants = (rotate: number) =>
  ({
    hidden: {
      opacity: 0,
      y: 20,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: [0, rotate, 0],
    },
  } satisfies Variants);

export function FloatingHeroIcons() {
  return (
    <div className="flex flex-row-reverse justify-center mt-8 gap-4 md:w-4/5 w-full mx-auto max-md:flex-wrap">
      {[
        "Group 1.png",
        "Group 2.png",
        "Group 3.png",
        "Group 4.png",
        "Group 5.png",
      ].map((src, index) => {
        const { origin, rotate, duration } = pinConfig[index];

        return (
          <MotionWrapper
            key={src}
            as={Image}
            src={`/assets/hero/${src}`}
            alt="hero"
            width={146}
            height={128}
            className="object-contain w-1/5 min-w-[100px]"
            style={{ transformOrigin: origin }}
            variants={hangingVariants(rotate)}
            transition={{
              opacity: { duration: 0.3, delay: index * 0.15 },
              y: { duration: 0.3, delay: index * 0.15 },
              rotate: {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        );
      })}
    </div>
  );
}
