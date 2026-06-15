"use client ";
// components/InfiniteScroll.js

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useCallback, useEffect, useState } from "react";

type Props = {
  fetchData: (page: number) => Promise<any[]>;
  pagination: { last_page: number };
  render: (items: any[]) => React.ReactNode;
  initialData?: any[];
  loadingComponent?: React.ReactNode;
};

const InfiniteScroll = ({
  fetchData,
  pagination,
  render,
  initialData,
  loadingComponent,
}: Props) => {
  const [items, setItems] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    const newData = await fetchData(page);
    setItems((prev) => [...prev, ...newData]);
    setIsLoading(false);
    setPage((prev) => prev + 1);
  }, [fetchData, isLoading, page]);

  const observerCallback = useCallback(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && page <= pagination.last_page) {
        loadMore();
      }
    },
    [loadMore, page, pagination],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "100px", // Trigger when 100px from the bottom
    });

    const target = document.querySelector("#scroll-target");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMore, observerCallback]);

  return (
    <div>
      <div>{render(items)}</div>
      {isLoading &&
        (!!loadingComponent ? (
          loadingComponent
        ) : (
          <div>
            <LoadingSpinner />
          </div>
        ))}
      <div id="scroll-target" style={{ height: "20px" }}></div>
    </div>
  );
};

export default InfiniteScroll;
