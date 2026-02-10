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
        "z-20 flex h-full min-h-[250px] w-full items-center justify-center gap-10",
        className,
      )}
    >
      <DotLottieReact
        className={cn("mx-auto size-28", spinnerClassName)}
        src="/Animations/roundloader-blue.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default LoadingSpinner;
