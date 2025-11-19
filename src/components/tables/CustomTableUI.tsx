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
import Image from "next/image";

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

  return (
    <div className="mt-10">
      <div className="overflow-auto relative rounded-lg bg-cover p-6 md:p-12 bg-[#FBF6F0]">
        <Image
          src="/assets/paper.png"
          fill
          alt="background texture"
          className="opacity-80"
        />
        <Table
          style={{
            borderSpacing: "0 1rem",
            borderCollapse: "separate",
          }}
          className={cn("max-md:pe-1", {
            "animate-pulse opacity-70": isPlaceholderData,
          })}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-right text-[#121212] border-y border-[#012D5A] first:rounded-r-xl first:border-r last:rounded-l-xl last:border-l"
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
                <TableRow
                  key={row.id}
                  className="bg-white border border-[#D9B45C] hover:bg-muted/50"
                  style={{
                    borderSpacing: "0 1rem",
                    borderCollapse: "separate",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-[#121212] border-y border-[#D9B45C] first:rounded-r-xl first:border-r last:rounded-l-xl last:border-l p-0"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.length > 0 && (
        <div className="mt-10 mx-auto flex max-w-3xl justify-between">
          {table.getCanPreviousPage() && (
            <button
              disabled={!table.getCanPreviousPage() || isPlaceholderData}
              onClick={() => table.previousPage()}
              className="flex h-10 w-24 items-center justify-center gap-1 rounded-lg border border-colorPrimary bg-[#012D5A] text-white"
            >
              <img src="/assets/RightArrowColor.svg" alt="Previous" />
              <span className="text-sm font-bold">السابق</span>
            </button>
          )}
          {table.getCanNextPage() && (
            <button
              disabled={!table.getCanNextPage() || isPlaceholderData}
              onClick={() => table.nextPage()}
              className="flex h-10 w-24 items-center justify-center gap-2 rounded-lg border border-colorPrimary ms-auto bg-[#012D5A] text-white"
            >
              <span className="text-sm font-bold">التالى</span>
              <img src="/assets/LeftArrowColor.svg" alt="Next" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
