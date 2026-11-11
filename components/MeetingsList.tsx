"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingsList() {
  const [meetings, setMeetings] = useState<SacramentMeeting[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Unable to load meeting programs (${response.status}).`);
        }
        const data = (await response.json()) as SacramentMeeting[];
        setMeetings(data);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === "AbortError") {
          return;
        }
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load meeting programs.",
        );
      }
    }

    void loadMeetings();
    return () => controller.abort();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Meeting archive
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--color-ink)]">
            Sunday programs
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Review upcoming and recent meeting agendas, assignments, hymns, and
            announcements.
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            These programs contain sample meeting details and assignments.
          </p>
        </div>
        <Link
          className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:border-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          href="/meetings/current"
        >
          Go to this Sunday
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : meetings === null ? (
        <div aria-label="Loading meeting programs" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="h-52 animate-pulse rounded-2xl border border-[var(--color-line)] bg-white"
              key={index}
            />
          ))}
          <span className="sr-only">Loading meeting programs…</span>
        </div>
      ) : meetings.length === 0 ? (
        <p className="rounded-xl border border-[var(--color-line)] bg-white p-5 text-[var(--color-muted)]">
          No meeting programs are available yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </main>
  );
}
