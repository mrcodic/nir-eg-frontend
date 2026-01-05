"use client";

import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  path: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
};

export default function LottieFromPath({
  path,
  className,
  loop = true,
  autoplay = true,
}: Props) {
  const [animationData, setAnimationData] = useState<any>(null);

  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (loadedRef.current) return;

    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
          loadedRef.current = true;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}
