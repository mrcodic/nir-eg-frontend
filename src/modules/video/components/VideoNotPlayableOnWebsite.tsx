"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { openDesktopAuthDeeplink } from "@/helpers/auth-deeplink";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const googleAppLink = process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK;
const appStoreLink = process.env.NEXT_PUBLIC_APP_STORE_LINK;

const linkClassName =
  "rounded-xl h-10 transition-all duration-200 overflow-hidden hover:scale-105  active:scale-95";

export default function VideoNotPlayableOnWebsite() {
  const { token } = useAuthContext();
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-white p-4">
      <div className="relative mx-auto aspect-square w-full max-w-24 sm:max-w-60">
        <Image
          src="/assets/bg/error.svg"
          alt="NIR EDU"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <p className="text-lg font-bold">
          هذا الفيديو غير قابل للعرض على المتصفح
        </p>
        <p className="text-gray-505 mt-2 max-w-md text-xs sm:text-sm">
          يمكنك مشاهدة هذا الفيديو من خلال تحميل التطبيق على هاتفك أو فتح تطبيق
          سطح المكتب.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-7">
          {googleAppLink && (
            <a
              href={googleAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              <Image
                src="/assets/google.svg"
                alt="Google Play"
                width={120}
                height={40}
                className="h-10 object-contain"
              />
            </a>
          )}

          {appStoreLink && (
            <a
              href={appStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              <Image
                src="/assets/apple.svg"
                alt="App Store"
                width={120}
                height={40}
                className="h-10 object-contain"
              />
            </a>
          )}

          <div className="flex w-full justify-center">
            <Button
              type="button"
              onClick={() =>
                openDesktopAuthDeeplink(token, {
                  onFailure: () =>
                    toast({
                      icon: "error",
                      description: "يرجى تحميل التطبيق أولا",
                    }),
                })
              }
            >
              فتح تطبيق سطح المكتب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
