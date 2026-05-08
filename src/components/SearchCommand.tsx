"use client";

import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { searchIndex, type SearchCategory, type SearchItem } from "@/lib/search-data";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_ORDER: SearchCategory[] = [
  "Services",
  "Startups",
  "Case Studies",
  "Blog",
];

// Build Fuse instance once — weighted fields so title/tagline rank above body text
const fuse = new Fuse<SearchItem>(searchIndex, {
  keys: [
    { name: "title",    weight: 0.5 },
    { name: "subtitle", weight: 0.3 },
    { name: "keywords", weight: 0.2 },
  ],
  threshold: 0.35,   // 0 = exact, 1 = match anything; 0.35 is a good balance
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const listRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top on every query change so the first result is always visible
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const { grouped, resultCount } = useMemo(() => {
    const q = query.trim();
    if (!q) return { grouped: [], resultCount: null };

    // Keep Fuse results in score order (best first)
    const fuseResults = fuse.search(q);

    // Build groups, preserving per-item score order within each category
    const groups = CATEGORY_ORDER
      .map((cat) => ({
        category: cat,
        items: fuseResults.filter((r) => r.item.category === cat).map((r) => r.item),
        bestScore: fuseResults.find((r) => r.item.category === cat)?.score ?? 1,
      }))
      .filter(({ items }) => items.length > 0)
      // Sort groups so the category with the best (lowest) score appears first
      .sort((a, b) => a.bestScore - b.bestScore)
      .map(({ category, items }) => ({ category, items }));

    return { grouped: groups, resultCount: fuseResults.length };
  }, [query]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search services, startups, case studies..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList ref={listRef} className="max-h-[420px] overflow-y-auto">
        {query.trim() !== "" && grouped.length === 0 && (
          <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
        )}
        {grouped.map(({ category, items }) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => handleSelect(item.href)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{item.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {item.subtitle}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="border-t px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
        {resultCount !== null ? (
          <span>
            {resultCount > 0
              ? `${resultCount} result${resultCount !== 1 ? "s" : ""} found`
              : "No matches"}
          </span>
        ) : (
          <span>Search across {searchIndex.length} pages</span>
        )}
        <span className="hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-[10px]">
            {typeof navigator !== "undefined" && navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-[10px]">K</kbd>
          <span className="ml-0.5">to toggle</span>
        </span>
      </div>
    </CommandDialog>
  );
}
