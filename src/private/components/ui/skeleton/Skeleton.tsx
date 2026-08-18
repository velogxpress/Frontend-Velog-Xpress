import React from "react";

/**
 * Shared skeleton building blocks. Plain Tailwind animate-pulse divs -
 * no extra npm dependency (react-loading-skeleton etc.), since pages
 * compose these into whatever shape their real content will have.
 */

interface SkeletonBlockProps {
  className?: string;
}

// Base building block: a pulsing gray rectangle. Size/shape comes entirely
// from className (h-4 w-24, rounded-full, etc.) so callers can match
// whatever the real content looks like.
export function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-white/[0.06] ${className}`}
    />
  );
}

// A single line of text.
export function SkeletonLine({ className = "h-4 w-full" }: SkeletonBlockProps) {
  return <SkeletonBlock className={className} />;
}

// Circle, for avatars / icon badges.
export function SkeletonCircle({ className = "h-10 w-10" }: SkeletonBlockProps) {
  return <SkeletonBlock className={`rounded-full ${className}`} />;
}

// Rows of table cells, matching the app's <Table>/<TableRow>/<TableCell>
// components used across the admin CRUD pages.
export function SkeletonTableRows({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-100 dark:border-white/[0.05]"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-5 py-4 sm:px-6">
              <SkeletonLine className={colIndex === 0 ? "h-4 w-32" : "h-4 w-20"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// A grid of card placeholders, for pages that render fetched records as
// cards (mes-colis grid view, dashboard tiles, etc.).
export function SkeletonCardGrid({
  count = 6,
  className = "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-white/[0.05] dark:bg-white/[0.03]"
        >
          <div className="flex items-start justify-between gap-2">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-12 rounded-full" />
          </div>
          <SkeletonLine className="mt-3 h-3 w-32" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-full" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <SkeletonLine className="h-8 flex-1" />
            <SkeletonLine className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Small stat/metric tiles (dashboard KPI cards).
export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-white/[0.05] dark:bg-white/[0.03]"
        >
          <SkeletonCircle className="h-11 w-11" />
          <SkeletonLine className="mt-4 h-3 w-20" />
          <SkeletonLine className="mt-2 h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

// A block-shaped placeholder for charts/graphs while their data loads.
export function SkeletonChart({ className = "h-[260px] w-full" }: SkeletonBlockProps) {
  return <SkeletonBlock className={className} />;
}
