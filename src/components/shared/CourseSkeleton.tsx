import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function CourseSkeleton() {
  return (
    <div className="cards-grid mt-6">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i}>
          <Skeleton className="mx-auto h-[232px] w-full max-w-[500px] rounded-lg bg-gray-300" />
          <Skeleton className="mx-auto mt-4 h-[183px] w-full max-w-[500px] rounded-lg" />
        </div>
      ))}
      ;
    </div>
  );
}
