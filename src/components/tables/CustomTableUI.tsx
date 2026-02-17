import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  data: any[];
  columns: any[];
  setPagination: (pagination: any) => void;
  pagination: any;
  pageCount: number;
  isLoading?: boolean;
  isPlaceholderData?: boolean;
  errorMessage?: string;
};

export default function CustomTableUI({
  data,
  columns,
  setPagination,
  pagination,
  pageCount,
  isLoading,
  isPlaceholderData,
  errorMessage,
}: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    pageCount,
    manualPagination: true,
  });

  if (!data.length && pagination.page === 1) {
    return <Empty text={errorMessage || "لا يوجد درجات بعد"} />;
  }

  return (
    <div
      id="table"
      className="border-gray-light relative mt-10 overflow-auto rounded-lg border bg-white bg-cover p-4"
    >
      <Table
        className={cn("border-separate border-spacing-0 max-md:pe-1", {
          "animate-pulse opacity-70": isPlaceholderData,
        })}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-background">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "border-b text-right first:rounded-tr-lg last:rounded-tl-lg",
                    header.column.columnDef.meta?.headerClassName,
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <Empty text={errorMessage || "لا يوجد درجات بعد"} />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "border-gray-light border-b p-0 py-2",
                      cell.column.columnDef.meta?.cellClassName,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.length > 0 && (
        <div className="mx-auto mt-10 flex justify-between empty:hidden">
          {table.getCanPreviousPage() && (
            <button
              disabled={!table.getCanPreviousPage() || isPlaceholderData}
              onClick={() => table.previousPage()}
              className="hover:bg-primary-800 border-primary-800 text-primary-800 flex h-10 w-24 cursor-pointer items-center justify-center gap-1 rounded-lg border bg-transparent transition-all hover:text-white"
            >
              <ChevronRight />
              <span className="text-sm font-bold">السابق</span>
            </button>
          )}
          {table.getCanNextPage() && (
            <button
              disabled={!table.getCanNextPage() || isPlaceholderData}
              onClick={() => table.nextPage()}
              className="hover:bg-primary-800 border-primary-800 text-primary-800 ms-auto flex h-10 w-24 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent transition-all hover:text-white"
            >
              <span className="text-sm font-bold">التالى</span>
              <ChevronLeft />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
