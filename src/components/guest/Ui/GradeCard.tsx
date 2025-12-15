"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion.create(Link);

const GradeCard = ({ grade }) => {
  return (
    // max-w-[368px]
    <MotionLink
      whileHover="isHovered"
      href={`/bundles?grade=${grade.id}`}
      className="flex group relative aspect-square rounded-lg overflow-hidden "
    >
      <Image src={grade.image} fill className="-z-1" alt="grade type image" />

      <motion.div
        variants={{ isHovered: { height: "100%" } }}
        className={`bg-gradient-primary-overlay-soft transition-all  mt-auto flex-col gap-6 w-full flex z-10  justify-between p-4  rounded-t-lg backdrop-blur-xs`}
      >
        <motion.h2
          initial={{ opacity: 1 }}
          variants={{ isHovered: { opacity: 0 } }}
          className="text-[16px] font-bold text-white"
        >
          {grade.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleY: 0, position: "absolute" }}
          variants={{
            isHovered: { opacity: 1, scaleY: 1, position: "relative" },
          }}
          className="mt-auto "
        >
          <h2 className="text-base font-bold text-white">{grade.title}</h2>
          <p className="text-sm font-bold text-white">{grade.content}</p>
        </motion.div>

        <Button className="me-auto ">اشترى الان</Button>
      </motion.div>
    </MotionLink>
  );
};
export default GradeCard;
