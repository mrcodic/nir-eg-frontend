"use client ";
// components/InfiniteScroll.js
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const InfiniteScroll = ({ fetchData, pagination, render, initialData }) => {
  const [items, setItems] = useState(initialData || []); // Initialize with initial data
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2); // Track the current page

  const loadMore = useCallback(async () => {
    if (isLoading) return; // Prevent multiple requests at once
    setIsLoading(true);

    const newData = await fetchData(page);
    setItems((prev) => [...prev, ...newData]);
    setIsLoading(false);
    setPage((prev) => prev + 1); // Increment page for next request
  }, [isLoading, page]);

  // Intersection Observer callback
  const observerCallback = (entries, observer) => {
    const entry = entries[0];
    if (entry.isIntersecting && page <= pagination.last_page) {
      loadMore();
    }
  };

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
  }, [loadMore]);

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
