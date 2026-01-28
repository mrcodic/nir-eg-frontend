"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

function BundlesContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="p-6 flex flex-col justify-between rounded-lg bg-dark-radial mt-22 relative md:pe-[232px]"
    >
      {/* Text Content */}
      <div>
        <h3 className="text-28 font-bold text-white">
          أعداد الطلاب أكبر من أعداد الباقات؟
        </h3>

        <div className="space-y-4 mt-10">
          <p className="text-lg font-bold text-white">
            يمكنك التواصل معنا من هنا
          </p>

          <Link href="/contact">
            <Button
              variant={"secondary"}
              className="font-bold text-lg h-auto max-w-[150px] w-full"
            >
              تواصل معنا الان
            </Button>
          </Link>
        </div>
      </div>

      {/* Image */}
      <motion.div
        className="md:absolute ms-auto left-0 -top-15"
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: [0, 1, 1],
            scale: [0.8, 1.2, 1],
            transition: {
              duration: 0.4,
              delay: 0.5,
              ease: "easeOut",
              times: [0, 0.7, 1],
            },
          },
        }}
        transition={{
          duration: 0.3,
          delay: 0.5,
          y: {
            duration: 4,
            repeat: Infinity,
            delay: 0.5,
            ease: "easeInOut",
          },
          rotate: {
            duration: 0.3,
            delay: 0,
          },
        }}
        animate={{
          y: [0, -10, 0],
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Image
          src="/assets/talent-education.png"
          alt="phone"
          width={256}
          height={256}
        />
      </motion.div>
    </motion.div>
  );
}

export default BundlesContactCard;
