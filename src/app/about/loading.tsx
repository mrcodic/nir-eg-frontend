import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoading() {
  return (
    <div className="flex w-full flex-col gap-22 md:my-22 my-16 wrapper">
      {/* ================= Hero / Video Section ================= */}
      <section className="section flex  w-full items-center 2xl:gap-30 gap-16 lg:gap-8 xl:gap-24 max-lg:flex-col">
        {/* Text */}
        <div className="space-y-4 w-full">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {/* Video / Image */}
        <Skeleton className="aspect-video w-full rounded-xl max-w-[466px]" />
      </section>

      {/* ================= Features Grid ================= */}
      <section className="space-y-8">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-2/3" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-md:justify-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-4 border border-gray-light rounded-lg max-md:max-w-[360px] aspect-square p-5"
            >
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= Who Can Use Section ================= */}
      <section className="space-y-8">
        <Skeleton className="h-6 w-1/3 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="rounded-lg min-h-[264px]" />
          ))}
        </div>
      </section>
    </div>
  );
}
