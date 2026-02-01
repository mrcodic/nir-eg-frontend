"use client";

import LottieFromPath from "@/lib/lottie-wrapper";
import { WhyChooseSection } from "@/types/landing.types";
import MotionWrapper from "../MotionWrapper";

const animations = [
  "/assets/animations/dashboard-1.json",
  "/assets/animations/live-2.json",
  "/assets/animations/tools-3.json",
];

function WhyUsSection({ data }: { data: WhyChooseSection }) {
  if (!data?.items?.length) return null;

  return (
    <section className="wrapper w-full relative text-center  space-y-6">
      <h2 className="text-32 font-extrabold text-gradient-custom ">
        لماذا تختار نَيِّر؟
      </h2>

      <MotionWrapper
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full section gap-6 justify-center "
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.2, once: true }}
        transition={{ duration: 0.5 }}
      >
        {data?.items.map((advantage, index) => (
          <div
            key={advantage.title}
            className="flex relative items-center group  transition-all flex-col gap-6  bg-background p-4 rounded-lg overflow-hidden max-w-[462px] max-md:mx-auto max-md:w-full"
          >
            <div className="absolute opacity-0 inset-0 bg-blue-gradient group-hover:opacity-100 transition-all z-1" />

            <LottieFromPath
              path={animations[index]}
              className="size-60 aspect-square max-w-full relative z-2 h-60 w-60"
            />

            {/* Text */}
            <div className="space-y-2 text-center relative z-2">
              <h3 className="text-xl font-bold border-b border-gray-light mb-3 pb-2 group-hover:text-white transition-all group-hover:border-primary-800">
                {advantage.title}
              </h3>
              <p className="font-bold text-gray-dark text-lg group-hover:text-white transition-all">
                {advantage.description}
              </p>
            </div>
          </div>
        ))}
      </MotionWrapper>
    </section>
  );
}

export default WhyUsSection;
