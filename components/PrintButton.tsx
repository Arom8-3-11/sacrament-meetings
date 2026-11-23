"use client";

export default function PrintButton() {
  return (
    <button
      className="print-hidden mt-6 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
      onClick={() => window.print()}
      type="button"
    >
      Print this program
    </button>
  );
}
