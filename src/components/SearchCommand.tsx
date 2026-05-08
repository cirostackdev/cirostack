"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { searchIndex, type SearchCategory } from "@/lib/search-data";

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

  // Reset query when modal closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: searchIndex.filter((item) => item.category === cat),
  }));

  // Approximate match count (mirrors cmdk's contains-word behaviour)
  const resultCount = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return searchIndex.filter((item) => item.keywords.includes(q)).length;
  }, [query]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search services, industries, case studies..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
        {grouped.map(({ category, items }) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.keywords}
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
        <span className="flex items-center gap-1">
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
