"use client";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { Suspense } from "react";

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "min-h-[250px] z-99999999999! h-full w-full flex gap-10 justify-center items-center ",
        className
      )}
    >
      <DotLottieReact
        className="w-[112px] h-[112px] mx-auto"
        src="/Animations/roundloader.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default LoadingSpinner;
