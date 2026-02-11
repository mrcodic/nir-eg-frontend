"use client";

import Lottie from "lottie-react";

type Props = {
  animationData: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
};

export default function LottiePlayer({
  animationData,
  className,
  loop = true,
  autoplay = true,
}: Props) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}
