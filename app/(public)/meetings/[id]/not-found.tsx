import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        className="print-hidden mb-6 inline-flex rounded font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
        href="/meetings"
      >
        <span aria-hidden="true" className="mr-2">←</span>
        All programs
      </Link>
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-8 text-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-ink)]">
          Program not found
        </h1>
        <p className="mt-3 text-[var(--color-muted)]">
          This meeting may have been removed or its address may be incorrect.
        </p>
      </section>
    </main>
  );
}
