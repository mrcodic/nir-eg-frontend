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
import { ChevronLeft, MapPin, User } from "lucide-react";
import Image from "next/image";
import React from "react";

type Card = {
  id: number;
  clientName: string;
  projectName: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
};

const SAMPLE_CARDS: Card[] = [
  {
    id: 1,
    clientName: "اسم العميل",
    projectName: "اسم المشروع",
    description: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: 2,
    clientName: "اسم العميل",
    projectName: "اسم المشروع",
    description: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: 3,
    clientName: "اسم العميل",
    projectName: "اسم المشروع",
    description: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: 4,
    clientName: "اسم العميل",
    projectName: "اسم المشروع",
    description: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.",
    icon: <User className="w-5 h-5" />,
  },
];

export default function ClientsCarousel({ className }: { className?: string }) {
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
    <div className={cn("wrapper w-full relative  ", className)}>
      <div dir="rtl" className="max-w-7xl mx-auto">
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
            className="hidden md:flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light left-0 z-10"
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<ChevronLeft className="size-6" />}
          />

          <CarouselContent wrapperClassName="px-0 py-4">
            {SAMPLE_CARDS.map((c, index) => (
              <CarouselItem
                key={c.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <CardItem {...c} isActive={index - 1 === activeIndex} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Next button */}
          <CarouselNext
            className="hidden md:flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light right-0 z-10"
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
  id,
  clientName,
  projectName,
  description,
  icon,
  isActive,
}: Card) {
  return (
    <article
      className={cn(
        "mx-3 rounded-lg border bg-white py-8 px-4 min-h-[140px] flex flex-col",
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
              {clientName}
            </h3>
            <p className=" text-gray-dark ">{projectName}</p>
          </div>
        </div>

        <Image
          src="/logo-2.svg"
          alt="logo"
          width={52}
          height={52}
          className=""
        />
      </header>

      <p className="mt-6 flex-1 text-center">{description}</p>
    </article>
  );
}
