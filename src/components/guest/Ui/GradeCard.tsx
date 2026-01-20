"use client";

import { Button } from "@/components/ui/button";
import { Grade } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion.create(Link);

const GradeCard = ({ grade }: { grade: Grade }) => {
  return (
    // max-w-[368px]
    <MotionLink
      whileHover="isHovered"
      href={`/bundles?grade=${grade?.id}`}
      className="group relative flex aspect-square w-full max-w-[500px] overflow-hidden rounded-lg max-md:mx-auto max-md:w-full"
    >
      <Image
        src={grade?.image || "/assets/grade-placeholder.png"}
        fill
        className="-z-1"
        alt="grade type image"
      />

      <motion.div
        variants={{ isHovered: { height: "100%" } }}
        className={`bg-gradient-primary-overlay-soft z-10 mt-auto flex w-full flex-col justify-between gap-6 rounded-t-lg p-4 backdrop-blur-xs transition-all`}
      >
        <motion.h2
          initial={{ opacity: 1 }}
          variants={{ isHovered: { opacity: 0 } }}
          className="text-[16px] font-bold text-white"
        >
          {grade?.name}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleY: 0, position: "absolute" }}
          variants={{
            isHovered: { opacity: 1, scaleY: 1, position: "relative" },
          }}
          className="mt-auto"
        >
          <h2 className="text-base font-bold text-white">{grade?.name}</h2>
          <p className="text-sm font-bold text-white">محتويات {grade?.name}</p>
        </motion.div>

        <Button className="me-auto">اشترى الان</Button>
      </motion.div>
    </MotionLink>
  );
};
export default GradeCard;
