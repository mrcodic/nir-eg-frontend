"use client";
import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import Link from "next/link";
import React from "react";

const ClassroomActivity = () => {
  const defaultData = [
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },

    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
    {
      activity1: "رسبت في امتحان",
      activity2: "حصة رقم15",

      type: "امتحان",
      date: "19/3/2024",
      status: "ناجح",
    },
  ];
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("activities", {
      header: () => <div className="py-4">الأنشطة</div>,
      cell: ({ cell, row }) => (
        <div class="py-6 w-[363px]  text-[14px] flex items-center gap-2 whitespace-nowrap">
          {row.original.activity1}
          <Link href="#" class="text-[#2E77AE] underline">
            {row.original.activity2}
          </Link>
        </div>
      ),
    }),

    columnHelper.accessor("type", {
      header: () => "النوع",
      cell: (info) => (
        <div class=" py-6 w-[169px]  text-[14px] flex items-center gap-2 whitespace-nowrap">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: () => "التاريخ",
      cell: (info) => (
        <div class=" py-6 w-[73px]  text-[14px] flex items-center gap-2 whitespace-nowrap">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "النقاط",
      cell: (info) => (
        <div class=" py-6 w-[73px] text-[14px] flex items-center gap-2 whitespace-nowrap">
          <button className="bg-[#DF6060] text-[14px] px-[24px] h-[32px] text-white rounded-[8px]">
            {info.getValue()}
          </button>
        </div>
      ),
    }),
  ];
  const [data, _setData] = React.useState(() => [...defaultData]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });
  const rerender = React.useReducer(() => ({}), {})[1];
  return (
    <div class="w-[60%] mx-auto">
      <table className="w-full">
        <thead className="text-[18px]  text-right  py-4 uppercase border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="border h-[40px] w-[40px]  flex items-center justify-center cursor-pointer rounded-[8px] p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <img src={"/assets/Final.svg"} />
        </button>

        <button
          className="border h-[40px] w-[40px]  flex items-center justify-center cursor-pointer rounded-[8px] p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <img src={"/assets/Arrow.svg"} />
        </button>
        <div className="w-[40px] cursor-pointer h-[40px] flex justify-center items-center bg-[#2E77AE] rounded-[8px] text-center text-white">
          {table.getState().pagination.pageIndex + 1}
        </div>
        <button
          className="border h-[40px] w-[40px]  flex items-center justify-center cursor-pointer rounded-[8px] p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <img src={"/assets/Arrow2.svg"} />
        </button>

        <button
          className="border h-[40px] w-[40px]  flex items-center justify-center cursor-pointer rounded-[8px] p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <img src={"/assets/Final2.svg"} />
        </button>

        {/* <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span> */}
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
         {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))} 
        </select> */}
      </div>
    </div>
  );
};
export default ClassroomActivity;
