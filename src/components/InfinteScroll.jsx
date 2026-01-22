"use client ";
// components/InfiniteScroll.js
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const InfiniteScroll = ({ fetchData, pagination, render, initialData }) => {
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
      <div className="">{render(items)}</div>
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}{" "}
      {/* Show a loading spinner */}
      <div id="scroll-target" style={{ height: "20px" }}></div>{" "}
      {/* Target for intersection observer */}
    </div>
  );
};

export default InfiniteScroll;
