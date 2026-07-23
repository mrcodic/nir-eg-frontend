import { Skeleton } from "@/components/ui/skeleton";

export default function BundlesWrapperSkeleton() {
  return (
    <div className="wrapper">
      <div className="mb-6 flex items-start gap-2">
        <Skeleton className="size-6 rounded-lg md:size-10" />
        <div className="flex flex-col gap-2">
          <Skeleton className="roundedlg h-7 w-[124px] md:h-10" />
          <Skeleton className="roundedlg h-5 w-[124px]" />
        </div>
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2 xl:gap-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            className="mobile:flex-row flex flex-col gap-6 xl:flex-col 2xl:flex-row"
            key={i}
          >
            <Skeleton className="mobile:w-[270px] bg-background max-mobile:mx-auto aspect-square max-h-[270px] w-full overflow-hidden rounded-lg" />
            <Skeleton
              className={`min-h-[155px] flex-1 rounded-lg border p-4`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
