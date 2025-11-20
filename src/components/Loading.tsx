"use client";

import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingSpinner = ({
  className,
  spinnerClassName,
}: {
  className?: string;
  spinnerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "min-h-[250px] z-999 h-full w-full flex gap-10 justify-center items-center ",
        className
      )}
    >
      <DotLottieReact
        className={cn("size-28 mx-auto", spinnerClassName)}
        src="/Animations/roundloader.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default LoadingSpinner;
