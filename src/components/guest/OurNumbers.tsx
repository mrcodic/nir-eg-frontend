"use client";

import { TenantLandingResponse } from "@/types/tenant.types";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "./Ui/SectionTitle";

const numbers = [
  {
    icon: "/assets/subscribe-3d.png",
    count: "1000",
    title: "اشتراك",
  },
  {
    icon: "/assets/graduation.png",
    count: "1000",
    title: "طالب",
  },
  {
    icon: "/assets/course.png",
    count: "1000",
    title: "حصة",
  },
];

type OurNumbersTwoProps = {
  variant?: "default" | "floating";
  numbers: TenantLandingResponse["data"]["numbers"];
};

function OurNumbersTwo({ variant = "default", numbers }: OurNumbersTwoProps) {
  if (!numbers?.items?.length) return null;

  return (
    <section>
      <SectionTitle title={numbers?.section_title} />

      {variant === "floating" ? (
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-12">
          {numbers?.items?.map((number, index) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              className="border-primary-800 relative flex flex-col items-center rounded-lg border bg-white pt-10 pb-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-900"
            >
              <div className="absolute -top-10">
                <motion.div
                  variants={{
                    idle: { y: 0, rotate: 0 },
                    hover: {
                      y: [0, -5, -10, 0],
                      rotate: [0, 5, -5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut",
                      },
                    },
                  }}
                >
                  {number?.image && (
                    <Image
                      src={number?.image}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain drop-shadow-md"
                      alt={number?.title}
                    />
                  )}
                </motion.div>
              </div>

              <div className="mt-2 text-center">
                <h2 className="text-4xl font-bold text-black dark:text-white">
                  {number?.number}
                </h2>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  {number?.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-background mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 rounded-lg px-4 py-6 md:px-6 md:py-8">
          {numbers?.items?.map((number, index) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              className="border-primary-800 flex items-center gap-4 rounded-lg border p-2 md:p-4"
            >
              <motion.div
                variants={{
                  idle: { y: 0, rotate: 0 },
                  hover: {
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                {number?.image && (
                  <Image
                    src={number?.image}
                    width={96}
                    height={96}
                    className="size-16 md:size-24"
                    alt={number?.title}
                  />
                )}
              </motion.div>
              <div>
                <h2 className="md:text-40 text-3xl font-bold">
                  {number?.number}
                </h2>
                <p className="text-xl font-bold md:text-2xl">{number?.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OurNumbersTwo;
