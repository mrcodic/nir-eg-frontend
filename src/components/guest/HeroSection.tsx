import { cn } from "@/lib/utils";
import { TenantLandingResponse } from "@/types/tenant.types";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomImage from "../ui/CustomImage";

function HeroSection({
  content,
}: {
  content: TenantLandingResponse["data"]["main"];
}) {
  return (
    <section className="flex items-center justify-between gap-6 gap-x-12 max-lg:flex-col">
      <div>
        <h1 className="text-32 font-bold">{content?.title}</h1>
        <p className="mt-6 text-lg font-bold">{content?.description}</p>

        <Link href="/register">
          <Button className="mt-14">اشترك معنا</Button>
        </Link>
      </div>

      <div
        className={cn(
          "relative h-[450px] w-full max-w-[466px] overflow-hidden rounded-2xl lg:h-[600px] lg:max-w-1/2",
        )}
      >
        {content?.image && (
          <CustomImage
            src={content?.image}
            alt="hero image"
            startWithFallback={false}
            className="object-cover"
            fetchPriority="high"
            loading="eager"
            fill
          />
        )}
      </div>
    </section>
  );
}

export default HeroSection;
