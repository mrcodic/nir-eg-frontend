// components/motion/Animate.tsx
"use client";

import {
  motion,
  type Variants,
  type Transition,
  type HTMLMotionProps,
  type Easing,
} from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

type As =
  | "div"
  | "section"
  | "article"
  | "ul"
  | "li"
  | "span"
  | "p"
  | "header"
  | "footer"
  | "main"
  | "aside"
  | "nav"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

type PresetVariant =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "scaleUp"
  | "blurIn"
  | "flipX"
  | "flipY"
  | "bounceIn"
  | "none"; // use custom variants

interface AnimateProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  as?: As;
  children?: React.ReactNode;
  className?: string;

  // ── Preset ──────────────────────────────────────────────────────────────────
  preset?: PresetVariant;

  // ── Preset tweaks (only applied on top of a preset) ─────────────────────────
  distance?: number; // how far slide/flip travels  (default: 24)
  blur?: number; // blur amount in px for blurIn (default: 8)

  // ── Timing ──────────────────────────────────────────────────────────────────
  delay?: number;
  duration?: number;
  ease?: Easing | Easing[];

  // ── Viewport ────────────────────────────────────────────────────────────────
  once?: boolean;
  amount?: number;

  // ── Trigger mode ────────────────────────────────────────────────────────────
  /**
   * "inView"  → animates when element enters viewport (default)
   * "mount"   → animates immediately on mount (good for page transitions)
   */
  trigger?: "inView" | "mount";

  // ── Full custom override ─────────────────────────────────────────────────────
  /**
   * Pass your own Framer Motion variants object.
   * Must include "hidden" and "visible" keys.
   * Overrides `preset` entirely.
   */
  variants?: Variants;

  /**
   * Override just the transition.
   */
  transition?: Transition;
}

// ─── Preset Definitions ────────────────────────────────────────────────────────

function resolvePreset(
  preset: PresetVariant,
  distance: number,
  blur: number,
): Variants {
  switch (preset) {
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

    case "slideUp":
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };

    case "slideDown":
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };

    case "slideLeft":
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };

    case "slideRight":
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };

    case "scaleIn":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
      };

    case "scaleUp":
      return {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
      };

    case "blurIn":
      return {
        hidden: { opacity: 0, filter: `blur(${blur}px)` },
        visible: { opacity: 1, filter: "blur(0px)" },
      };

    case "flipX":
      return {
        hidden: { opacity: 0, rotateX: 90 },
        visible: { opacity: 1, rotateX: 0 },
      };

    case "flipY":
      return {
        hidden: { opacity: 0, rotateY: 90 },
        visible: { opacity: 1, rotateY: 0 },
      };

    case "bounceIn":
      return {
        hidden: { opacity: 0, scale: 0.3 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 15,
          },
        },
      };

    case "none":
    default:
      return {
        hidden: {},
        visible: {},
      };
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Animate({
  as = "div",
  children,
  className,
  // preset
  preset = "fadeIn",
  distance = 24,
  blur = 8,
  // timing
  delay = 0,
  duration = 0.4,
  ease = [0.25, 0.1, 0.25, 1],
  // viewport
  once = true,
  amount = 0.15,
  // trigger
  trigger = "inView",
  // custom overrides
  variants,
  transition,
  ...rest
}: AnimateProps) {
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  const resolvedVariants = variants ?? resolvePreset(preset, distance, blur);

  const resolvedTransition: Transition = transition ?? {
    duration,
    delay,
    ease,
  };

  // bounceIn has its own transition baked into the variant's "visible" key
  // so we skip the default transition for it (unless user provides one)
  const isSelfTransitioned = !transition && preset === "bounceIn";

  const animationProps =
    trigger === "mount"
      ? {
          initial: "hidden",
          animate: "visible",
        }
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once, amount },
        };

  return (
    <Tag
      className={className}
      variants={resolvedVariants}
      {...animationProps}
      transition={isSelfTransitioned ? undefined : resolvedTransition}
      {...rest}
    >
      {children}
    </Tag>
  );
}
