import { Suspense } from "react";
import type { ReactNode } from "react";
import { connection } from "next/server";
import NavLinks from "@/components/NavLinks";
import { getCurrentMeeting } from "@/lib/meetings-db";

// Resolve this Sunday's meeting on the server so navigation highlighting
// does not depend on the visitor's timezone.
async function CurrentMeetingNav() {
  await connection();
  const currentMeeting = await getCurrentMeeting();
  return <NavLinks currentMeetingId={currentMeeting?.id ?? null} />;
}

export default function MeetingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="print-hidden border-b border-[var(--color-line)] bg-[var(--color-surface-soft)]">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-3 sm:px-8">
          <Suspense
            fallback={
              <div aria-hidden="true" className="h-9 w-44 animate-pulse rounded-full bg-white/70" />
            }
          >
            <CurrentMeetingNav />
          </Suspense>
        </div>
      </div>
      {children}
    </>
  );
}
