// "use client";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const AuthLayout = ({ children, img }) => {
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
      <div className=" h-[calc(100%-80px)] mt-[80px]">
        <div className="flex flex-wrap h-full lg:items-start">
          <div className="flex justify-center lg:w-[38%] bg-background max-lg:w-full lg:self-stretch items-center">
            <img
              className="w-full object-contain h-fit"
              src={img}
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
              alt=""
            />
          </div>

          <main className="py-[62px] relative z-10 p-5 lg:w-[52%] lg:mx-auto mx-4 max-lg:w-full -mt-40 lg:mt-0 bg-white!">
            {children}
          </main>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default AuthLayout;
