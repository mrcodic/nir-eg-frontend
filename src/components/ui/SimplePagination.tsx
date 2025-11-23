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
        "flex items-center justify-center gap-4 pt-3 border-t border-gray-light mt-2",
        className
      )}
    >
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="sm:p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-5 h-5 text-[#121212]" />
      </button>

      <span className="text-sm text-[#121212] min-w-[80px] text-center">
        صفحة {currentPage} من {lastPage}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= lastPage}
        className="sm:p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-5 h-5 text-[#121212]" />
      </button>
    </div>
  );
}
