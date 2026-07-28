import { Skeleton } from "../../../components/ui/skeleton";

export default function StoreItemCardSkeleton() {
  return (
    <div className="flex w-full max-w-md flex-col max-sm:mx-auto">
      <Skeleton className="min-h-[200px] w-full rounded-xl" />

      <div className="border-secondary relative -top-2 z-2 mx-auto min-h-[150px] w-[95%] grow rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-6 w-27" />
        </div>

        <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-0">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
