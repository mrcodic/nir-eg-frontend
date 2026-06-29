"use client";

import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import { IPortalQuiz } from "@/modules/parent-portal/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CustomTableUI from "./CustomTableUI";

const columnHelper = createColumnHelper<IPortalQuiz>();

const columns = [
  columnHelper.accessor("title", {
    header: () => (
      <div className="w-full px-2 py-3 text-lg font-bold">الأنشطة</div>
    ),
    cell: (info) => (
      <Link
        href={`#classroom-chart-${info.row.original?.classroom}`}
        className="flex max-w-[200px] cursor-pointer items-center gap-2 truncate p-2 text-base font-medium md:max-w-[300px]"
      >
        <p className="truncate text-[#D9B45C] underline">{info.getValue()}</p>
      </Link>
    ),
  }),
  columnHelper.accessor("type_label", {
    header: () => <div className="w-[100px] px-2 text-lg font-bold">النوع</div>,
    cell: (info) => (
      <div className="w-[100px] p-2 text-center text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("classroom", {
    header: () => (
      <div className="w-[156px] px-2 text-lg font-bold">الكورس</div>
    ),
    cell: (info) => (
      <div className="w-[156px] truncate p-2 text-center text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("submitted_at", {
    header: () => (
      <div className="min-w-[110px] px-2 text-lg font-bold">التاريخ</div>
    ),
    cell: (info) => (
      <div className="w-[110px] p-2 text-center text-base font-medium">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("score", {
    header: () => (
      <div className="min-w-[200px] px-2 text-lg font-bold">النتيجة</div>
    ),
    cell: (info) => {
      const row = info.row.original;
      const isExam = row?.type !== "واجب";

      return (
        <div className="my-2 me-2 flex items-center gap-2">
          <div className="flex h-10 w-[136px] shrink-0 items-center gap-2 rounded-lg border border-[#121212] p-1 font-bold">
            {isExam && !row?.score_ratio ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Image
                src={
                  row.passed || !isExam
                    ? "/assets/CorrectColor.svg"
                    : "/assets/Close2.svg"
                }
                width={20}
                height={20}
                alt={row.passed ? "ناجح" : "راسب"}
              />
            )}

            {isExam ? (
              !!row?.score_ratio ? (
                <h3
                  className={cn(
                    "flex items-center text-lg font-bold",
                    row.passed ? "text-[#1EAD7B]" : "text-[#B75050]",
                  )}
                >
                  {row.score_ratio ? (
                    <span>{row.score_ratio}</span>
                  ) : (
                    <>
                      <span>%</span>
                      <span>{info.getValue()}</span>
                    </>
                  )}
                </h3>
              ) : (
                <span className={cn("text-base font-bold text-yellow-800")}>
                  جارى التصحيح
                </span>
              )
            ) : (
              <span className="text-base font-bold text-[#1EAD7B]">
                تم الحل
              </span>
            )}
          </div>

          {row?.hasResult && (
            <ExamPDFGenerator
              taskId={row?.id}
              text="تنزيل نموذج الإجابة"
              className="bg-secondary flex h-10 items-center justify-center rounded-[10px] p-1 text-xs font-bold text-white sm:text-sm"
            />
          )}
        </div>
      );
    },
  }),
];

const PAGE_SIZE = 5;

export default function ParentPortalTable({
  quizzes,
}: {
  quizzes: IPortalQuiz[];
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const pageCount = Math.ceil(quizzes.length / PAGE_SIZE);

  const currentPageQuizzes = quizzes.slice(
    pagination.pageIndex * PAGE_SIZE,
    (pagination.pageIndex + 1) * PAGE_SIZE,
  );

  return (
    <CustomTableUI
      data={currentPageQuizzes}
      columns={columns}
      setPagination={setPagination}
      pagination={pagination}
      pageCount={pageCount}
    />
  );
}
