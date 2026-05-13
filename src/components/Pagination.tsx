"use client";

import { cn } from "@/lib/utils";
import { Pagination, PaginationItem } from "@heroui/pagination";

const PaginationComponent = ({
  currentPage,
  total,
  setPage,
  className,
  pageSize = 9,
}: {
  currentPage: number;
  total: number;
  setPage: (page: number) => void;
  className?: string;
  pageSize?: number;
}) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Pagination
      size="lg"
      dir="rtl"
      total={totalPages}
      onChange={setPage}
      className={cn(
        "border-primary-50 mx-auto mt-5 flex w-fit flex-wrap items-center justify-center overflow-hidden rounded-xl border shadow-md [&>ul]:flex-wrap [&>ul]:gap-y-1 max-sm:[&>ul]:justify-center",
        className,
      )}
      page={currentPage}
      showControls
      siblings={1}
      boundaries={1}
      isCompact
      renderItem={(item) => {
        if (item.value === "next") {
          const hasNextPage = currentPage < totalPages;
          return (
            <PaginationItem
              {...item}
              key={item?.key}
              className={`mx-1 flex size-8 cursor-pointer items-center justify-center text-sm sm:mx-2.5 sm:size-10 sm:text-base ${
                hasNextPage
                  ? ""
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }`}
            >
              <span className="inline">التالى</span>
            </PaginationItem>
          );
        }
        if (item.value === "prev") {
          const hasPrevPage = currentPage > 1;
          return (
            <PaginationItem
              {...item}
              key={item?.key}
              className={`mx-1 flex size-8 cursor-pointer items-center justify-center text-sm sm:mx-2.5 sm:size-10 sm:text-base ${
                hasPrevPage
                  ? ""
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }`}
            >
              <span className="inline">السابق</span>
            </PaginationItem>
          );
        }

        return (
          <PaginationItem
            {...item}
            key={item?.key}
            className={`mx-1 flex size-8 cursor-pointer items-center justify-center text-sm sm:mx-2.5 sm:size-10 sm:text-base ${
              item.isActive
                ? "bg-primary-800 pointer-events-none font-semibold text-white"
                : "bg-background"
            }`}
          />
        );
      }}
    />
  );
};

export default PaginationComponent;
