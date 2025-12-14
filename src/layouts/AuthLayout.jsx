"use client";

import { getCurrentTemplate } from "@/helpers/sass";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const AuthLayout = ({ children, img }) => {
  const template = getCurrentTemplate();

  useEffect(() => {
    return () => {
      // Delay cleanup by e.g. 300ms
      setTimeout(() => {
        try {
          if (
            window.grecaptcha &&
            typeof window.grecaptcha.reset === "function"
          ) {
            window.grecaptcha.reset();
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
          "grow min-h-[calc(100%-80px)] mt-20 flex flex-wrap h-full lg:items-start",
          {
            "mt-28": template == 3,
          }
        )}
      >
        <div className="flex justify-center lg:w-[38%] bg-dark-radial max-lg:w-full max-lg:h-[400px] lg:self-stretch items-center relative">
          <Image
            className="w-full  object-cover  lg:object-bottom relative z-10"
            src="/assets/bg/design.png"
            alt="instructor photo"
            fill
          />
        </div>

        <main className="py-[62px] relative z-10 p-5 lg:w-[52%] lg:mx-auto mx-4 max-lg:w-full -mt-40 lg:mt-0 bg-white!">
          {children}
        </main>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default AuthLayout;
