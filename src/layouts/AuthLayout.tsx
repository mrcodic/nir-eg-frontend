"use client";

import { Animate } from "@/components/shared/Animate";
import { cn } from "@/lib/utils";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// ─── Root Layout ──────────────────────────────────────────────────────────────

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <div
        className={cn(
          "group mt-20 flex h-full min-h-[calc(100%-80px)] grow flex-wrap overflow-hidden",
          "group-data-[template=landing-v3]/template:mt-0 lg:items-start",
        )}
      >
        <AuthImageSection />
        <AuthMainContent>{children}</AuthMainContent>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default AuthLayout;

const AuthMainContent = ({ children }: { children: ReactNode }) => {
  const sharedClassName = cn(
    "relative z-10 mx-4 -mt-40 bg-white! px-3 py-8",
    "max-lg:w-full max-lg:rounded-xl sm:px-5 sm:py-16",
    "lg:mx-auto lg:mt-0 lg:w-[52%]",
    "group-data-[template=landing-v3]/template:lg:mt-32",
  );

  return (
    <>
      {/* Mobile (< lg): slide up from below */}
      <Animate
        as="main"
        preset="slideUp"
        trigger="mount"
        duration={0.6}
        delay={0.15}
        distance={72}
        className={cn(sharedClassName, "lg:hidden")}
        // aria-hidden so screen readers don't see the duplicate
        aria-hidden="true"
      >
        {children}
      </Animate>

      {/* Desktop (>= lg): slide in from the right */}
      <Animate
        as="main"
        preset="slideLeft"
        trigger="mount"
        duration={0.6}
        delay={0.15}
        distance={72}
        className={cn(sharedClassName, "max-lg:hidden")}
      >
        {children}
      </Animate>
    </>
  );
};

// ─── Image Section ────────────────────────────────────────────────────────────

const AuthImageSection = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-primary-radial relative flex w-full items-center justify-center overflow-hidden max-lg:h-[400px] lg:z-12 lg:w-[38%] lg:self-stretch">
        {/* Background shape — fadeIn, no interaction */}
        <Animate
          preset="fadeIn"
          trigger="mount"
          duration={0.45}
          className="absolute inset-0"
        >
          <Image
            src="/assets/auth/auth-shape.webp"
            className="absolute inset-x-0 top-auto bottom-0 z-1 h-4/7 w-full object-cover object-top-left lg:h-3/7"
            width={500}
            height={200}
            alt=""
            aria-hidden="true"
            // Decorative — lazy is fine (below the fold on mobile)
          />
        </Animate>

        {/* Instructor photo — LCP element, always eager */}
        <Animate
          preset="slideUp"
          trigger="mount"
          duration={0.7}
          distance={48}
          className="absolute inset-0 z-5"
        >
          <Image
            src="/assets/auth/instructor-photo.webp"
            alt="Instructor"
            className="relative object-contain object-top lg:object-cover"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 38vw"
          />
        </Animate>

        {/* ── Floating decorative elements ── */}

        <Animate
          preset="bounceIn"
          trigger="mount"
          delay={0.35}
          className="absolute bottom-5 left-5 z-4 will-change-transform lg:w-[17.8%] lg:min-w-[89px]"
        >
          <motion.div
            animate={{ y: [0, -10, 0, 6, 0], rotate: [0, -3, 0, 2, 0] }}
            transition={{
              delay: 0.75,
              duration: 6.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/auth/books-stacked.webp"
              alt=""
              aria-hidden="true"
              className="aspect-square h-auto w-full object-contain"
              width={119}
              height={119}
              loading="lazy"
              sizes="(max-width: 1023px) 89px, 17.8vw"
            />
          </motion.div>
        </Animate>

        <Animate
          preset="scaleIn"
          trigger="mount"
          delay={0.25}
          duration={0.5}
          className="absolute bottom-1/2 left-1/8 z-4 will-change-transform lg:w-[19.6%] lg:min-w-[101px]"
        >
          <motion.div
            animate={{
              y: [0, -7, 0, -3, 0],
              scale: [1, 1.04, 1, 1.02, 1],
              rotate: [0, 2.5, 0, -1.5, 0],
            }}
            transition={{
              delay: 0.6,
              duration: 5.9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/auth/play-button.webp"
              className="aspect-square h-auto w-full object-contain"
              width={131}
              height={131}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 1023px) 101px, 19.6vw"
            />
          </motion.div>
        </Animate>

        <Animate
          preset="slideDown"
          trigger="mount"
          delay={0.3}
          duration={0.55}
          distance={36}
          className="absolute top-1/8 right-1/8 z-4 will-change-transform lg:w-[22.6%] lg:min-w-[121px]"
        >
          <motion.div
            animate={{ y: [0, -8, 0, -4, 0], rotate: [0, 5, 0, -3, 0] }}
            transition={{
              delay: 0.8,
              duration: 7.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/auth/notification-bell.webp"
              className="aspect-square h-auto w-full object-contain"
              width={151}
              height={151}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 1023px) 121px, 22.6vw"
            />
          </motion.div>
        </Animate>

        <Animate
          preset="slideLeft"
          trigger="mount"
          delay={0.4}
          duration={0.55}
          distance={44}
          className="absolute right-0 bottom-1/8 z-4 will-change-transform lg:w-[28.6%] lg:min-w-[161px]"
        >
          <motion.div
            animate={{
              x: [0, -8, 0, -4, 0],
              y: [0, -5, 0, 4, 0],
              rotate: [0, -2, 0, 1.5, 0],
            }}
            transition={{
              delay: 0.9,
              duration: 8.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/auth/skills.webp"
              className="aspect-square h-auto w-full object-contain object-right"
              width={191}
              height={191}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 1023px) 161px, 28.6vw"
            />
          </motion.div>
        </Animate>
      </div>
    </MotionConfig>
  );
};
