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
                  <div className="rounded-xl border border-primary-800 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ">
                    {/* Text Info */}
                    <div className="relative mb-1 inline-block">
                      <h3 className="md:text-xl text-base font-bold text-black">
                        {course.title}
                      </h3>
                      <span className="absolute -bottom-1 right-0 h-[3px] w-8 rounded-full bg-secondary"></span>
                    </div>

                    <div className="flex items-center justify-between gap-6 mt-6 flex-wrap">
                      <p className="md:text-xl text-base font-bold ">
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
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light -left-5 z-10"
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<ChevronLeft className="size-6!" />}
          />
          <CarouselNext
            className="flex size-11 bg-background  items-center justify-center rounded-lg shadow-sm border border-gray-light -right-6 z-10"
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
