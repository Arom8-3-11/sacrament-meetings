import type { ReactNode } from "react";
import Link from "next/link";

// Leader-facing layout. Authentication will be scaffolded in Week 05.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-surface-soft)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Leader tools
          </p>
          <Link
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            href="/meetings"
          >
            <span aria-hidden="true" className="mr-2">←</span>
            Back to programs
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
