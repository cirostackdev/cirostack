"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PickerCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  icon: LucideIcon;
}

interface CategoryPickerProps {
  categories: PickerCategory[];
  basePath?: string;
}

export default function CategoryPicker({ categories, basePath = "/industries" }: CategoryPickerProps) {
  const sorted = [...categories].sort((a, b) => a.title.localeCompare(b.title));
  const [activeId, setActiveId] = useState<string>(sorted[0]?.id ?? "");
  const active = sorted.find((c) => c.id === activeId) ?? sorted[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
      {/* Left: alphabetical list */}
      <ul className="divide-y divide-border">
        {sorted.map((cat, i) => {
          const isActive = cat.id === activeId;
          return (
            <li key={cat.id}>
              <Link
                href={`${basePath}/${cat.id}`}
                onMouseEnter={() => setActiveId(cat.id)}
                onFocus={() => setActiveId(cat.id)}
                className="group flex items-center justify-between gap-6 py-5 md:py-6"
              >
                <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground/60 tabular-nums w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none transition-all duration-300 truncate ${
                      isActive
                        ? "text-foreground translate-x-2"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {cat.title}
                  </span>
                </div>
                <ArrowUpRight
                  className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                    isActive
                      ? "text-foreground opacity-100 -translate-y-0.5 translate-x-0.5"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right: sticky preview */}
      <div className="hidden lg:block sticky top-28">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="absolute inset-0"
            >
              <img
                src={active.image}
                alt={active.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                  <active.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                  {active.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                  {active.tagline}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
