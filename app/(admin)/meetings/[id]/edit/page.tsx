import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";

export const instant = false;

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) {
    notFound();
  }

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) {
    notFound();
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/meetings"
        className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
      >
        Back to programs
      </Link>
      <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--color-ink)]">
        Edit meeting
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
        Update this meeting&apos;s assignments, hymns, and program details.
      </p>
      <MeetingForm action={updateMeeting.bind(null, id)} meeting={meeting} />
    </main>
  );
}
