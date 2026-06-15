import { Skeleton } from "./skeleton";

export default function RoomAccordionSkeleton() {
  return (
    <div className="border-gray-light me-2 flex w-full gap-2 rounded-lg border p-2 py-4 shadow-sm sm:me-4 sm:gap-4 md:gap-6">
      <Skeleton className="size-20 rounded-lg sm:size-[104px]" />

      <div className="w-full flex-1">
        <Skeleton className="h-7 w-24" />
        <hr className="bg-gray-light my-3 h-px md:my-4" />
        <Skeleton className="h-13 w-full max-w-40" />
      </div>
    </div>
  );
}
