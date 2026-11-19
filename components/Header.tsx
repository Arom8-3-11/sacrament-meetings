"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { branchName } from "@/lib/branch";

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function Header() {
  const today = useSyncExternalStore(
    () => () => {},
    formatToday,
    () => "Current date",
  );

  return (
    <header className="print-hidden border-b border-[var(--color-line)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link
          aria-label={`${branchName} meeting planner home`}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
          href="/"
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] font-serif text-lg text-white"
          >
            H
          </span>
          <span>
            <span className="block font-semibold text-[var(--color-ink)]">
              {branchName}
            </span>
            <span className="block text-xs text-[var(--color-muted)]">
              Sunday meeting planner
            </span>
          </span>
        </Link>
        <p className="text-sm text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-ink)]">Today</span>
          <span aria-hidden="true"> · </span>
          <time>{today}</time>
        </p>
      </div>
    </header>
  );
}
