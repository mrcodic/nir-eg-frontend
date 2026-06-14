"use client";

import PaginationComponent from "@/components/shared/Pagination";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { CommentsData } from "@/types";
import { secondsToHms } from "@/utils/clientFun";
import { AccordionContent } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import FilterControls from "./FilterControls";
import MessageInput from "./MessageInput";
import UserMessage from "./UserMessage";

const TIME_MARGIN = 300;
const ITEMS_PER_PAGE = 10;

type CommunityProps = {
  lessonId: string | number;
  locked: boolean;
  isYoutubeVideo: boolean;
};

const Community = ({ lessonId, locked, isYoutubeVideo }: CommunityProps) => {
  const [filterMode, setFilterMode] = useState<"all" | "current">("current");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 1023px)");

  const { currentTime } = useVideoPlayerStore();

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
        <div className="flex grow flex-col gap-2 self-stretch">
          <p className="hidden flex-wrap justify-between gap-2 pe-[136px] text-base font-medium text-black md:ms-[132px] md:flex">
            سيتم كتابة ملاحظاتك في الدقيقة{" "}
            <span className="text-base font-bold text-black">
              {secondsToHms(currentTime)}
            </span>
          </p>

          <MessageInput
            id="community-input"
            avatar={comments?.avatar}
            lessonId={lessonId}
            currentTime={currentTime}
            className="grow"
            renderDescription={() => (
              <p className="flex flex-wrap justify-between gap-2 pe-[72px] text-base font-medium text-black sm:pe-[136px] md:ms-[132px] md:hidden">
                سيتم كتابة ملاحظاتك في الدقيقة{" "}
                <span className="text-base font-bold text-black">
                  {secondsToHms(currentTime)}
                </span>
              </p>
            )}
          />
        </div>
      )}

      <hr className="border-gray-light mt-4" />

      {comments?.data?.length > 0 ? (
        <div>
          <div className="my-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold">ملاحظات الطلاب</h2>

            {!isYoutubeVideo && (
              <FilterControls
                filterMode={filterMode}
                setFilterMode={setFilterMode}
              />
            )}
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue={isMobile ? "" : "comments"}
            className="border-none"
          >
            <AccordionItem
              value="comments"
              className="border-b-gray-light space-y-6 rounded-none border-x-transparent border-t-transparent px-0"
            >
              <AccordionTrigger className="py-0">
                <div className="text-sm text-gray-600">
                  {filterMode === "all"
                    ? `عرض ${paginatedComments.length} من إجمالي ${comments.data.length} تعليق`
                    : `عرض ${paginatedComments.length} من ${filteredComments.length} تعليق (إجمالي ${comments.data.length})`}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="mt-4 flex flex-col gap-4">
                  {paginatedComments.length > 0 ? (
                    paginatedComments.map((comment, index) => (
                      <div key={comment.id || index}>
                        <UserMessage
                          avatar={comments?.avatar}
                          comment={comment}
                          lessonId={lessonId}
                          currentTime={comment.at_second}
                          isYoutubeVideo={isYoutubeVideo}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-500">
                      لا توجد تعليقات في هذا الوقت
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="border-gray-light mt-2 border-t pb-2">
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
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-center text-xs text-gray-500">
            لا توجد تعليقات , قم بكتابة أول تعليق
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Community);
