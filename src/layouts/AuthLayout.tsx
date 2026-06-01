"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const AuthLayout = ({ children }) => {
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
        <div className="bg-primary-radial relative flex items-center justify-center max-lg:h-[400px] max-lg:w-full lg:w-[38%] lg:self-stretch">
          <Image
            className="relative z-10 w-full object-cover lg:object-bottom"
            src="/assets/bg/design.png"
            alt="instructor photo"
            fill
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
