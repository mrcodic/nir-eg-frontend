"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useRef, useState } from "react";
import MotionWrapper from "../MotionWrapper";

const variants = {
  hidden: {},
  visible: {},
};

const textVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const videoVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const videoButtonVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: [0.5, 1.2, 1],
  },
};

export default function WhatIsNirHero({
  description,
  video_url,
}: {
  description: string;
  video_url: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section dir="rtl">
      <MotionWrapper
        key="what-is-nir-hero"
        className="section flex lg:items-center 2xl:gap-30 gap-16 lg:gap-8 xl:gap-24 max-lg:flex-col"
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5, once: true }}
      >
        {/* Title + description */}
        <MotionWrapper
          className="space-y-3"
          variants={textVariants}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-2xl md:text-[40px] font-bold">
            ما هو{" "}
            <span className="text-primary-800 drop-shadow-text "> نَيِّر </span>
            ؟
          </h1>
          <p className="text-base md:text-xl text-gray-dark ">{description}</p>
        </MotionWrapper>

        {/* Video thumbnail */}
        <MotionWrapper
          className="flex relative lg:ms-auto w-full justify-center max-w-[466px] rounded-lg overflow-hidden max-lg:mx-auto"
          variants={videoVariants}
          transition={{
            duration: 0.5,
          }}
        >
          <Image
            src="/assets/video-thumbnail.png"
            alt="فيديو نَيِّر"
            width={600}
            height={340}
            className="size-full rounded-lg object-cover"
            priority={true}
            fetchPriority="high"
            loading="eager"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

          {/* Play button */}
          <MotionWrapper
            className="absolute inset-0 flex items-center justify-center "
            variants={videoButtonVariants}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center animate-ping rounded-full z-1 size-18 bg-gray-100 " />

            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex cursor-pointer relative z-2 size-16 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-8 ring-white transition-transform hover:scale-105"
            >
              <span className="ml-2 inline-block h-0 w-0 border-y-14 border-y-transparent border-l-22 border-white" />
            </button>
          </MotionWrapper>
        </MotionWrapper>
      </MotionWrapper>

      {/* Fullscreen Video Modal - Video only loads when modal is open */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-[95vw] w-full  aspect-video max-h-[95vh]  p-0 bg-black border-none rounded-xl overflow-hidden sm:max-w-[95vw]"
          showCloseButton={true}
        >
          <VisuallyHidden>
            <DialogTitle>فيديو نَيِّر</DialogTitle>
          </VisuallyHidden>
          <div className="relative mx-auto  h-full">
            {isOpen && (
              <video
                ref={videoRef}
                className="h-full aspect-video"
                controls
                autoPlay
              >
                <source src={video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
