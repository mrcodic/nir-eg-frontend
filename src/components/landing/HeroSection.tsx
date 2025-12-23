"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import MotionWrapper from "../MotionWrapper";
import { FloatingHeroIcons } from "./FloatingHeroIcons";
import HeroButtons from "./HeroButtons";
import HeroText from "./HeroText";

function HeroSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "start start"],
  });

  const springY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 1,
    bounce: 0,
  });

  const y = useTransform(springY, [0, 1], ["50%", "0%"]);
  const yPen = useTransform(springY, [0, 1], ["-180%", "-20%"]);
  const rotatePen = useTransform(springY, [0, 1], [0, 65]);

  const yBook = useTransform(springY, [0, 1], ["120%", "-70%"]);
  const rotateBook = useTransform(springY, [0, 1], [20, -50]);

  return (
    <section className="wrapper bg-background w-full relative text-center pb-12 overflow-x-hidden bg-[url('/bg-vector.png')] bg-no-repeat bg-cover">
      {/* <Image
        className="z-1 object-cover"
        fill
        src="/bg-vector.png"
        alt=""
        loading="eager"
        priority={true}
        fetchPriority="high"
      /> */}

      <HeroText />

      <HeroButtons />

      <div className="relative z-2 section mx-auto " ref={ref}>
        <MotionWrapper
          as={Image}
          src="/assets/graduation.png"
          alt="graduation"
          className="absolute z-10 aspect-square 
        sm:-top-20 -top-16 -left-4 sm:-left-10 size-26 sm:size-40
        lg:-top-[120px] lg:-left-[100px] lg:size-[220px]"
          width={220}
          height={220}
          loading="eager"
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

          <div className="relative mt-auto pt-4">
            <motion.div style={{ y }} className="w-[80%] mx-[10%] relative z-3">
              <MotionWrapper
                as={Image}
                src="/assets/hero/dashboard.png"
                alt="hero"
                className="w-full h-auto"
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
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>

            <motion.div
              style={{ y: yPen, rotate: rotatePen }}
              className="absolute left-4 bottom-20 md:bottom-4 z-2 lg:w-[168px] md:w-[120px] w-20  aspect-[0.88]"
            >
              <MotionWrapper
                as={Image}
                src="/assets/hero/pen-blur.png"
                alt="hero"
                className="object-contain"
                fill
                priority
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
            <motion.div
              style={{ y: yBook, rotate: rotateBook }}
              className="absolute right-4 bottom-20 md:bottom-4 z-2 aspect-[0.82] lg:w-40 md:w-[120px] w-20"
            >
              <MotionWrapper
                as={Image}
                src="/assets/hero/book-blur.png"
                alt="hero"
                className="object-contain "
                fill
                priority
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}

export default HeroSection;
