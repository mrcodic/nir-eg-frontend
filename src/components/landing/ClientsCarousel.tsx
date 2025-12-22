"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ITestimonial } from "@/types/landing.types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClientsCarousel({
  testimonials,
  className,
}: {
  testimonials: ITestimonial[];
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);

  useEffect(() => {
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
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light left-0 z-10 group hover:bg-primary-800"
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<ChevronLeft className="size-6 group-hover:text-white" />}
          />

          <CarouselContent
            wrapperClassName="px-0 py-4"
            className="justify-center"
          >
            {testimonials.map((c, index) => (
              <CarouselItem
                key={c.id}
                className={cn("basis-full sm:basis-1/2 lg:basis-1/3")}
              >
                <CardItem
                  testimonial={c}
                  isActive={index - 1 === activeIndex}
                  onClick={() => setSelectedTestimonial(c)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Next button */}
          <CarouselNext
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light right-0 z-10 group hover:bg-primary-800"
            variant="ghost"
            size="icon"
            aria-label="Next"
            icon={
              <ChevronLeft className="size-6 rotate-180 group-hover:text-white" />
            }
          />
        </Carousel>
      </div>

      <Dialog
        open={!!selectedTestimonial}
        onOpenChange={(open) => !open && setSelectedTestimonial(null)}
      >
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <div className="flex items-center gap-4 border-b border-gray-light pb-4">
              {selectedTestimonial?.icon_url && (
                <Image
                  src={selectedTestimonial.icon_url}
                  alt="logo"
                  width={60}
                  height={60}
                  className="size-[60px] object-contain"
                />
              )}
              <div className="text-right">
                <DialogTitle className="text-xl font-bold">
                  {selectedTestimonial?.client_name}
                </DialogTitle>
                <DialogDescription className="text-gray-dark mt-1">
                  {selectedTestimonial?.project_name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            <p className="text-right text-lg leading-relaxed whitespace-pre-wrap">
              {selectedTestimonial?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardItem({
  testimonial,
  isActive,
  onClick,
}: {
  testimonial: ITestimonial;
  isActive: boolean;
  onClick: () => void;
}) {
  const { id, client_name, project_name, description, icon_url } = testimonial;

  return (
    <article
      onClick={onClick}
      className={cn(
        "mx-3 rounded-lg h-full border border-gray-light bg-white py-8 px-4 min-h-[140px] flex flex-col select-none hover:bg-background hover:border-primary-800 transition-all cursor-pointer",
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

        <Image
          src={icon_url}
          alt="logo"
          width={52}
          height={52}
          className="size-13 object-contain"
        />
      </header>

      <p className="mt-6 flex-1 text-center line-clamp-2">{description}</p>
    </article>
  );
}
