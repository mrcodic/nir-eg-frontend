"use client";

import { useTenant } from "@/context/TenantProvider";
import { SocialItem } from "@/types/tenant.types";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CustomImage from "../ui/CustomImage";

export default function SocialCard({ card }: { card: SocialItem }) {
  const { logo } = useTenant();
  return (
    <div className="bg-background hover:bg-primary-800 group flex w-full flex-col justify-between rounded-lg p-4 transition-all">
      <div className="mt-auto flex flex-col items-center gap-4">
        {card?.image && (
          <motion.div
            animate={{ rotateY: 360 * 2, rotateZ: [0, 45, 0] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeatDelay: 2,
              repeat: Infinity,
            }}
          >
            <CustomImage
              src={card.image}
              fallback={logo}
              width={88}
              height={88}
              alt={card.name}
              className="size-22 object-contain"
            />
          </motion.div>
        )}

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
