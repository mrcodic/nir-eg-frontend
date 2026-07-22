"use client";

import { cn } from "@/lib/utils";
import { TenantLandingResponse } from "@/types/tenant.types";
import { motion } from "framer-motion";
import CustomImage from "../ui/CustomImage";
import SectionTitle from "./SectionTitle";

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
        <div className="mt-16 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {numbers?.items?.map((number, index, arr) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              className={cn(
                "border-primary-800 relative flex min-w-0 flex-col items-center rounded-lg border bg-white pt-10 pb-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-900",
                {
                  "md:col-span-2 xl:col-span-1":
                    arr.length === 3 && index === 2,
                },
              )}
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
                  <CustomImage
                    src={number?.image}
                    fallback="/assets/auth/books-stacked.webp"
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain drop-shadow-md"
                    alt={number?.title}
                  />
                </motion.div>
              </div>

              <div className="mt-2 min-w-0 text-center">
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
        <div className="bg-background mt-8 grid gap-6 rounded-lg px-4 py-6 md:px-6 md:py-8 lg:grid-cols-2 2xl:grid-cols-3">
          {numbers?.items?.map((number, index, arr) => (
            <div
              key={index}
              className={cn(
                "group/card border-primary-800 hover:bg-primary-800 flex items-center gap-4 rounded-lg border p-2 transition-all hover:-translate-y-1 hover:shadow-md md:p-4",
                {
                  "lg:col-span-2 2xl:col-span-1":
                    arr.length === 3 && index === 2,
                },
              )}
            >
              <div>
                <CustomImage
                  src={number?.image}
                  fallback="/assets/auth/books-stacked.webp"
                  width={96}
                  height={96}
                  className="size-16 object-contain md:size-24"
                  alt={number?.title}
                />
              </div>

              <div>
                <h2 className="lg:text-40 text-lg font-bold transition-all group-hover/card:text-white md:text-3xl">
                  {number?.number}
                </h2>
                <p className="text-sm font-bold text-gray-700 transition-all group-hover/card:text-gray-200 md:text-xl lg:text-2xl">
                  {number?.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OurNumbersTwo;
