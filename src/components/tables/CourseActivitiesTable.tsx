"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { StudentActivitiesData, StudentActivity } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import GradesTableAction from "../GradesTableAction";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<StudentActivity>();

const columns = [
  columnHelper.accessor("title", {
    header: () => (
      <div className="py-3 min-w-[200px] px-2 block w-full first:ps-0   text-[18px] font-bold">
        الأنشطة
      </div>
    ),
    cell: (info) => {
      const row = info.row.original;

      return (
        <div className="p-2  min-w-[200px] w-full max-w-[200px] md:max-w-[300px]  text-[16px] font-medium flex flex-wrap items-center gap-2 truncate">
          <p className="truncate">{info.getValue()}</p>
          <Link
            href={`/bundles/${row?.classroom_id}/${row?.room_id}/${
              row.type === "امتحان" ? "exams" : "assignment"
            }/${row?.quiz_id}`}
            className="text-[#D9B45C] underline truncate font-bold flex items-center justify-center"
          >
            عرض {row.type === "امتحان" ? "الامتحان" : "الواجب"}
          </Link>
        </div>
      );
    },
  }),
  columnHelper.accessor("type", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">النوع</div>
    ),
    cell: (info) => (
      <div className="p-2 w-[156px] text-start text-[16px] font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: () => (
      <div className="w-52 px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="p-2 w-52 text-start text-[16px] font-medium">
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

export default function CourseActivitiesTable() {
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
