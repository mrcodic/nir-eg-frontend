"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
      <Image
        className="z-1"
        fill
        src="/bg-vector.png"
        alt=""
        loading="eager"
        priority={true}
        fetchPriority="high"
      />

      <HeroText />

      <HeroButtons />

      <div className="relative z-2" ref={ref}>
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
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        </MotionWrapper>
      </div>
    </section>
  );
}

export default HeroSection;
