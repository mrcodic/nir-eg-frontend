"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { IActivity, InnerPagination } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import GradesTableAction from "../shared/GradesTableAction";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<IActivity>();

const columns = [
  columnHelper.accessor("title", {
    meta: {
      headerClassName: "w-1/4 ",
    },
    header: () => <div className="w-full text-[18px] font-bold">الأنشطة</div>,
    cell: (info) => (
      <div className="flex max-w-[300px] items-center truncate text-base font-medium">
        <p className="text-secondary truncate underline">{info.getValue()}</p>
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    meta: {
      headerClassName: "w-10 ",
    },
    header: () => <div className="w-[100px] text-[18px] font-bold">النوع</div>,
    cell: (info) => (
      <div className="w-[100px] text-start text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("classroom", {
    // meta: {
    //   headerClassName: "w-1/4 ",
    // },
    header: () => <div className="text-[18px] font-bold">الكورس</div>,
    cell: (info) => {
      const courseExpired = info.row.original.classroom_expired;

      return (
        <div
          className={cn(
            "max-w-[300px] truncate text-start text-base font-medium",
            {
              "text-sm text-red-600": courseExpired,
            },
          )}
        >
          {courseExpired ? "تم انتهاء الكورس" : info.getValue()}
        </div>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: () => (
      <div className="min-w-[110px] text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="w-[110px] text-start text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("score", {
    header: () => (
      <div className="min-w-[200px] text-[18px] font-bold">النتيجة</div>
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
