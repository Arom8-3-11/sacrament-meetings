import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

function formatMeetingType(meetingType: SacramentMeeting["meetingType"]) {
  return meetingType === "testimony"
    ? "Testimony meeting"
    : `${meetingType[0].toUpperCase()}${meetingType.slice(1)} meeting`;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const meetingDate = new Date(`${meeting.date}T12:00:00`);

  return (
    <article className="group rounded-2xl border border-[var(--color-line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-soft)] hover:shadow-lg hover:shadow-[var(--color-primary)]/5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-primary)]">
            <time dateTime={meeting.date}>
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(meetingDate)}
            </time>
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-ink)]">
            {formatMeetingType(meeting.meetingType)}
          </h2>
        </div>
        <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
          {meeting.stakeBusiness ? "Stake business" : "Branch meeting"}
        </span>
      </div>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Presiding: <span className="font-medium text-[var(--color-ink)]">{meeting.presiding}</span>
      </p>
      <Link
        className="mt-6 inline-flex items-center gap-2 rounded font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
        href={`/meetings/${meeting.id}`}
      >
        View program
        <span aria-hidden="true" className="transition group-hover:translate-x-1">
          →
        </span>
      </Link>
    </article>
  );
}
