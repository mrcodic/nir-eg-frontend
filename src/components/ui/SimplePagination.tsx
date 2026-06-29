import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  lastPage,
  onPageChange,
  className,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      dir="rtl"
      className={cn(
        "border-gray-light mt-2 flex items-center justify-center gap-4 border-t pt-3",
        className,
      )}
    >
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="rounded-md transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:p-1.5"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-5 w-5 text-black" />
      </button>

      <span className="min-w-[80px] text-center text-sm text-black">
        صفحة {currentPage} من {lastPage}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= lastPage}
        className="rounded-md transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:p-1.5"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-5 w-5 text-black" />
      </button>
    </div>
  );
}
