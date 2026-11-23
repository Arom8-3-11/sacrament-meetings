"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const linkClasses =
  "rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary-soft)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const disabledClasses =
  "cursor-not-allowed rounded-full border border-[var(--color-line)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)] opacity-60";

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) {
    return null;
  }

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Meetings pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      {hasPrevious ? (
        <Link className={linkClasses} href={createPageURL(currentPage - 1)}>
          <span aria-hidden="true" className="mr-1">
            ←
          </span>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClasses}>
          <span aria-hidden="true" className="mr-1">
            ←
          </span>
          Previous
        </span>
      )}
      <p className="text-sm font-medium text-[var(--color-ink)]">
        Page {currentPage} of {totalPages}
      </p>
      {hasNext ? (
        <Link className={linkClasses} href={createPageURL(currentPage + 1)}>
          Next
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClasses}>
          Next
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </span>
      )}
    </nav>
  );
}
