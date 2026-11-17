import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section
      className="wrapper mt-28 mb-10 flex flex-col gap-4 lg:mt-32 lg:gap-5"
      aria-busy="true"
      aria-label="جارٍ تحميل الحضور والتقييمات"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-20 w-full rounded-xl md:h-11 md:w-60" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-60 rounded-xl lg:order-2 lg:h-80" />
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </section>
  );
}
