"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ITestimonial } from "@/types/landing.types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ClientsCarousel({
  testimonials,
  className,
}: {
  testimonials: ITestimonial[];
  className?: string;
}) {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", update);
    api.on("reInit", update);
    update();

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className={cn("w-full relative  mt-22", className)}>
      <div dir="rtl" className="section">
        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
            loop: true,
          }}
          setApi={setApi}
          className="relative"
        >
          {/* Previous button */}
          <CarouselPrevious
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light left-0 z-10"
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<ChevronLeft className="size-6" />}
          />

          <CarouselContent
            wrapperClassName="px-0 py-4"
            className="justify-center"
          >
            {testimonials.map((c, index) => (
              <CarouselItem
                key={c.id}
                className={cn(
                  "basis-full sm:basis-1/2 lg:basis-1/3"
                  //   {
                  //   "lg:basis-full sm:basis-full": testimonials.length === 1,
                  //   "lg:basis-1/2 ": testimonials.length === 2,
                  // }
                )}
              >
                <CardItem
                  testimonial={c}
                  isActive={index - 1 === activeIndex}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Next button */}
          <CarouselNext
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light right-0 z-10"
            variant="ghost"
            size="icon"
            aria-label="Next"
            icon={<ChevronLeft className="size-6 rotate-180" />}
          />
        </Carousel>
      </div>
    </div>
  );
}

/* --- Card item (kept simple; uses Tailwind + shadcn-friendly structure) --- */
function CardItem({
  testimonial,
  isActive,
}: {
  testimonial: ITestimonial;
  isActive: boolean;
}) {
  const { id, client_name, project_name, description, icon_url } = testimonial;

  return (
    <article
      className={cn(
        "mx-3 rounded-lg border border-gray-light bg-white py-8 px-4 min-h-[140px] flex flex-col",
        {
          "lg:scale-110": isActive,
          "lg:scale-95": !isActive,
        }
      )}
      aria-labelledby={`card-title-${id}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-gray-light pb-2">
        <div className="flex items-center gap-1">
          <div className="text-right">
            <h3 id={`card-title-${id}`} className="text-lg font-bold ">
              {client_name}
            </h3>
            <p className=" text-gray-dark ">{project_name}</p>
          </div>
        </div>

        <Image src={icon_url} alt="logo" width={52} height={52} className="" />
      </header>

      <p className="mt-6 flex-1 text-center line-clamp-3">{description}</p>
    </article>
  );
}
