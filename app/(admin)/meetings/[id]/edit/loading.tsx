export default function EditMeetingLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <p className="text-[var(--color-muted)]">Loading meeting details…</p>
    </main>
  );
}
