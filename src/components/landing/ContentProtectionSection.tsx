"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { IContentProtectionSection } from "@/types/landing.types";
import { Variants } from "motion";
import Image from "next/image";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} satisfies Variants;

const iconVariants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
    },
  },
} satisfies Variants;

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} satisfies Variants;

const floatAnimation = {
  y: [0, -10, 0],
};

export default function ContentProtectionSection({
  data,
}: {
  data: IContentProtectionSection;
}) {
  if (!data?.items?.length) return null;

  console.log("protection data : ", data);

  return (
    <MotionWrapper
      as="section"
      className="wrapper w-full relative text-center pb-12 space-y-6"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex section flex-col items-center gap-8 gap-x-16 md:flex-row md:items-center">
        {/* Right text block */}
        <div className="w-full md:w-2/3 text-right">
          {/* Title */}
          <MotionWrapper
            className="mb-6 flex items-center gap-2"
            variants={titleVariants}
          >
            <h2 className="text-xl font-bold md:text-3xl">{data.title}</h2>
            <Image
              src="/assets/lock.png"
              width={50}
              height={50}
              alt="lock icon"
            />
          </MotionWrapper>

          {/* Items */}
          <ul className="space-y-6 text-sm md:text-base">
            {data.items.map(({ title, icon_url }) => (
              <MotionWrapper
                as="li"
                key={title}
                className="flex items-center justify-start gap-3"
                variants={itemVariants}
              >
                {/* Icon */}
                <MotionWrapper
                  className={`flex relative shrink-0 size-12 items-center justify-center `}
                  variants={iconVariants}
                >
                  <Image src={icon_url} fill alt="icon" />
                </MotionWrapper>

                {/* Text */}
                <p className="font-bold text-sm md:text-xl">{title}</p>
              </MotionWrapper>
            ))}
          </ul>
        </div>

        {/* Left image */}
        <MotionWrapper
          className="w-full md:w-1/3"
          variants={imageVariants}
          animate={floatAnimation}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg bg-dark-radial">
            <Image
              src="/assets/protect.png"
              alt="قفل المحتوى"
              fill
              className="object-contain"
              quality={100}
              unoptimized
            />
          </div>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  );
}
