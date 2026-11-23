import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--color-ink)]">
        Meeting not found
      </h1>
      <p className="mt-4 text-[var(--color-muted)]">
        The meeting you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        Back to programs
      </Link>
    </main>
  );
}
