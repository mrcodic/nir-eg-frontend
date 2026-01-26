"use client";

import { SelectOption } from "@/types/type";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { SelectItem } from "../ui/select";

interface VirtualizedContentProps {
  options: SelectOption[];
}

export default function VirtualizedContent({
  options,
}: VirtualizedContentProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
    isRtl: true,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const option = options[virtualRow.index];

        return (
          <SelectItem
            ref={rowVirtualizer.measureElement}
            data-index={virtualRow.index}
            key={option.id}
            value={String(option.id)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              // height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {option.name}
          </SelectItem>
        );
      })}
    </div>
  );
}
