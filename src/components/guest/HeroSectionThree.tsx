"use client";

import { useAuthContext } from "@/context/auth-context";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { TenantLandingResponse } from "@/types/tenant.types";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomImage from "../ui/CustomImage";

function HeroSectionThree({
  content,
}: {
  content: TenantLandingResponse["data"]["main"];
}) {
  const isMounted = useMounted();
  const { profile } = useAuthContext();

  const hideJoinUs = isMounted && !!profile;

  return (
    <section className="bg-primary-800 pt-[168px] pb-16">
      <div className="wrapper max-mobile:flex-col flex items-center justify-between gap-x-20 gap-y-20 xl:gap-x-30.5">
        <div>
          <h1 className="text-5xl font-black text-white">{content?.title}</h1>

          <p className="mt-6 text-xl font-bold text-white">
            {content?.description}
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <Link href={hideJoinUs ? "/bundles" : "/register"}>
              <Button
                variant="outline"
                className="hover:text-primary-800 h-auto max-w-full border-white px-12 py-4 text-2xl font-bold text-white hover:border-white hover:bg-white"
              >
                {hideJoinUs ? "تصفح الباقات" : "اشترك الان!"}
              </Button>
            </Link>
          </div>
        </div>

        {content?.image && (
          <div
            className={cn(
              "mobile:max-w-[466px] relative aspect-square w-full overflow-hidden",
            )}
          >
            <CustomImage
              src={content?.image}
              fill
              alt="hero image"
              startWithFallback={false}
              className="object-contain"
              fetchPriority="high"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSectionThree;
