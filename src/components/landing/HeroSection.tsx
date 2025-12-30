"use client";

import Lottie from "lottie-react";
import Image from "next/image";
import { preload } from "react-dom";
import heroAnimation from "../../../public/assets/animations/hero-nir.json";
import MotionWrapper from "../MotionWrapper";
import HeroButtons from "./HeroButtons";
import HeroText from "./HeroText";

function HeroSection() {
  preload("/assets/animations/hero-nir.json", {
    fetchPriority: "high",
    type: "json",
    as: "fetch",
  });

  return (
    <section className="wrapper bg-background w-full relative text-center pb-12  bg-[url('/assets/backgrounds/bg-vector.png')] bg-fill overflow-hidden">
      <HeroText />

      <HeroButtons />

      <MotionWrapper
        className="relative z-2 mt-12 section mx-auto "
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
        viewport={{ amount: 0.3, once: true }}
      >
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
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.4,
                delay: 0.5,
                ease: "easeOut",
              },
            },
          }}
          animate={{
            y: [0, -8, -2, 0],
            rotate: [0, -2, 2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <MotionWrapper
          className=" size-full min-h-[250px] sm:min-h-[310px] md:min-h-96 lg:min-h-[432px] xl:min-h-[582px] 2xl:min-h-[732px] "
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Lottie animationData={heroAnimation} />
        </MotionWrapper>
      </MotionWrapper>
    </section>
  );
}

export default HeroSection;
