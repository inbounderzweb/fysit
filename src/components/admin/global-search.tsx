"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/admin/icons";
import type { SearchResult } from "@/app/api/admin/search/route";

export function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { results: SearchResult[] }) => setResults(data.results ?? []))
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function goTo(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Search anything…"
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-14 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
        ⌘K
      </kbd>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="p-3 text-sm text-neutral-500">No results.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {results.map((result) => (
                <li key={`${result.type}-${result.href}`}>
                  <button
                    type="button"
                    onMouseDown={() => goTo(result.href)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    <span className="truncate text-neutral-900">{result.label}</span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {result.type}
                      {result.sublabel ? ` · ${result.sublabel}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
