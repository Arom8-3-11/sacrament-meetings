import Image from "next/image";
import Link from "next/link";
import BranchPresidency from "@/components/BranchPresidency";
import { branchName } from "@/lib/branch";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-[var(--color-primary)] px-7 py-9 text-white sm:px-12 sm:py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-soft)]">
            {branchName}
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Make room for what matters.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/90">
            Find this week&apos;s sacrament meeting program, review past
            gatherings, and come prepared to worship together.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/90">
            Programs currently contain sample meeting details and assignments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="/meetings/current"
            >
              View this Sunday&apos;s program
            </Link>
            <Link
              className="rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="/meetings"
            >
              Browse all programs
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Image
            alt="Illustration of a sample Sunday meeting program"
            className="h-auto w-full"
            height={400}
            priority
            src="/meeting-program.svg"
            width={480}
          />
        </div>
      </section>

      <BranchPresidency className="mt-8 rounded-2xl border border-[var(--color-line)] bg-white p-6 sm:p-8" />

      <section className="grid gap-5 py-12 sm:grid-cols-3">
        {[
          {
            number: "01",
            title: "Plan together",
            description:
              "Review assignments and meeting details in one clear agenda.",
          },
          {
            number: "02",
            title: "Stay informed",
            description:
              "Keep announcements and branch business easy to find.",
          },
          {
            number: "03",
            title: "Look back",
            description:
              "Open and print programs from recent Sunday meetings.",
          },
        ].map((item) => (
          <article
            className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
            key={item.number}
          >
            <p className="text-sm font-bold tracking-widest text-[var(--color-primary)]">
              {item.number}
            </p>
            <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
