"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    return () => {
      // Delay cleanup by e.g. 300ms
      setTimeout(() => {
        try {
          if (
            window?.grecaptcha &&
            typeof window?.grecaptcha.reset === "function"
          ) {
            window?.grecaptcha?.reset?.();
          }
        } catch {}
        const badge = document.querySelector(".grecaptcha-badge");
        if (badge && badge.parentNode) {
          badge.parentNode.removeChild(badge);
        }
      }, 300);
    };
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <div
        className={cn(
          "mt-20 flex h-full min-h-[calc(100%-80px)] grow flex-wrap group-data-[template=landing-v3]/template:mt-0 lg:items-start",
        )}
      >
        <div className="bg-primary-radial relative flex w-full items-center justify-center max-lg:h-[400px] lg:w-[38%] lg:self-stretch">
          <Image
            src="/assets/auth/instructor-photo.webp"
            alt="instructor photo"
            className="relative z-5 object-contain object-top lg:object-cover"
            fill
          />
          <Image
            src="/assets/auth/books-stacked.webp"
            alt="books stacked"
            className="absolute bottom-5 left-5 z-4 aspect-square object-contain lg:w-[17.8%] lg:min-w-[89px]"
            width={119}
            height={119}
          />
          <Image
            src="/assets/auth/play-button.webp"
            className="absolute bottom-1/2 left-1/8 z-4 aspect-square object-contain lg:w-[19.6%] lg:min-w-[101px]"
            width={131}
            height={131}
            alt="play button"
          />
          <Image
            src="/assets/auth/notification-bell.webp"
            className="absolute top-1/8 right-1/8 z-4 aspect-square object-contain lg:w-[22.6%] lg:min-w-[121px]"
            width={151}
            height={151}
            alt="notification bell"
          />
          <Image
            src="/assets/auth/skills.webp"
            className="absolute right-0 bottom-1/8 z-4 aspect-square object-contain object-right lg:w-[28.6%] lg:min-w-[161px]"
            width={191}
            height={191}
            alt="skills"
          />
          <Image
            src="/assets/auth/auth-shape.webp"
            className="absolute inset-x-0 top-auto bottom-0 z-1 h-3/7 w-full object-cover object-top-left"
            width={500}
            height={200}
            alt="auth shape"
          />
        </div>

        <main
          className={cn(
            "relative z-10 mx-4 -mt-40 bg-white! px-3 py-8 max-lg:w-full sm:px-5 sm:py-16 lg:mx-auto lg:mt-0 lg:w-[52%] group-data-[template=landing-v3]/template:lg:mt-32",
          )}
        >
          {children}
        </main>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default AuthLayout;
