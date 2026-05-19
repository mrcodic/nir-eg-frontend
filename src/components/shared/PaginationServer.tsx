// components/pagination-server.tsx
// No "use client" — this is a pure Server Component

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReadonlyURLSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaginationServerProps {
  currentPage: number;
  total: number;
  searchParams: Record<string, string | number | undefined | null>;
  className?: string;
  pageSize?: number;
  /** URL search-param key to use for the page number. Default: "page" */
  pageKey?: string;
  siblings?: number;
  boundaries?: number;
}

// ---------------------------------------------------------------------------
// Helper: build a URL with the page param swapped, preserving other params
// ---------------------------------------------------------------------------

function buildHref(
  page: number,
  searchParams:
    | ReadonlyURLSearchParams
    | Record<string, string | number | undefined | null>,
  pageKey: string,
): string {
  const params = new URLSearchParams(
    searchParams instanceof URLSearchParams
      ? searchParams
      : Object.entries(searchParams as Record<string, string>),
  );
  params.set(pageKey, String(page));
  return `?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Helper: compute the visible page range (siblings + boundaries)
// ---------------------------------------------------------------------------

function getPageRange(
  current: number,
  total: number,
  siblings: number,
  boundaries: number,
): (number | "dots")[] {
  const range: number[] = [];

  // left boundary
  for (let i = 1; i <= Math.min(boundaries, total); i++) range.push(i);

  // sibling window around current
  const windowStart = Math.max(boundaries + 1, current - siblings);
  const windowEnd = Math.min(total - boundaries, current + siblings);
  for (let i = windowStart; i <= windowEnd; i++) range.push(i);

  // right boundary
  for (
    let i = Math.max(total - boundaries + 1, boundaries + 1);
    i <= total;
    i++
  )
    range.push(i);

  // deduplicate + sort
  const unique = [...new Set(range)].sort((a, b) => a - b);

  // insert "dots" gaps
  const result: (number | "dots")[] = [];
  for (let i = 0; i < unique.length; i++) {
    if (i > 0 && unique[i] - unique[i - 1] > 1) result.push("dots");
    result.push(unique[i]);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Shared item styles
// ---------------------------------------------------------------------------

const itemBase =
  "mx-1 flex size-8 sm:mx-2 sm:size-10 cursor-pointer items-center justify-center rounded-lg text-sm sm:text-base transition-colors";

const itemActive =
  "bg-primary pointer-events-none font-semibold text-primary-foreground";

const itemInactive = "bg-background hover:bg-muted text-foreground";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PaginationServer = ({
  currentPage,
  total,
  searchParams,
  className,
  pageSize = 9,
  pageKey = "page",
  siblings = 1,
  boundaries = 1,
}: PaginationServerProps) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pages = getPageRange(currentPage, totalPages, siblings, boundaries);

  const href = (p: number) => buildHref(p, searchParams, pageKey);

  return (
    <nav
      aria-label="Pagination"
      dir="rtl"
      className={cn(
        "mx-auto mt-5 flex w-fit flex-wrap items-center justify-center gap-y-1",
        className,
      )}
    >
      {/* ── Prev ── */}

      <Link
        href={href(currentPage - 1)}
        className={cn("mx-1 text-sm sm:mx-2", {
          "pointer-events-none cursor-not-allowed opacity-50": !hasPrev,
        })}
        scroll={false}
      >
        <span>السابق</span>
      </Link>

      {/* ── Page numbers ── */}
      {pages.map((page, i) =>
        page === "dots" ? (
          <span
            key={`dots-${i}`}
            className={cn(itemBase, "pointer-events-none select-none")}
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              itemBase,
              page === currentPage ? itemActive : itemInactive,
            )}
            scroll={false}
          >
            {page}
          </Link>
        ),
      )}

      {/* ── Next ── */}

      <Link
        href={href(currentPage + 1)}
        className={cn("mx-1 text-sm sm:mx-2", {
          "pointer-events-none cursor-not-allowed opacity-50": !hasNext,
        })}
        scroll={false}
      >
        <span>التالى</span>
      </Link>
    </nav>
  );
};

export default PaginationServer;
