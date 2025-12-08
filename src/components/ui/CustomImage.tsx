"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: string;
};

const DEFAULT_FALLBACK = "/assets/avatar-user.svg";

export default function CustomImage({
  src,
  alt = "user avatar",
  size = 44,
  className = "",
  fallback = DEFAULT_FALLBACK,
}: AvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(src ?? fallback);

  useEffect(() => {
    setImgSrc(src ?? fallback);
  }, [src, fallback]);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <Image
      src={imgSrc}
      width={size}
      height={size}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}
