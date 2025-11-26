"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SocialCard({ card }) {
  return (
    <div className="flex justify-between flex-col bg-background p-4 rounded-lg w-full">
      <div className="flex flex-col items-center  gap-4">
        <motion.div
          animate={{ rotate: 360 * 3 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <Image src={card.icon} width={88} height={88} alt={card.title} />
        </motion.div>

        <div className="text-center font-bold text-[#121212]">
          <h2 dir="ltr" className="text-28 md:text-32">
            {card.count}
          </h2>
          <p className="md:text-base text-sm">{card.title}</p>
        </div>
      </div>

      <Link
        href={card.link}
        className="flex text-primary-800 justify-center items-center mt-6 gap-2"
      >
        <span className="font-bold underline">تابعنا الان</span>
        <ChevronLeft className="size-6" />
      </Link>
    </div>
  );
}
