import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

function HeroSectionThree({
  content,
}: {
  content: TenantLandingResponse["data"]["main"];
}) {
  return (
    <section className="bg-primary-800 pt-[168px] pb-16">
      <div className="wrapper max-mobile:flex-col flex items-center justify-between gap-x-20 gap-y-20 xl:gap-x-30.5">
        <div>
          <h1 className="text-5xl font-black text-white">{content?.title}</h1>

          <p className="mt-6 text-xl font-bold text-white">
            {content?.description}
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <Link href="/register">
              <Button
                variant="outline"
                className="hover:text-primary-800 h-auto max-w-full border-white px-12 py-4 text-2xl font-bold text-white hover:border-white hover:bg-white"
              >
                اشترك الان!
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "mobile:max-w-[466px] bg-gray-light relative aspect-square w-full overflow-hidden rounded-2xl",
            {
              "bg-gray-light": !content?.image,
            },
          )}
        >
          {content?.image && (
            <Image
              src={content?.image}
              fill
              alt="hero image"
              fetchPriority="high"
              loading="eager"
              className="object-contain"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSectionThree;
