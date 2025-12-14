"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const ourPartners = [
  {
    name: "Google",
    image_url: "/logo.svg",
  },
  {
    name: "Microsoft",
    image_url: "/logo.svg",
  },
  {
    name: "Meta",
    image_url: "/logo.svg",
  },
  {
    name: "Apple",
    image_url: "/logo.svg",
  },
  {
    name: "Amazon",
    image_url: "/logo.svg",
  },
];

function PartnersSection() {
  return (
    <section className="wrapper w-full relative text-center  space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="text-32 font-bold">
            شركاؤنا فى{" "}
            <span className="text-primary-800 drop-shadow-text    ">
              {" "}
              النجاح{" "}
            </span>
          </h3>

          <p className="mt-4 text-lg font-bold text-gray-dark">
            وفرنا خدماتنا لنخبة من المدرسين و المراكز التعليمية
          </p>
        </div>

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
            {ourPartners.map((partner, index) => (
              <CarouselItem
                key={index}
                data-carousel="partner"
                className="carousel-item flex basis-1/2 min-[400px]:basis-1/3 items-center justify-center select-none md:basis-1/4 xl:basis-1/7"
              >
                <div className="relative flex shrink-0 size-24 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-3 bg-white p-6 transition-all  sm:size-34">
                  {partner.image_url ? (
                    <Image
                      src={partner.image_url}
                      fill
                      alt=""
                      className="size-full shrink-0 object-contain"
                    />
                  ) : (
                    <h4 className="text-center shrink-0 text-sm text-font-2">
                      {partner.name}
                    </h4>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export default PartnersSection;
