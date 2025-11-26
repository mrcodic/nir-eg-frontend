"use client";

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
};

function OurNumbersTwo({ variant = "default" }: OurNumbersTwoProps) {
  return (
    <section>
      <SectionTitle title="أرقامنا" />

      {variant === "floating" ? (
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-12 ">
          {numbers.map((number, index) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              className="relative flex flex-col items-center rounded-lg border border-primary-800 bg-white pb-6 pt-10 shadow-sm transition-all hover:shadow-md dark:bg-slate-900"
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
                  <Image
                    src={number.icon}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain drop-shadow-md"
                    alt={number.title}
                  />
                </motion.div>
              </div>

              <div className="mt-2 text-center">
                <h2 className="text-4xl font-bold text-black dark:text-white">
                  {number.count}
                </h2>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  {number.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 rounded-lg bg-background px-4 py-6 md:px-6 md:py-8">
          {numbers.map((number, index) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              className="flex items-center gap-4 rounded-lg border border-primary-800 p-2 md:p-4"
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
                <Image
                  src={number.icon}
                  width={96}
                  height={96}
                  className="size-16 md:size-24"
                  alt={number.title}
                />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold md:text-40">
                  {number.count}
                </h2>
                <p className="text-xl font-bold md:text-2xl">{number.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OurNumbersTwo;
