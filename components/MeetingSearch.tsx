"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface MeetingSearchProps {
  placeholder: string;
}

export default function MeetingSearch({ placeholder }: MeetingSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    // A new search always starts back on page 1.
    params.delete("page");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    const queryString = params.toString();
    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, 300);

  return (
    <input
      aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
      className="w-full max-w-md rounded-full border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      defaultValue={searchParams.get("query")?.toString()}
      onChange={(event) => handleSearch(event.target.value)}
      placeholder={placeholder}
      type="search"
    />
  );
}
