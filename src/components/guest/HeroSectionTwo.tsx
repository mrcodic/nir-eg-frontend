import { cn } from "@/lib/utils";
import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

function HeroSectionTwo({
  main,
  features,
}: {
  main?: TenantLandingResponse["data"]["main"];
  features?: TenantLandingResponse["data"]["features"];
}) {
  return (
    <section className="max-mobile:flex-col flex items-center justify-between gap-x-20 gap-y-20 xl:gap-x-30.5">
      <div>
        <h1 className="text-32 font-bold">{main?.section_title}</h1>

        <div className="mt-6 flex flex-wrap gap-4">
          {features?.items?.map((feature, i) => (
            <div
              key={feature?.text || i}
              className="bg-background flex items-center gap-2 rounded-lg p-2 pe-3"
            >
              {feature?.image && (
                <Image
                  className="h-6 w-6"
                  src={feature?.image}
                  width={24}
                  height={24}
                  alt={feature?.text}
                />
              )}
              <p>{feature?.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Link href="/register">
            <Button>
              <Image
                src="/assets/launch-white.svg"
                width={20}
                height={20}
                alt="join us icon"
              />
              اشترك معنا
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">
              <Image
                src="/assets/sign-out.svg"
                width={20}
                height={20}
                alt="join us icon"
                className="transition-all group-hover/btn:brightness-0 group-hover/btn:invert"
              />
              تسجيل دخول
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "mobile:max-w-5/12 mobile:h-[600px] relative h-[400px] w-full overflow-hidden rounded-2xl",
          {
            "bg-gray-light": !main?.image,
          },
        )}
      >
        {main?.image && (
          <Image
            src={main?.image}
            fill
            alt="hero image"
            className="object-cover"
            fetchPriority="high"
            loading="eager"
          />
        )}
      </div>
    </section>
  );
}

export default HeroSectionTwo;
