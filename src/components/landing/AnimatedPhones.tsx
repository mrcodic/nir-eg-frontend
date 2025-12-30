"use client";

import MotionWrapper from "@/components/MotionWrapper";
import type { Variants } from "motion";
import Image from "next/image";

/* ================== Variants ================== */

const phonesContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      when: "beforeChildren",
    },
  },
} satisfies Variants;

const frontPhoneVariants = {
  hidden: {
    y: 90,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.5,
    },
  },
} satisfies Variants;

const backPhoneVariants = {
  hidden: {
    x: -90,
    opacity: 0,
    rotate: -10,
  },
  visible: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.95,
    },
  },
} satisfies Variants;

const bellEntryVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 1.1,
    },
  },
} satisfies Variants;

/* ================== Component ================== */

export default function AnimatedPhones() {
  return (
    <MotionWrapper
      className="flex self-end items-end -mb-6 shrink-0 relative md:pe-6"
      variants={phonesContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Back phone */}
      <MotionWrapper
        variants={backPhoneVariants}
        className="-me-12 lg:w-[220px] h-fit w-[130px] sm:w-[150px] relative z-1 -mb-10"
      >
        <Image
          src="/assets/phone-2.png"
          alt="phone image"
          width={220}
          height={391}
        />
      </MotionWrapper>

      {/* Front phone */}
      <MotionWrapper
        variants={frontPhoneVariants}
        className="lg:w-[220px] h-fit w-[150px] relative z-2 -mb-10"
      >
        <Image
          src="/assets/phone-1.png"
          alt="phone image 2"
          width={220}
          height={391}
        />
      </MotionWrapper>

      {/* Bell */}
      <MotionWrapper
        className="
                  absolute top-0 right-0
                  aspect-square
                  w-20 lg:w-[140px]

                  -translate-y-3
                  -translate-x-4
                  sm:-translate-x-8
                  lg:-translate-x-10

                  will-change-transform
              "
        variants={bellEntryVariants}
        animate={{
          rotate: [0, -4, 4, -3, 3, 0],
        }}
        transition={{
          rotate: {
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      >
        <Image
          src="/assets/notification-bg.png"
          alt="notification icon"
          fill
          className="object-contain"
        />
      </MotionWrapper>
    </MotionWrapper>
  );
}
