"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
}

export default function Pagination({ currentPage, pageCount }: PaginationProps) {
  const searchParams = useSearchParams();

  function makeLink(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/?${params.toString()}`;
  }

  if (pageCount <= 1) return null;

  const pages = Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
    // Show window around current page
    if (pageCount <= 7) return i + 1;
    const start = Math.max(1, currentPage - 3);
    return start + i;
  }).filter((p) => p <= pageCount);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Link
        href={makeLink(currentPage - 1)}
        className="pagination__btn"
        aria-label="Previous page"
        aria-disabled={currentPage <= 1}
        style={currentPage <= 1 ? { pointerEvents: "none", opacity: 0.35 } : {}}
      >
        ← Prev
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={makeLink(p)}
          className={`pagination__btn${p === currentPage ? " pagination__btn--active" : ""}`}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      <Link
        href={makeLink(currentPage + 1)}
        className="pagination__btn"
        aria-label="Next page"
        aria-disabled={currentPage >= pageCount}
        style={currentPage >= pageCount ? { pointerEvents: "none", opacity: 0.35 } : {}}
      >
        Next →
      </Link>
    </nav>
  );
}
