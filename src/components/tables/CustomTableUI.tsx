import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/Loading";
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
  isLoading: boolean;
  isPlaceholderData: boolean;
};

export default function CustomTableUI({
  data,
  columns,
  setPagination,
  pagination,
  pageCount,
  isLoading,
  isPlaceholderData,
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

  console.log(data);

  if (!data.length && pagination.page === 1) {
    return <Empty text="لا يوجد درجات بعد" />;
  }

  return (
    <div className="overflow-auto relative border border-gray-light rounded-lg bg-cover p-4 bg-white mt-10">
      <Table
        className={cn("max-md:pe-1 border-separate border-spacing-0", {
          "animate-pulse opacity-70": isPlaceholderData,
        })}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-background ">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-right border-b first:rounded-tr-lg last:rounded-tl-lg"
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <Empty text="لا يوجد درجات بعد" />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(" border-y border-gray-light p-0 py-2")}
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
        <div className="mt-10 mx-auto flex  justify-between">
          {table.getCanPreviousPage() && (
            <button
              disabled={!table.getCanPreviousPage() || isPlaceholderData}
              onClick={() => table.previousPage()}
              className="flex h-10 w-24 items-center justify-center gap-1 rounded-lg  hover:bg-primary-800 bg-transparent border border-primary-800 hover:text-white text-primary-800 transition-all cursor-pointer"
            >
              <ChevronRight />
              <span className="text-sm font-bold">السابق</span>
            </button>
          )}
          {table.getCanNextPage() && (
            <button
              disabled={!table.getCanNextPage() || isPlaceholderData}
              onClick={() => table.nextPage()}
              className="flex h-10 w-24 items-center justify-center gap-2 rounded-lg  ms-auto hover:bg-primary-800 bg-transparent border border-primary-800 hover:text-white text-primary-800 transition-all cursor-pointer"
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
