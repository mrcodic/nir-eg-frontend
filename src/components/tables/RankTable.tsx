"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { InnerPagination } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import CustomNum from "../ui/custom-num";
import CustomTableUI from "./CustomTableUI";

type StudentRank = {
  id: number;
  name: string;
  points: number;
  profile_image: string;
};

const columnHelper = createColumnHelper<StudentRank>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <div className="py-3 text-[18px] font-bold">الترتيب</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center p-2 text-base font-medium">
        <CustomNum num={row.index + 1} />
      </div>
    ),
    meta: {
      headerClassName: "w-16",
    },
  }),
  columnHelper.accessor("name", {
    header: () => (
      <div className="w-[200px] px-2 text-[18px] font-bold">الطالب</div>
    ),
    cell: (info) => (
      <div className="flex w-[200px] items-center justify-start gap-6 p-2 text-center text-base font-medium">
        <Image
          src="/assets/avatar-user.svg"
          width={48}
          height={48}
          alt="avatar"
          className="rounded-full"
        />
        <span className="text-lg leading-4 font-bold text-black">
          {info.getValue()}
        </span>
      </div>
    ),
    meta: {
      headerClassName: "ps-0",
    },
  }),
  columnHelper.accessor("points", {
    header: () => (
      <div className="px-2 pe-8 text-start text-lg font-bold">النقاط</div>
    ),
    cell: (info) => (
      <div className="flex items-end justify-start gap-2 p-2 ps-0 text-base font-medium">
        <Image
          src="/assets/star-colored.svg"
          width={32}
          height={32}
          alt="star"
        />

        <div className="relative">
          <h3 className="textStroke text-primary-800/20 absolute top-0 left-0 z-0 flex items-center text-2xl">
            {info.getValue()}
          </h3>

          <h3 className="text-primary-800 relative top-px left-px z-10 text-2xl font-bold">
            {info.getValue()}
          </h3>
        </div>

        <span className="text-primary-800 self-end text-xs font-bold">
          نقطة
        </span>
      </div>
    ),
    meta: {
      headerClassName: "ps-0 w-48",
      cellClassName: "ps-0 w-48",
    },
  }),
];

export default function RankTable() {
  const { classroomId } = useParams();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isLoading, isPlaceholderData } = useQuery<{
    body: {
      students: StudentRank[];
      pagination: InnerPagination;
    };
  }>({
    queryKey: [
      `/students/get-classrank/${classroomId}?per_page=5&page=${
        pagination.pageIndex + 1
      }`,
    ],
    queryFn: getClientPrivateData,
    placeholderData: keepPreviousData,
  });

  const students = data?.body?.students || [];
  const pageCount = data?.body?.pagination?.last_page ?? -1;

  return (
    <CustomTableUI
      data={students}
      columns={columns}
      setPagination={setPagination}
      pagination={pagination}
      pageCount={pageCount}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
    />
  );
}
