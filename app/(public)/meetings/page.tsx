import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getFilteredMeetings, getMeetingsPageCount } from "@/lib/meetings-db";

interface MeetingsPageProps {
  searchParams?: Promise<{ query?: string; page?: string }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const params = await searchParams;
  const query = params?.query ?? "";
  const requestedPage = Number(params?.page);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [meetings, totalPages] = await Promise.all([
    getFilteredMeetings(query, currentPage),
    getMeetingsPageCount(query),
  ]);

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

      <div className="mb-8">
        <MeetingSearch placeholder="Search by speaker, presiding, conducting, or type…" />
      </div>

      {meetings.length === 0 ? (
        <p className="rounded-xl border border-[var(--color-line)] bg-white p-5 text-[var(--color-muted)]">
          {query
            ? `No meeting programs match “${query}”.`
            : "No meeting programs are available yet."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </main>
  );
}
