"use client";

import { SocialItem } from "@/types/tenant.types";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SocialCard({ card }: { card: SocialItem }) {
  return (
    <div className="bg-background hover:bg-primary-800 group flex w-full flex-col justify-between rounded-lg p-4 transition-all">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 * 3 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        >
          {card?.image ? (
            <Image src={card.image} width={88} height={88} alt={card.name} />
          ) : (
            <div className="h-22 w-22 rounded-full bg-gray-400" />
          )}
        </motion.div>

        <div className="text-center font-bold text-black transition-all group-hover:text-white">
          <h2 dir="ltr" className="text-28 md:text-32">
            {card?.number}
          </h2>
          <p className="text-sm md:text-base">{card?.name}</p>
        </div>
      </div>

      <Link
        href={card?.link || ""}
        className="text-primary-800 group/link mt-6 flex items-center justify-center gap-2 transition-all group-hover:text-white"
      >
        <span className="font-bold underline">تابعنا الان</span>
        <ChevronLeft className="size-6 transition-all group-hover/link:-translate-x-1" />
      </Link>
    </div>
  );
}
