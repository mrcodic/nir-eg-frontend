"use client";

import RoomHeader from "@/components/RoomHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
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
import { useParams } from "next/navigation";
import { useState } from "react";
import CustomNum from "../ui/custom-num";

type StudentRank = {
  id: number;
  name: string;
  points: number;
};

const columnHelper = createColumnHelper<StudentRank>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <div className="py-3  text-[18px] font-bold">الترتيب</div>,
    cell: ({ row }) => (
      <div className="p-2  text-[16px] font-medium flex items-center justify-start">
        <CustomNum
          num={row.index + 1}
          className="size-14"
          textClassName="text-[38px]"
        />
      </div>
    ),
  }),
  columnHelper.accessor("name", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">اسم الطالب</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[156px] text-center text-[16px] font-medium flex items-center justify-center gap-6">
        <Image
          src="/assets/avatar-user.svg"
          width={48}
          height={48}
          alt="avatar"
          className="rounded-full"
        />
        <span className="text-lg font-bold text-[#121212] leading-4">
          {info.getValue()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("points", {
    header: () => (
      <div className=" px-2 text-center text-[18px] font-bold pe-8">-</div>
    ),
    cell: (info) => (
      <div className="p-2 text-[16px] font-medium flex items-end justify-end gap-2 pe-8">
        <Image src="/assets/Star.svg" width={32} height={32} alt="star" />

        <div className="relative">
          <h3 className="textStroke text-2xl absolute top-0 left-0 flex items-center z-0 text-[#012D5A]/20">
            {info.getValue()}
          </h3>

          <h3 className="relative z-10 text-2xl font-bold text-[#012D5A] top-px left-px">
            {info.getValue()}
          </h3>
        </div>

        <span className="text-xs font-bold self-end text-[#012D5A]">نقطة</span>
      </div>
    ),
  }),
];

export default function RankTable() {
  const { SingleCourse } = useParams();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      `/students/get-classrank/${SingleCourse}?per_page=5&page=${
        pagination.pageIndex + 1
      }`,
    ],
    queryFn: getDataClient,
  });

  const students = data?.body?.students || [];

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    pageCount: Math.ceil(students.length / pagination.pageSize),
    manualPagination: false,
  });

  return (
    <div className="">
      <RoomHeader title="ترتيب الطلاب" icon="/assets/RankColor1.svg" />

      <div className="overflow-auto relative rounded-lg bg-cover p-6 md:p-12 bg-background mx-auto mt-10">
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
          className="max-md:pe-1"
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
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#012D5A] border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  لا يوجد طلاب في الترتيب
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-white border border-primary-700 hover:bg-muted/50"
                  style={{
                    borderSpacing: "0 1rem",
                    borderCollapse: "separate",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-[#121212] border-y border-primary-700 first:rounded-r-xl first:border-r last:rounded-l-xl last:border-l p-0"
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
      <div className="mt-10 mx-auto flex max-w-3xl justify-between">
        {table.getCanPreviousPage() && (
          <button
            onClick={() => table.previousPage()}
            className="flex h-10 w-24 items-center justify-center gap-1 rounded-lg border border-primary bg-[#012D5A] text-white"
          >
            <img src="/assets/RightArrowColor.svg" alt="Previous" />
            <span className="text-sm font-bold">السابق</span>
          </button>
        )}
        {table.getCanNextPage() && (
          <button
            onClick={() => table.nextPage()}
            className="flex h-10 w-24 items-center justify-center gap-2 rounded-lg border border-primary ms-auto bg-[#012D5A] text-white"
          >
            <span className="text-sm font-bold">التالى</span>
            <img src="/assets/LeftArrowColor.svg" alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
}
