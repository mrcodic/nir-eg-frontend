"use client";

import { StudentActivity } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import GradesTableAction from "../GradesTableAction";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<StudentActivity>();

const columns = [
  columnHelper.accessor("title", {
    header: () => (
      <div className="py-3 px-2 w-full text-[18px] font-bold">الأنشطة</div>
    ),
    cell: (info) => (
      <div className="p-2 max-w-[200px] md:max-w-[300px] text-[16px] font-medium flex items-center gap-2 truncate">
        <p className="text-[#D9B45C] underline truncate">{info.getValue()}</p>
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    header: () => (
      <div className="w-[100px] px-2 text-[18px] font-bold">النوع</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[100px] text-center text-[16px] font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("classroom", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">الكورس</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[156px] text-center text-[16px] font-medium truncate">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[110px] text-center text-[16px] font-medium">
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

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      `/students/all-activity?per_page=5&page=${pagination.pageIndex + 1}`,
    ],
    queryFn: getDataClient,
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
