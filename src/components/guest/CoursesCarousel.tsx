import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { ApiResponse, IUser } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CustomImage from "../ui/CustomImage";
import PriceBubbles from "../ui/price-bubble";
import SectionTitle from "./SectionTitle";

interface ILandingCourse {
  id: number;
  title: string;
  description: string;
  price: "0";
  grade_id: number;
  grade_name: string;
  image: string;
}

async function CoursesCarousel() {
  const [coursesResponse, profile] = await Promise.all([
    getServerData<{
      data: { count: number; items: ILandingCourse[] };
    }>({
      queryKey: ["courses/home"],
      optionalAuth: true,
    }),
    getServerData<ApiResponse<IUser | null>>({
      queryKey: ["/students/profile"],
    }),
  ]);

  const currentYear = new Date().getFullYear();

  if (!coursesResponse?.data?.count) return null;

  return (
    <section className="">
      <SectionTitle title={`كورسات عام ${currentYear}/${currentYear + 1}`} />

      <div className="mt-8 max-md:px-2" dir="rtl">
        <Carousel
          opts={{
            align: "center",
            direction: "rtl",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {coursesResponse?.data?.items?.map((course) => (
              <CarouselItem
                key={course.id}
                className="max-w-[500px] basis-full pl-4 md:basis-1/2 xl:basis-1/3"
              >
                <Link
                  href={!!profile?.body ? `/bundles/${course.id}` : `/bundles`}
                  className="group flex h-full cursor-pointer flex-col"
                >
                  {/* Image Placeholder */}
                  <div className="bg-background relative mb-4 flex h-[232px] w-full justify-center overflow-hidden rounded-xl">
                    <CustomImage
                      src={course?.image}
                      alt="course image"
                      fill
                      fallback="/assets/grade-placeholder.png"
                      className="object-cover transition-all group-hover:scale-105"
                    />
                  </div>

                  {/* Content Card */}
                  <div className="border-primary-800 group-hover:bg-primary-800 flex grow flex-col rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    {/* Text Info */}
                    <div className="relative mb-6 inline-block">
                      <h3 className="text-base font-bold text-black transition-all group-hover:text-white md:text-xl">
                        {course.title}
                      </h3>
                      <span className="bg-secondary absolute right-0 -bottom-1 h-[3px] w-8 rounded-full"></span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <p className="text-sm font-bold text-black transition-all group-hover:text-white md:text-lg">
                        {course.grade_name}
                      </p>
                      {/* Price Badge */}
                      <PriceBubbles price={course.price} className="ms-auto" />
                    </div>
                  </div>
                </Link>
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
