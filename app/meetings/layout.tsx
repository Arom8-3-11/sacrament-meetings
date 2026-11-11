import { Suspense } from "react";
import type { ReactNode } from "react";
import NavLinks from "@/components/NavLinks";

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
            <NavLinks />
          </Suspense>
        </div>
      </div>
      {children}
    </>
  );
}
