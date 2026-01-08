"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

type AnimationData = Record<string, unknown>;

function BuildingAnimation({ isCompleted }: { isCompleted: boolean }) {
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );
  const [confettiFile, setConfettiFile] = useState<AnimationData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      const animationModule = isCompleted
        ? await import(
            "../../../../public/assets/animations/success-animation.json"
          )
        : await import("../../../../public/assets/animations/waiting.json");

      if (isMounted) {
        // 👇 THIS IS THE KEY LINE
        setAnimationData(animationModule.default);

        if (isCompleted) {
          const confettiModule = await import(
            "../../../../public/assets/animations/Celeberation.json"
          );
          setConfettiFile(confettiModule.default);
        }
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [isCompleted]);

  if (!animationData)
    return (
      <div className="sm:size-[428px] max-w-[428px] max-sm:w-full aspect-square"></div>
    );

  return (
    <div className="sm:size-[428px] max-w-[428px] max-sm:w-full aspect-square">
      {confettiFile && (
        <Lottie
          animationData={confettiFile}
          loop={false}
          className="fixed  inset-0 w-screen"
        />
      )}
      <Lottie animationData={animationData} loop={!isCompleted} />
    </div>
  );
}

export default BuildingAnimation;
