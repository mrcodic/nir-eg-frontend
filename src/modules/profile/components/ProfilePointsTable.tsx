// src/components/ProfilePointsTable.tsx
"use client";

import CustomTableUI from "@/components/tables/CustomTableUI";
import { getClientPrivateData } from "@/helpers/client-fetch";
import type { IPagination } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
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
          className="text-primary-800  font-bold underline truncate"
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
      <div className="min-w-[110px] px-2 text-[18px] font-bold">النقاط</div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-4 w-full justify-start p-2">
        <div className="flex shrink-0 items-center gap-2 rounded-lg w-[136px]">
          <Image
            src="/assets/star-colored.svg"
            width={32}
            height={32}
            alt="Star"
          />
          <span className="text-2xl font-bold text-primary-800">
            {info.getValue()}
          </span>
          <span className="text-[16px] font-bold ">نقطة</span>
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
    queryFn: getClientPrivateData as () => Promise<IPagination<Row>>,
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
    />
  );
}

export default ProfilePointsTable;
