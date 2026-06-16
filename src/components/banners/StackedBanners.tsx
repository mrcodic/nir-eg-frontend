"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface StackedBannerItem {
  id: string | number;
  content: React.ReactNode;
  icon?: string | React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  imgClassName?: string;
  animateIcon?: boolean;
  iconSize?: number;
}

interface StackedBannersProps {
  banners: StackedBannerItem[];
  containerClassName?: string;
  onDismiss?: (id: string | number) => void;
  showDismissButton?: boolean;
  animateY?: (index: number) => number;
  animateScale?: (index: number) => number;
  showAllOnHover?: boolean;
}

export default function StackedBanners({
  banners,
  containerClassName,
  onDismiss,
  showDismissButton = true,
  animateY = (index) => (index > 0 ? 6 : 0),
  animateScale = (index) => 1 - (index > 0 ? 1 : 0) * 0.02,
  showAllOnHover = true,
}: StackedBannersProps) {
  const [dismissed, setDismissed] = useState<(string | number)[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleDismiss = (id: string | number) => {
    setDismissed((prev) => [...prev, id]);
    if (onDismiss) onDismiss(id);
  };

  const activeBanners = banners.filter((b) => !dismissed.includes(b.id));
  const isExpanded = showAllOnHover && isHovered;

  if (!activeBanners.length) return null;

  return (
    <div className={cn("pointer-events-none z-30 pt-2", containerClassName)}>
      <div
        className={cn(
          "relative overflow-visible",
          showAllOnHover && "pointer-events-auto",
        )}
        onMouseEnter={() => {
          if (showAllOnHover && activeBanners.length > 1) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (showAllOnHover && activeBanners.length > 1) setIsHovered(false);
        }}
      >
        <AnimatePresence mode="popLayout">
          {activeBanners.map((banner, index) => (
            <motion.div
              key={banner.id}
              layout
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: isExpanded ? 0 : animateY(index),
                scale: isExpanded ? 1 : animateScale(index),
              }}
              exit={{
                opacity: 0,
                x: 100,
                scale: 0.9,
                transition: {
                  duration: 0.2,
                },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                zIndex: activeBanners.length - index,
                position: isExpanded
                  ? "relative"
                  : index === 0
                    ? "relative"
                    : "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
              className={cn(
                "pointer-events-auto relative flex min-h-8 flex-wrap items-center justify-between gap-5 rounded-lg border p-4 text-sm font-bold shadow-md",
                "border-primary bg-background text-black",
                isExpanded && index > 0 && "mt-1",
                banner.className,
              )}
            >
              {/* Content */}
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-wrap items-center gap-6 pe-4",
                  banner.wrapperClassName,
                )}
              >
                {banner.icon &&
                  (banner.animateIcon ? (
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, -10, 10, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    >
                      {typeof banner.icon === "string" ? (
                        <Image
                          src={banner.icon}
                          width={banner.iconSize || 40}
                          height={banner.iconSize || 40}
                          alt="icon"
                          className={banner.imgClassName}
                        />
                      ) : (
                        banner.icon
                      )}
                    </motion.div>
                  ) : typeof banner.icon === "string" ? (
                    <Image
                      src={banner.icon}
                      width={banner.iconSize || 40}
                      height={banner.iconSize || 40}
                      alt="icon"
                      className={banner.imgClassName}
                    />
                  ) : (
                    banner.icon
                  ))}

                <div className="flex-1">{banner.content}</div>
              </div>

              {/* Close button */}
              {showDismissButton && (
                <button
                  aria-label="Close banner"
                  onClick={() => handleDismiss(banner.id)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1 left-1 cursor-pointer rounded-full p-1 transition"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
