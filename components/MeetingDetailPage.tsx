"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailPageProps {
  id: string;
}

export default function MeetingDetailPage({ id }: MeetingDetailPageProps) {
  const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeeting() {
      try {
        const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`Unable to load this program (${response.status}).`);
        }
        const data = (await response.json()) as SacramentMeeting;
        setMeeting(data);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === "AbortError") {
          return;
        }
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load this program.",
        );
      }
    }

    void loadMeeting();
    return () => controller.abort();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        className="print-hidden mb-6 inline-flex rounded font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
        href="/meetings"
      >
        <span aria-hidden="true" className="mr-2">←</span>
        All programs
      </Link>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : notFound ? (
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-8 text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-ink)]">
            Program not found
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">
            This meeting may have been removed or its address may be incorrect.
          </p>
        </section>
      ) : meeting ? (
        <MeetingDetail meeting={meeting} />
      ) : (
        <div aria-label="Loading meeting program" className="h-[34rem] animate-pulse rounded-3xl border border-[var(--color-line)] bg-white" role="status">
          <span className="sr-only">Loading meeting program…</span>
        </div>
      )}
    </main>
  );
}
