"use client";

import Link from "next/link";
import { useEffect } from "react";

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}

export default function MeetingsError({
  error,
  reset,
  retry,
}: MeetingsErrorProps) {
  const recover = reset ?? retry;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--color-ink)]">
        We couldn&apos;t load the meeting tools
      </h1>
      <p className="mt-4 text-[var(--color-muted)]">
        Something went wrong while processing the request. Please try again.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => recover?.()}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-full px-4 py-2.5 font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Back to programs
        </Link>
      </div>
    </main>
  );
}
