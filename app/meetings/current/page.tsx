import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentMeeting } from "@/lib/meetings-db";

async function RedirectToCurrentMeeting(): Promise<never> {
  await connection();
  const meeting = getCurrentMeeting();

  if (!meeting) {
    return redirect("/meetings");
  }

  return redirect(`/meetings/${meeting.id}`);
}

export default function CurrentMeetingPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-6xl px-5 py-10 text-[var(--color-muted)] sm:px-8">
          Finding this Sunday&apos;s program…
        </p>
      }
    >
      <RedirectToCurrentMeeting />
    </Suspense>
  );
}
