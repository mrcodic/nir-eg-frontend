// src/components/ProfilePointsTable.tsx
"use client";

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
import type { IPagination } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type IPointTypes = "درس" | "كورس" | "حصة" | "واجب" | "امتحان" | "كويز";

type Row = {
  id: number;
  course: string;
  date: string;
  item_title: string;
  name: string;
  value: number;
  type: IPointTypes;
  classroom_id: number;
  room_id: number;
  video_id: string;
};

export const generatePointHref = (row: Row): string => {
  const base = `/bundles/${row.classroom_id}`;

  switch (row.type) {
    case "درس":
      return `${base}/${row.room_id}?vedio_id=${row.video_id}`;
    case "كورس":
      return base;
    case "حصة":
      return `${base}/${row.room_id}`;
    case "واجب":
    case "امتحان":
    case "كويز":
      return `${base}/${row.room_id}/${row.id}`;
    default:
      return base;
  }
};
const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.accessor("name", {
    header: () => (
      <div className="py-3 px-2 w-full text-[18px] font-bold">الأنشطة</div>
    ),
    cell: (info) => (
      <div className="p-2 max-w-[200px] truncate md:max-w-[250px] text-[16px] font-medium flex gap-1 ">
        <p className="">{info.getValue()}</p>
        <Link
          href={generatePointHref(info.row.original)}
          className="text-primary-700  font-bold underline truncate"
        >
          {info.row.original.item_title}
        </Link>
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    header: () => (
      <div className="w-[100px] px-2 text-[18px] font-bold">النوع</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[100px] text-center text-[16px] font-medium">
        {info?.getValue() || "-"}
      </div>
    ),
  }),
  columnHelper.accessor("course", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">الكورس</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[156px] text-center text-[16px] font-medium truncate">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("date", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[110px] text-center text-[16px] font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("value", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">-</div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-4 w-full justify-start p-2">
        <div className="flex shrink-0 items-center gap-2 rounded-lg w-[136px]">
          <Image src="/assets/Star.svg" width={32} height={32} alt="Star" />
          <span className="text-2xl font-bold text-[#012D5A]">
            {info.getValue()}
          </span>
          <span className="text-[16px] font-bold text-[#012D5A]">نقطة</span>
        </div>
      </div>
    ),
  }),
];

function ProfilePointsTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      `/students/studentFile?per_page=5&page=${pagination.pageIndex + 1}`,
    ],
    queryFn: getDataClient as () => Promise<IPagination<Row>>,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    pageCount: data?.meta?.last_page ?? -1,
    manualPagination: true,
  });

  console.log("table data : ", data);

  return (
    <div className="mt-10 scroll-m-28" id="points-table">
      <div className="overflow-auto relative rounded-lg bg-cover p-6 md:p-12 bg-background">
        <Image
          src="/assets/paper.png"
          fill
          alt="background image"
          className="opacity-80"
        />
        <Table
          style={{
            borderSpacing: "0 1rem",
            borderCollapse: "separate",
          }}
          className="max-md:pe-1"
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-right text-[#121212] border-y border-[#012D5A] first:rounded-r-xl first:border-r last:rounded-l-xl last:border-l "
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
                <TableCell colSpan={5} className="text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Empty text="لا يوجد نقاط بعد" />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id + "row"}
                  className="bg-white border border-gray-light hover:bg-muted/50"
                  style={{
                    borderSpacing: "0 1rem",
                    borderCollapse: "separate",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id + "cell"}
                      className={cn(
                        " text-[#121212] border-y border-gray-light first:rounded-r-xl first:border-r last:rounded-l-xl last:border-l p-0 "
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

      {/** Pagination – unchanged */}
      <div className="mt-10 mx-auto flex max-w-3xl justify-between">
        {table.getCanPreviousPage() && (
          <button
            onClick={() => table.previousPage()}
            className="flex h-10 w-24 items-center justify-center gap-1 rounded-lg border border-primary bg-[#012D5A] text-white"
          >
            <img src="/assets/RightArrowColor.svg" alt="" />
            <span className="text-sm font-bold">السابق</span>
          </button>
        )}
        {table.getCanNextPage() && (
          <button
            onClick={() => table.nextPage()}
            className="flex h-10 w-24 items-center justify-center gap-2 rounded-lg border border-primary ms-auto bg-[#012D5A] text-white"
          >
            <span className="text-sm font-bold">التالى</span>
            <img src="/assets/LeftArrowColor.svg" alt="" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePointsTable;
