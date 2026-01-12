import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft } from "lucide-react";
import PriceBubbles from "../ui/price-bubble";
import SectionTitle from "./Ui/SectionTitle";

const courses = [
  {
    id: 1,
    title: "كورس المراجعة",
    grade: "الصف الثالث الثانوي",
    price: "200",
  },
  {
    id: 2,
    title: "كورس المراجعة",
    grade: "الصف الثالث الثانوي",
    price: "200",
  },
  {
    id: 3,
    title: "كورس المراجعة",
    grade: "الصف الثالث الثانوي",
    price: "200",
  },
  {
    id: 4,
    title: "كورس المراجعة",
    grade: "الصف الثالث الثانوي",
    price: "200",
  },
  {
    id: 5,
    title: "كورس المراجعة",
    grade: "الصف الثالث الثانوي",
    price: "200",
  },
];

function CoursesCarousel() {
  return (
    <section className="">
      <SectionTitle title="كورسات عام 2025/2026" />

      <div className="mt-8 max-md:px-2" dir="rtl">
        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {courses.map((course) => (
              <CarouselItem
                key={course.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="group cursor-pointer">
                  {/* Image Placeholder */}
                  <div className="mb-4 h-56 w-full rounded-xl bg-gray-200 transition-colors hover:bg-gray-300"></div>

                  {/* Content Card */}
                  <div className="border-primary-800 group-hover:bg-primary-800 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    {/* Text Info */}
                    <div className="relative mb-1 inline-block">
                      <h3 className="text-base font-bold text-black transition-all group-hover:text-white md:text-xl">
                        {course.title}
                      </h3>
                      <span className="bg-secondary absolute right-0 -bottom-1 h-[3px] w-8 rounded-full"></span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                      <p className="text-base font-bold text-black transition-all group-hover:text-white md:text-xl">
                        {course.grade}
                      </p>
                      {/* Price Badge */}
                      <PriceBubbles price={course.price} className="ms-auto" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="bg-background border-gray-light -left-5 z-10 flex size-11 items-center justify-center rounded-lg border shadow-sm"
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<ChevronLeft className="size-6!" />}
          />
          <CarouselNext
            className="bg-background border-gray-light -right-6 z-10 flex size-11 items-center justify-center rounded-lg border shadow-sm"
            variant="ghost"
            size="icon"
            aria-label="Next"
            icon={<ChevronLeft className="size-6! rotate-180" />}
          />
        </Carousel>
      </div>
    </section>
  );
}

export default CoursesCarousel;
