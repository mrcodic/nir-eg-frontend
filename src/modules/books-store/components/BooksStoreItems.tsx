"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import PaginationComponent from "@/components/Pagination";
import RoomHeader from "@/components/RoomHeader";
import { getPublicData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { IPagination } from "@/types";
import { Book } from "@/types/books.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BooksGrid from "./BooksGrid";

function BooksStoreItems({
  perPage = 8,
  title,
  className,
  booksClassName,
}: {
  perPage?: number;
  title?: string;
  className?: string;
  booksClassName?: string;
}) {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isPlaceholderData } = useQuery({
    queryKey: [`books?per_page=${perPage}&page=` + page],
    queryFn: getPublicData<IPagination<Book>>,
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <Empty isError />;

  if (!data && !isLoading) return <Empty text="لا يوجد محتوى بعد" />;

  return (
    <section className={className}>
      <RoomHeader icon={"/assets/BookColor.svg"} title={title || "الكتب"} />

      <BooksGrid
        books={data?.data}
        className={cn(
          booksClassName,
          isPlaceholderData
            ? "pointer-events-none animate-pulse opacity-80"
            : "",
        )}
      />

      <PaginationComponent
        currentPage={page}
        total={data?.meta.total}
        setPage={setPage}
        pageSize={data?.meta.per_page}
        className="mt-10"
      />
    </section>
  );
}

export default BooksStoreItems;
