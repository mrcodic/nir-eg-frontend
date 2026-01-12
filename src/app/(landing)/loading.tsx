import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="wrapper mt-[168px] min-h-[calc(100%-80px)] space-y-[88px] pb-[88px]"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8 lg:flex-row-reverse">
          {/* Image Skeleton */}
          <div className="w-full lg:w-1/2">
            <Skeleton className="aspect-3/4 w-full rounded-lg" />
          </div>

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
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mx-auto mb-6 h-6 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border p-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mx-auto mb-6 h-6 w-32" />
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border p-6"
            >
              <Skeleton className="h-16 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mx-auto mb-6 h-6 w-40" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mx-auto mb-8 h-7 w-48" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-3/4 w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="mr-auto h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
