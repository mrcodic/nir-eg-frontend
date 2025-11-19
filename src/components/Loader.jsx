"use client";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

const LoaderLottie = ({ className }) => {
  return (
    <DotLottieReact
      className={cn(" size-5 mx-auto", className)}
      src="/Animations/roundloader.lottie"
      autoplay
      loop
    />
  );
};

export default LoaderLottie;
