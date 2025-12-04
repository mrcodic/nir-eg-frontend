"use client";

import PaginationComponent from "@/components/Pagination";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { CommentsData } from "@/types";
import { secondsToHms } from "@/utils/clientFun";
import { AccordionContent } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import FilterControls from "./FilterControls";
import MessageInput from "./MessageInput";
import UserMessage from "./UserMessage";

const TIME_MARGIN = 300;
const ITEMS_PER_PAGE = 10;

type CommunityProps = {
  lessonId: string | number;
  currentTime: number;
  locked: boolean;
};

const Community = ({ lessonId, currentTime, locked }: CommunityProps) => {
  const [filterMode, setFilterMode] = useState<"all" | "current">("current");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 1024px)");

  const { data: comments } = useQuery({
    queryKey: [`comments`, lessonId],
    queryFn: async () => {
      return (await getClientPrivateData({
        queryKey: [`lessons/${lessonId}/comments`],
      })) as CommentsData;
    },
    enabled: !!lessonId,
  });

  const filteredComments = useMemo(() => {
    if (!comments?.data) return [];

    if (filterMode === "all") {
      return comments.data;
    }

    return comments.data.filter((comment) => {
      const commentTime = comment.at_second;
      return Math.abs(commentTime - currentTime) <= TIME_MARGIN;
    });
  }, [comments, filterMode, currentTime]);

  // Paginate filtered comments
  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredComments.slice(start, end);
  }, [filteredComments, currentPage]);

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);

  return (
    <div className="mt-6">
      {!locked && (
        <div className=" flex flex-col gap-2 ">
          <div className="md:flex gap-2 flex-wrap hidden ms-[68px]">
            <p className="text-xs font-medium text-gray-dark">
              سيتم كتابة ملاحظاتك في الدقيقة
            </p>
            <p className="text-xs font-bold text-[#523412]">
              {secondsToHms(currentTime)}
            </p>
          </div>

          <div className="flex gap-x-6 gap-y-2 max-sm:flex-wrap items-start">
            <Image
              unoptimized
              src={comments?.avatar || "/assets/avatar-user.svg"}
              className="rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
              width={44}
              height={44}
              alt="avatar"
            />

            <div className="flex flex-col grow gap-2 h-full self-stretch">
              <div className="flex gap-2 flex-wrap md:hidden">
                <p className="text-xs font-medium text-gray-dark">
                  سيتم كتابة ملاحظاتك في الدقيقة
                </p>
                <p className="text-xs font-bold text-[#523412]">
                  {secondsToHms(currentTime)}
                </p>
              </div>

              <MessageInput
                id="community-input"
                lessonId={lessonId}
                currentTime={currentTime}
                className="grow"
              />
            </div>
          </div>
        </div>
      )}

      <hr className="mt-4 border-gray-light" />

      {comments?.data?.length > 0 ? (
        <div>
          <div className="flex items-center justify-between my-3">
            <h2 className="text-[12px] font-bold">ملاحظات الطلاب</h2>

            {/* Filter Controls */}
            <FilterControls
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue={isMobile ? "" : "comments"}
          >
            <AccordionItem
              value="comments"
              className="space-y-6 data-[state=open]:p-0 "
            >
              <AccordionTrigger className="py-0">
                <div className=" text-[11px] text-gray-600">
                  {filterMode === "all"
                    ? `عرض ${paginatedComments.length} من إجمالي ${comments.data.length} تعليق`
                    : `عرض ${paginatedComments.length} من ${filteredComments.length} تعليق (إجمالي ${comments.data.length})`}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="overflow-y-auto max-h-[700px] mt-4 flex flex-col gap-4  ">
                  {paginatedComments.length > 0 ? (
                    paginatedComments.map((comment, index) => (
                      <div key={comment.id || index}>
                        <UserMessage
                          avatar={comments?.avatar}
                          comment={comment}
                          lessonId={lessonId}
                          currentTime={comment.at_second}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-[12px] py-8">
                      لا توجد تعليقات في هذا الوقت
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-2 pb-2 border-t border-gray-light">
                    <PaginationComponent
                      currentPage={currentPage}
                      total={filteredComments?.length}
                      setPage={setCurrentPage}
                      pageSize={ITEMS_PER_PAGE}
                      className="mt-2"
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-[12px] py-8">
          لا توجد تعليقات , قم بكتابة أول تعليق
        </div>
      )}
    </div>
  );
};

export default memo(Community);
