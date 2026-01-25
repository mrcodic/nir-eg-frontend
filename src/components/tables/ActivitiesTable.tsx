"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { IActivity, InnerPagination } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import GradesTableAction from "../GradesTableAction";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<IActivity>();

const columns = [
  columnHelper.accessor("title", {
    header: () => (
      <div className="w-full px-2 py-3 text-[18px] font-bold">الأنشطة</div>
    ),
    cell: (info) => (
      <div className="flex max-w-[200px] items-center gap-2 truncate p-2 text-[16px] font-medium md:max-w-[300px]">
        <p className="text-secondary truncate ps-4 underline">
          {info.getValue()}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    header: () => (
      <div className="w-[100px] px-2 text-[18px] font-bold">النوع</div>
    ),
    cell: (info) => (
      <div className="w-[100px] p-2 text-center text-[16px] font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("classroom", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">الكورس</div>
    ),
    cell: (info) => {
      const courseExpired =
        info.row.original.classroom_expired ||
        info.row.original.classroom === "--";

      return (
        <div
          className={cn(
            "w-[156px] truncate p-2 text-center text-base font-medium",
            { "text-sm text-red-600": courseExpired },
          )}
        >
          {courseExpired ? "تم انتهاء الكورس" : info.getValue()}
        </div>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="w-[110px] p-2 text-center text-[16px] font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("score", {
    header: () => (
      <div className="min-w-[200px] px-2 text-[18px] font-bold">النتيجة</div>
    ),
    cell: (info) => {
      const row = info.row.original;

      return <GradesTableAction row={row} rowValue={info.getValue()} />;
    },
  }),
];

export default function ActivitiesTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isLoading, isPlaceholderData } = useQuery<{
    body: {
      students: IActivity[];
      pagination: InnerPagination;
    };
  }>({
    queryKey: [
      `/students/all-activity?per_page=5&page=${pagination.pageIndex + 1}`,
    ],
    queryFn: getClientPrivateData,
    placeholderData: keepPreviousData,
  });

  const activities = data?.body?.students || [];
  const pageCount = data?.body?.pagination?.last_page ?? -1;

  return (
    <CustomTableUI
      data={activities}
      columns={columns}
      setPagination={setPagination}
      pagination={pagination}
      pageCount={pageCount}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
    />
  );
}
