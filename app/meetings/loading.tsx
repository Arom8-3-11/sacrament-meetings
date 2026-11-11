export default function LoadingMeetings() {
  return (
    <main
      aria-label="Loading meeting programs"
      className="mx-auto grid w-full max-w-6xl animate-pulse gap-4 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3"
      role="status"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          className="h-52 rounded-2xl border border-[var(--color-line)] bg-white"
          key={index}
        />
      ))}
      <span className="sr-only">Loading meeting programs…</span>
    </main>
  );
}
