import Link from "next/link";
import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export default function NewMeetingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/meetings"
        className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
      >
        Back to programs
      </Link>
      <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--color-ink)]">
        Create meeting
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
        Add the meeting assignments, hymns, and program details.
      </p>
      <MeetingForm action={createMeeting} />
    </main>
  );
}
