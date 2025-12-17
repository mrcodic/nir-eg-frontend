"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { Variants } from "motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedPhones from "./AnimatedPhones";

/* ================== Variants ================== */

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
} satisfies Variants;

const textBlockVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
} satisfies Variants;

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0.6,
    },
  },
} satisfies Variants;

/* ================== Component ================== */

function AppsLinksSection() {
  return (
    <MotionWrapper
      as="section"
      className="wrapper w-full"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className="relative p-6 overflow-hidden min-h-[500px] rounded-lg section flex">
        {/* Gradient */}
        <div className="absolute bg-blue-gradient -z-2 inset-0" />

        {/* Vector overlay */}
        <Image
          src="/bg-vector-2.svg"
          alt="background overlay image"
          fill
          className="object-contain object-bottom absolute -z-1 pointer-events-none select-none"
          priority
        />

        <div className="flex items-center max-md:flex-col justify-between grow gap-6">
          {/* Text block */}
          <MotionWrapper
            className="relative z-10 max-w-xl"
            variants={textBlockVariants}
          >
            <h4 className="text-white text-3xl font-bold">
              <span className="text-secondary drop-shadow-text">
                تطبيق نَيِّر
              </span>{" "}
              للأندرويد و الايفون
            </h4>

            <p className="text-lg font-bold mt-4 text-white">
              استفد من تجربة تعليمية متكاملة على هاتفك الذكي. قم بتحميل التطبيق
              و ابدأ التعلم فورا
            </p>

            <div className="mt-18">
              <h5 className="text-lg font-bold text-white">
                يمكنك تحميل التطبيق من هنا:
              </h5>

              <MotionWrapper
                className="flex gap-6 mt-4 flex-wrap"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
              >
                <MotionWrapper variants={buttonVariants}>
                  <Link href="#">
                    <Image
                      src="/assets/Google Play.svg"
                      alt="google play"
                      width={155}
                      height={48}
                    />
                  </Link>
                </MotionWrapper>

                <MotionWrapper variants={buttonVariants}>
                  <Link href="#">
                    <Image
                      src="/assets/apple.svg"
                      alt="apple link"
                      width={155}
                      height={48}
                    />
                  </Link>
                </MotionWrapper>
              </MotionWrapper>
            </div>
          </MotionWrapper>

          {/* Phones */}
          <AnimatedPhones />
        </div>
      </div>
    </MotionWrapper>
  );
}

export default AppsLinksSection;
