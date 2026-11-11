import { branchPresidency } from "@/lib/branch";

interface BranchPresidencyProps {
  className?: string;
}

export default function BranchPresidency({ className }: BranchPresidencyProps) {
  return (
    <section className={className}>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-ink)]">
        Current branch presidency
      </h2>
      <dl className="mt-5 grid gap-5 sm:grid-cols-3">
        {branchPresidency.map(({ role, name }) => (
          <div key={role}>
            <dt className="text-sm font-semibold text-[var(--color-primary)]">
              {role}
            </dt>
            <dd className="mt-1 text-[var(--color-ink)]">{name}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
