import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="wrapper mt-[168px] min-h-[calc(100%-80px)] space-y-[88px] pb-[88px]"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-8 lg:flex-row-reverse">
          {/* Image Skeleton */}

          <Skeleton className="h-[450px] w-full max-w-[466px] overflow-hidden lg:h-[600px] lg:max-w-1/2" />

          {/* Content Skeleton */}
          <div className="w-full space-y-6 lg:w-1/2">
            {/* Title */}
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-2/3" />

            {/* Metadata */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Stats Section */}
      <div className="container mx-auto">
        <Skeleton className="mx-auto mb-6 h-6 w-48" />
        <div className="grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex size-full min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border p-4 max-sm:max-w-[450px]"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto">
        <Skeleton className="mx-auto mb-8 h-7 w-48" />
        <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="relative flex aspect-square w-full max-w-[400px] flex-col overflow-hidden rounded-lg border border-gray-200 max-md:mx-auto max-md:w-full sm:max-w-[500px] md:max-w-[500px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
