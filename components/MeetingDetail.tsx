import BranchPresidency from "@/components/BranchPresidency";
import { branchName } from "@/lib/branch";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function formatMeetingType(meetingType: SacramentMeeting["meetingType"]) {
  return meetingType === "testimony"
    ? "Testimony meeting"
    : `${meetingType[0].toUpperCase()}${meetingType.slice(1)} meeting`;
}

function HymnLine({ number, title }: SacramentMeeting["openingHymn"]) {
  return (
    <p className="mt-1 text-[var(--color-ink)]">
      <span className="font-semibold">#{number}</span>
      <span aria-hidden="true"> · </span>
      {title}
    </p>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const meetingDate = new Date(`${meeting.date}T12:00:00`);
  const isSacramentMeeting =
    meeting.meetingType === "regular" || meeting.meetingType === "testimony";
  const musicalNumbers = meeting.speakers.filter(
    (item) => item.type === "musical-number",
  );
  const speakers = meeting.speakers.filter((item) => item.type === "speaker");

  return (
    <article className="print-program mx-auto max-w-4xl rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-sm sm:p-10">
      <header className="border-b border-[var(--color-line)] pb-7 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          {branchName}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          {formatMeetingType(meeting.meetingType)}
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          <time dateTime={meeting.date}>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(meetingDate)}
          </time>
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Sample program. Meeting details and assignments are not confirmed.
        </p>
        <dl className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <div className="flex gap-1">
            <dt className="font-semibold text-[var(--color-ink)]">Presiding:</dt>
            <dd className="text-[var(--color-muted)]">{meeting.presiding}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-semibold text-[var(--color-ink)]">Conducting:</dt>
            <dd className="text-[var(--color-muted)]">{meeting.conducting}</dd>
          </div>
        </dl>
        <button
          className="print-hidden mt-6 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
          onClick={() => window.print()}
          type="button"
        >
          Print this program
        </button>
      </header>

      <div className="grid gap-x-10 sm:grid-cols-2">
        <section className="border-b border-[var(--color-line)] py-6 sm:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Announcements
          </h2>
          {meeting.announcements?.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--color-ink)]">
              {meeting.announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              No announcements for this meeting.
            </p>
          )}
        </section>

        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Opening hymn
          </h2>
          <HymnLine {...meeting.openingHymn} />
        </section>
        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Opening prayer
          </h2>
          <p className="mt-1 text-[var(--color-ink)]">{meeting.openingPrayer}</p>
        </section>

        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Branch business
          </h2>
          {meeting.wardBusiness.length ? (
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-ink)]">
              {meeting.wardBusiness.map(({ description }) => (
                <li key={description}>{description}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              No branch business scheduled.
            </p>
          )}
        </section>
        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Stake business
          </h2>
          <p className="mt-1 text-[var(--color-ink)]">
            {meeting.stakeBusiness ? "Yes, stake business is scheduled." : "No stake business."}
          </p>
        </section>

        {isSacramentMeeting && (
          <section className="border-b border-[var(--color-line)] py-6 sm:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Sacrament hymn
            </h2>
            <HymnLine {...meeting.sacramentHymn} />
          </section>
        )}

        {musicalNumbers.length > 0 && (
          <section className="border-b border-[var(--color-line)] py-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Musical numbers
            </h2>
            <ul className="mt-2 space-y-3">
              {musicalNumbers.map(({ name, topic }) => (
                <li key={`${name}-${topic}`}>
                  <p className="font-semibold text-[var(--color-ink)]">{topic}</p>
                  <p className="text-sm text-[var(--color-muted)]">{name}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Speakers
          </h2>
          {speakers.length ? (
            <ul className="mt-2 space-y-3">
              {speakers.map(({ name, topic }) => (
                <li key={`${name}-${topic}`}>
                  <p className="font-semibold text-[var(--color-ink)]">{name}</p>
                  <p className="text-sm text-[var(--color-muted)]">{topic}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Open-microphone testimony meeting.
            </p>
          )}
        </section>

        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Closing hymn
          </h2>
          <HymnLine {...meeting.closingHymn} />
        </section>
        <section className="border-b border-[var(--color-line)] py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Closing prayer
          </h2>
          <p className="mt-1 text-[var(--color-ink)]">{meeting.closingPrayer}</p>
        </section>
      </div>
      <BranchPresidency className="pt-8" />
    </article>
  );
}
