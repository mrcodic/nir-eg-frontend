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
        "mt-5 mx-auto flex flex-wrap items-center justify-center [&>ul]:flex-wrap max-sm:[&>ul]:justify-center [&>ul]:gap-y-1",
        className
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
              className={`cursor-pointer size-8 sm:size-10 mx-1 sm:mx-2.5 flex items-center justify-center text-sm sm:text-base ${
                hasNextPage ? "" : "opacity-50 cursor-not-allowed"
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
              className={`cursor-pointer size-8 sm:size-10 mx-1 sm:mx-2.5 flex items-center justify-center text-sm sm:text-base ${
                hasPrevPage ? "" : "opacity-50 cursor-not-allowed"
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
            className={`size-8 cursor-pointer sm:size-10 mx-1 sm:mx-2.5 flex items-center justify-center text-sm sm:text-base ${
              item.isActive
                ? "font-semibold text-white bg-primary-800"
                : "bg-background"
            }`}
          />
        );
      }}
    />
  );
};

export default PaginationComponent;
