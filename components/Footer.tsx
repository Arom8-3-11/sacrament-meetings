import { branchName } from "@/lib/branch";

export default function Footer() {
  return (
    <footer className="print-hidden border-t border-[var(--color-line)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-6 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>{branchName} meeting planner</p>
        <p>Come worship with us this Sunday.</p>
      </div>
    </footer>
  );
}
