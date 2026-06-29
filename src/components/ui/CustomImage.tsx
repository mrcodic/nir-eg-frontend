"use client";

import Image from "next/image";
import { ComponentProps, useEffect, useState } from "react";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: string;
  startWithFallback?: boolean;
};

const DEFAULT_FALLBACK = "/assets/avatar-user.svg";

type ImageProps = ComponentProps<typeof Image>;

export default function CustomImage({
  src,
  alt = "user avatar",
  size = 44,
  className = "",
  fallback = DEFAULT_FALLBACK,
  startWithFallback = true,
  ...props
}: AvatarProps & ImageProps) {
  // Always start with fallback so there's never a broken image flash
  const [imgSrc, setImgSrc] = useState<string>(
    startWithFallback ? fallback : src,
  );

  useEffect(() => {
    if (!src) {
      setImgSrc(fallback);
      return;
    }

    // Probe the src in the background before showing it
    const probe = new window.Image();
    probe.src = src as string;

    probe.onload = () => setImgSrc(src as string);
    probe.onerror = () => setImgSrc(fallback);

    return () => {
      // Prevent stale callbacks if src/fallback changes before probe finishes
      probe.onload = null;
      probe.onerror = null;
    };
  }, [src, fallback]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      {...(props?.fill
        ? {}
        : { width: props?.width || size, height: props?.height || size })}
      {...props}
    />
  );
}
