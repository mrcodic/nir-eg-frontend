import Image from "next/image";
import MotionWrapper from "../MotionWrapper";
import HeroButtons from "./HeroButtons";
import HeroText from "./HeroText";
import animationData from "../../../public/assets/animations/optimized-hero-nir.json";
import LottiePlayer from "@/lib/LottieAnimation";

function HeroSection() {
  return (
    <section className="wrapper bg-[url('/assets/backgrounds/bg-vector.png')] bg-fill overflow-hidden relative text-center pb-12">
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
              duration: 0.2,
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
                duration: 0.3,
                delay: 0.3,
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
            delay: 0.3,
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
          <LottiePlayer animationData={animationData} />
        </MotionWrapper>
      </MotionWrapper>
    </section>
  );
}

export default HeroSection;
