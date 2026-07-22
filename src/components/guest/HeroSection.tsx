"use client";

import { useAuthContext } from "@/context/auth-context";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomImage from "../ui/CustomImage";

function HeroSection({
  content,
}: {
  content: TenantLandingResponse["data"]["main"];
}) {
  const isMounted = useMounted();
  const { profile } = useAuthContext();

  const hideJoinUs = isMounted && !!profile;

  return (
    <section className="flex items-center justify-between gap-6 gap-x-12 max-lg:flex-col">
      <div className="">
        <h1 className="text-32 font-bold">{content?.title}</h1>
        <p className="mt-6 text-lg font-bold">{content?.description}</p>

        {hideJoinUs ? (
          <Link href="/bundles" className="block w-full max-w-[163px]">
            <Button className="mt-14 w-full">
              <Image
                src="/assets/launch-white.svg"
                width={20}
                height={20}
                alt="join us icon"
              />
              تصفح الكورسات
            </Button>
          </Link>
        ) : (
          <Link href="/register" className="block w-full max-w-[163px]">
            <Button className="mt-14 w-full">
              <Image
                src="/assets/launch-white.svg"
                width={20}
                height={20}
                alt="join us icon"
              />
              اشترك معنا
            </Button>
          </Link>
        )}
      </div>

      {content?.image && (
        <div
          className={cn(
            "relative h-[450px] w-full max-w-[466px] overflow-hidden lg:h-[600px] lg:max-w-1/2",
          )}
        >
          <CustomImage
            src={content?.image}
            alt="hero image"
            startWithFallback={false}
            className="object-contain"
            fetchPriority="high"
            loading="eager"
            fill
          />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
