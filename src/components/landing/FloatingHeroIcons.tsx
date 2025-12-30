"use client";

import { Variants } from "motion";
import Image from "next/image";
import MotionWrapper from "../MotionWrapper";

const pinConfig = [
  { origin: "top left", rotate: 6, duration: 3.6 },
  { origin: "top right", rotate: -7.5, duration: 7 },
  { origin: "top left", rotate: 5.8, duration: 4.0 },
  { origin: "top right", rotate: -7, duration: 5 },
  { origin: "top left", rotate: 6, duration: 4.4 },
];

const hangingVariants = (rotate: number) =>
  ({
    hidden: {
      opacity: 0,
      y: 40,
      z: 400,
      // scale: 1.2,
      rotateX: -20,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      z: 0,
      // scale: 1,
      rotateX: 0,
      rotate: [0, rotate, 0],
    },
  } satisfies Variants);

export function FloatingHeroIcons() {
  return (
    <div
      className="flex flex-row-reverse justify-center mt-8 gap-4 md:w-4/5 w-full mx-auto max-md:flex-wrap relative z-5"
      style={{ perspective: 500 }} // 👈 critical for depth
    >
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
            style={{
              transformOrigin: origin,
              transformStyle: "preserve-3d",
            }}
            variants={hangingVariants(rotate)}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: { duration: 0.35, delay: index * 0.2 + 1 },
              y: { duration: 0.5, delay: index * 0.2 + 1, ease: "easeOut" },
              z: { duration: 0.5, delay: index * 0.2 + 1, ease: "easeOut" },
              // scale: { duration: 0.5, delay: index * 0.2 + 1 },
              rotateX: { duration: 0.5, delay: index * 0.15 + 1.2 },

              // 👇 pin sway starts AFTER entrance
              rotate: {
                delay: 0.6 + index * 0.15,
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
