import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
          "relative h-[450px] w-full max-w-[466px] overflow-hidden lg:h-[600px] lg:max-w-1/2",
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
            className="object-contain"
            fetchPriority="high"
            loading="eager"
          />
        )}
      </div>
    </section>
  );
}

export default HeroSection;
