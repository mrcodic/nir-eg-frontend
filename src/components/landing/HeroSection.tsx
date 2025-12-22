"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import AnimatedText from "../AnimatedText";
import MotionWrapper from "../MotionWrapper";
import { Button } from "../ui/button";
import { FloatingHeroIcons } from "./FloatingHeroIcons";

function HeroSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const springY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 1,
    bounce: 0,
  });

  const y = useTransform(springY, [0, 1], ["50%", "0%"]);

  return (
    <section className="wrapper bg-background w-full relative text-center pb-12 overflow-x-hidden">
      <Image className="z-1" fill src="/bg-vector.png" alt="" />

      <div className="flex flex-col items-center mt-12 relative z-2">
        <MotionWrapper
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.4, once: true }}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            },
          }}
          className="text-primary-800 font-bold text-xl"
        >
          أهلاً بك في نَيِّر!
        </MotionWrapper>

        <AnimatedText
          as="h1"
          text="منصة واحدة لإدارة الحصص و متابعة أداء الطلاب"
          className="text-[40px] font-bold mt-6"
          stagger={0.1}
        />
        {/* <h1 className="text-[40px] font-bold mt-6">
          منصة واحدة لإدارة الحصص و متابعة أداء الطلاب
        </h1> */}

        <AnimatedText
          text="احصل على منصة باسمك و اللوجو الخاص بك و ابدأ في متابعة أداء الطلاب و
          تنظيم المواعيد."
          className="font-bold text-xl text-gray-dark mt-2"
          stagger={0.07}
          delay={0.8}
        />
      </div>

      <MotionWrapper
        className="flex justify-center gap-4 mt-8 flex-wrap  relative z-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.4, once: true }}
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: 0.7,
            },
          },
        }}
      >
        <Link href="/subscribe?type=demo">
          <Button>احصل على النسخة التجريبية</Button>
        </Link>
        <Link href="/about">
          <Button variant="secondary">
            <Image
              src="/assets/video.svg"
              alt="video"
              className="w-6 h-6"
              width={24}
              height={24}
            />
            شاهد الفيديو التعريفي{" "}
          </Button>
        </Link>
      </MotionWrapper>

      <div className="relative z-2" ref={ref}>
        <MotionWrapper
          as={Image}
          src="/assets/graduation.svg"
          alt="graduation"
          className="absolute z-10 aspect-square 
        sm:-top-20 -top-16 -left-4 sm:-left-10 size-26 sm:size-40
        lg:-top-[120px] lg:-left-[100px] lg:size-[220px]"
          width={220}
          height={220}
          loading="eager"
          priority
          initial={{ opacity: 0 }}
          viewport={{ amount: 0.5, once: true }}
          whileInView={{ opacity: 1 }}
          animate={{
            y: [0, -8, -2, 0],
            rotate: [0, -2, 2, 0],
          }}
          transition={{
            opacity: { duration: 0.5 },

            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <MotionWrapper
          className="bg-white rounded-lg relative z-2 md:aspect-[1.7] section mt-12 overflow-hidden flex flex-col"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                when: "beforeChildren",
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.4, once: true }}
        >
          <FloatingHeroIcons />

          <motion.div style={{ y }} className="relative mt-auto pt-4">
            <MotionWrapper
              as={Image}
              src="/assets/hero/dashboard.png"
              alt="hero"
              className="w-[80%] mx-[10%]"
              width={760}
              height={540}
              priority
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </motion.div>
        </MotionWrapper>
      </div>
    </section>
  );
}

export default HeroSection;
