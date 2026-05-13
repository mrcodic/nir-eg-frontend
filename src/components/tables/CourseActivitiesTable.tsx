"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { IActivity, StudentActivitiesData } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useState } from "react";
import GradesTableAction from "../GradesTableAction";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<IActivity>();

const columns = [
  columnHelper.accessor("title", {
    header: () => (
      <div className="block w-full min-w-[200px] px-2 py-3 text-[18px] font-bold first:ps-0">
        الأنشطة
      </div>
    ),
    cell: (info) => {
      return (
        <div className="flex w-full max-w-[200px] min-w-[200px] flex-wrap items-center gap-2 truncate p-2 ps-4 text-base font-medium md:max-w-[300px]">
          <p className="truncate">{info.getValue()}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor("type", {
    header: () => <div className="w-34 px-2 text-[18px] font-bold">النوع</div>,
    cell: (info) => (
      <div className="w-34 p-2 text-start text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: () => (
      <div className="w-34 px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="w-34 p-2 text-start text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("score", {
    header: () => (
      <div className="w-[136px] px-2 text-[18px] font-bold">النتيجة</div>
    ),
    cell: (info) => {
      const row = info.row.original;

      return <GradesTableAction row={row} rowValue={info.getValue()} />;
    },
  }),
];

export default function CourseActivitiesTable({
  enabled,
}: {
  enabled: boolean;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { SingleCourse } = useParams();

  const { data, isLoading, isPlaceholderData } = useQuery<{
    body: StudentActivitiesData;
  }>({
    queryKey: [
      `/students/mywork/${SingleCourse}?per_page=5&page=${
        pagination.pageIndex + 1
      }`,
    ],
    queryFn: getClientPrivateData,
    enabled,
    placeholderData: keepPreviousData,
  });

  const activities = data?.body?.students || [];
  const pageCount = data?.body?.pagination?.last_page ?? -1;

  console.log(activities);

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
