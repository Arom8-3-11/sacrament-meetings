"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/meetings", label: "All programs" },
  { href: "/meetings/current", label: "This Sunday" },
];

interface NavLinksProps {
  /** Server-resolved id of this Sunday's meeting, so highlighting is timezone-safe. */
  currentMeetingId: number | null;
}

export default function NavLinks({ currentMeetingId }: NavLinksProps) {
  const pathname = usePathname();
  const currentMeetingPath =
    currentMeetingId === null ? null : `/meetings/${currentMeetingId}`;
  const isCurrentMeeting =
    pathname === "/meetings/current" ||
    (currentMeetingPath !== null && pathname === currentMeetingPath);

  return (
    <nav aria-label="Meeting programs" className="flex flex-wrap gap-2">
      {links.map(({ href, label }) => {
        const isCurrent =
          href === "/meetings/current"
            ? isCurrentMeeting
            : pathname === href ||
              (pathname.startsWith("/meetings/") && !isCurrentMeeting);

        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
              isCurrent
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
            }`}
            href={href}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
