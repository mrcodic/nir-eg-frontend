"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { IPartner } from "@/types/landing.types";
import autoplay from "embla-carousel-autoplay";
import Image from "next/image";

function PartnersSection({ partners }: { partners: IPartner[] }) {
  return (
    <Carousel
      opts={{
        direction: "rtl",
        loop: true,
      }}
      plugins={[
        autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent wrapperClassName="peer">
        {partners.map((partner, index) => (
          <CarouselItem
            key={index}
            data-carousel="partner"
            className="carousel-item flex basis-1/2 min-[400px]:basis-1/3 items-center justify-center select-none md:basis-1/4 xl:basis-1/7"
          >
            <div className="relative flex shrink-0 size-24 items-center justify-center   bg-white transition-all  sm:size-34">
              {partner.image_url ? (
                <Image
                  src={partner.image_url}
                  fill
                  alt=""
                  className="size-full shrink-0 object-contain"
                />
              ) : (
                <h4 className="text-center shrink-0 text-sm text-font-2 line-clamp-2">
                  {partner.name}
                </h4>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default PartnersSection;
