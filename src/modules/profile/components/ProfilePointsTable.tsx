"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import CustomTableUI from "@/components/tables/CustomTableUI";
import { getClientPrivateData } from "@/helpers/client-fetch";
import type { IPagination, LessonVideoType } from "@/types";

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
  video_link: string;
  video_type: LessonVideoType;
  quiz_id: number;
  is_classroom_expired: boolean;
};

export const generatePointHref = (row: Row): string => {
  const base = `/bundles/${row.classroom_id}`;

  switch (row.type) {
    case "درس":
      return `${base}/${row.room_id}/${row.id}`;
    case "كورس":
      return base;
    case "حصة":
      return `${base}/${row.room_id}`;
    case "واجب":
      return `${base}/${row.room_id}/assignment/${row.quiz_id}`;
    case "كويز":
      return `${base}/${row.room_id}/exams/${row.quiz_id}`;
    case "امتحان":
      return `${base}/general-exams/${row.quiz_id}`;
    default:
      return base;
  }
};

const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.accessor("name", {
    header: () => (
      <div className="w-full px-2 py-3 text-[18px] font-bold">الأنشطة</div>
    ),
    cell: (info) => (
      <div className="flex max-w-[200px] gap-1 truncate p-2 text-base font-medium md:max-w-[250px]">
        <p>{info.getValue()}</p>

        {info?.row?.original?.is_classroom_expired ? (
          <span className="truncate font-bold">
            {info.row.original.item_title}
          </span>
        ) : (
          <Link
            title={info.row.original.item_title}
            href={generatePointHref(info.row.original)}
            className="text-primary-800 truncate font-bold underline"
          >
            {info.row.original.item_title}
          </Link>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    header: () => (
      <div className="w-[100px] px-2 text-[18px] font-bold">النوع</div>
    ),
    cell: (info) => (
      <div className="w-[100px] p-2 text-center text-base font-medium">
        {info?.getValue() || "-"}
      </div>
    ),
  }),
  columnHelper.accessor("course", {
    header: () => (
      <div className="w-[156px] px-2 text-[18px] font-bold">الكورس</div>
    ),
    cell: (info) => (
      <div
        title={info.getValue()}
        className="w-[156px] truncate p-2 text-center text-base font-medium"
      >
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("date", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="w-[110px] p-2 text-center text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("value", {
    header: () => (
      <div className="min-w-[110px] px-2 text-[18px] font-bold">النقاط</div>
    ),
    cell: (info) => (
      <div className="flex w-full items-center justify-start gap-4 p-2">
        <div className="flex w-[136px] shrink-0 items-center gap-2 rounded-lg">
          <Image
            src="/assets/star-colored.svg"
            width={32}
            height={32}
            alt="Star"
          />
          <span className="text-primary-800 text-2xl font-bold">
            {info.getValue()}
          </span>
          <span className="text-base font-bold">نقطة</span>
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

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      `/students/studentFile?per_page=5&page=${pagination.pageIndex + 1}`,
    ],
    queryFn: getClientPrivateData as () => Promise<IPagination<Row[]>>,
    placeholderData: keepPreviousData,
  });

  const points = data?.data || [];
  const pageCount = data?.meta?.last_page ?? -1;

  return (
    <CustomTableUI
      data={points}
      columns={columns}
      setPagination={setPagination}
      pagination={pagination}
      pageCount={pageCount}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
      errorMessage="لا يوجد نقاط بعد"
    />
  );
}

export default ProfilePointsTable;

