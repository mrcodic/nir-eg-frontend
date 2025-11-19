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
const ActivitisPage = () => {
  const defaultData = [
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },

    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },
      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
    {
      activity: {
        activity1: "رسبت في امتحان",
        activity2: "حصة رقم15",
      },

      date: "19/3/2024",
      points: 230,
    },
  ];
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("activities", {
      header: () => <div className="py-4">الأنشطة</div>,
      cell: ({ cell, row }) => (
        <div class="py-6 w-[363px]  text-[14px] flex items-center gap-2 whitespace-nowrap">
          {row.original.activity.activity1}
          <Link href="#" class="text-[#2E77AE] underline">
            {row.original.activity.activity2}
          </Link>
        </div>
      ),
    }),

    columnHelper.accessor("date", {
      header: () => <div>التاريخ</div>,
      cell: (info) => (
        <div class=" py-6 w-[206px] text-center   text-[14px] flex items-center gap-2 whitespace-nowrap">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("points", {
      header: "النقاط",
      cell: (info) => (
        <div class=" py-6 w-[233px] text-[14px] flex items-center gap-2 whitespace-nowrap">
          <div class="flex items-center justify-center gap-2">
            <img src="/assets/Star.svg" />
            <span>{info.getValue()}</span>
          </div>
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
    <div class="w-[60%]   mx-auto">
      <table className="w-full mt-4">
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
      </div>
    </div>
  );
};
export default ActivitisPage;
