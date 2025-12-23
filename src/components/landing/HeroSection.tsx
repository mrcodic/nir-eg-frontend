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
  const yPen = useTransform(springY, [0, 1], ["-200%", "-20%"]);
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
          width={220}
          height={220}
          loading="eager"
          className="
                    absolute top-0 left-0 z-10 aspect-square
                    size-26 sm:size-40 lg:size-[220px]

                    -translate-x-4 -translate-y-16
                    sm:-translate-x-10 sm:-translate-y-20
                    lg:translate-x-[-100px] lg:translate-y-[-120px]
                  "
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
              className="
                        absolute bottom-0 left-0 z-2
                        w-20 md:w-[120px] lg:w-[168px]
                        aspect-[0.88]

                        translate-x-4
                        -translate-y-20
                        md:-translate-y-4

                        will-change-transform
                      "
            >
              <MotionWrapper
                as={Image}
                src="/assets/hero/pen-blur.png"
                alt="hero"
                fill
                priority
                className="object-contain"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
            <motion.div
              style={{ y: yBook, rotate: rotateBook }}
              className="
                        absolute bottom-0 right-0 z-2 
                        w-20 md:w-[120px] lg:w-40
                        aspect-[0.82]

                        -translate-x-4
                        -translate-y-20
                        md:-translate-y-4

                        will-change-transform
                      "
            >
              <MotionWrapper
                as={Image}
                src="/assets/hero/book-blur.png"
                alt="hero"
                fill
                priority
                className="object-contain"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
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
