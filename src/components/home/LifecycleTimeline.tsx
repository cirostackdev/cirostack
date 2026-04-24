"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lightbulb, Hammer, TrendingUp, Settings, Rocket } from "lucide-react";
import { servicesData } from "@/data/services";

export interface LifecyclePhase {
  name: string;
  services: { label: string; href: string }[];
}

interface LifecycleTimelineProps {
  phases: LifecyclePhase[];
}

const phaseIcons = [Lightbulb, Hammer, TrendingUp, Settings, Rocket];

const phaseDescriptions = [
  "Strategy, AI roadmap, transformation planning.",
  "Web, mobile, design — turning ideas into product.",
  "Cloud, performance, scale — making it production-ready.",
  "Data, identity, security — running it reliably.",
  "Teams, QA, audits — growing with confidence.",
];

/* Eager-load the service hero images via Vite/webpack URL resolution */
const serviceImages = import.meta.glob<string>(
  "@/assets/reason-*-0.jpg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

function imageForSlug(slug: string): string | undefined {
  const match = Object.entries(serviceImages).find(([path]) =>
    path.endsWith(`/reason-${slug}-0.jpg`)
  );
  return match?.[1];
}

function slugFromHref(href: string): string {
  return href.replace("/services/", "").replace(/\/$/, "");
}

interface FlatService {
  phaseIndex: number;
  phaseName: string;
  label: string;
  href: string;
  slug: string;
  title: string;
  blurb: string;
  image?: string;
}

export default function LifecycleTimeline({ phases }: LifecycleTimelineProps) {
  /* Flatten services with their phase context + service-data lookup */
  const items: FlatService[] = phases.flatMap((phase, phaseIndex) =>
    phase.services.map((svc) => {
      const slug = slugFromHref(svc.href);
      const data = servicesData[slug];
      return {
        phaseIndex,
        phaseName: phase.name,
        label: svc.label,
        href: svc.href,
        slug,
        title: data?.title ?? svc.label,
        blurb: data?.tagline ?? data?.introSummary ?? "",
        image: imageForSlug(slug),
      };
    })
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /* Track which service row is in the viewport center */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the entry closest to the viewport center
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      {
        // A horizontal band roughly through the middle of the viewport
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const active = items[activeIndex] ?? items[0];

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16">
        {/* ─── LEFT: vertical phase + service list ─── */}
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border" />

          <ol className="space-y-2">
            {items.map((item, i) => {
              const isFirstOfPhase =
                i === 0 || items[i - 1].phaseIndex !== item.phaseIndex;
              const Icon = phaseIcons[item.phaseIndex] ?? Lightbulb;
              const isActive = i === activeIndex;

              return (
                <li
                  key={`${item.phaseIndex}-${item.slug}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative"
                >
                  {/* Phase header — only on first service of the phase */}
                  {isFirstOfPhase && (
                    <div className="relative flex items-center gap-4 pt-8 pb-4 first:pt-0">
                      <div className="relative z-10 w-12 h-12 rounded-full bg-background border-2 border-foreground/80 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-muted-foreground tabular-nums">
                          0{item.phaseIndex + 1}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                          {item.phaseName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {phaseDescriptions[item.phaseIndex]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Service row */}
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-4 pl-16 pr-4 py-3 rounded-lg transition-colors hover:bg-muted/40"
                  >
                    {/* Node dot on rail */}
                    <span
                      className={`absolute left-6 -translate-x-1/2 w-2.5 h-2.5 rounded-full border transition-all ${
                        isActive
                          ? "bg-foreground border-foreground scale-125"
                          : "bg-background border-border group-hover:border-foreground"
                      }`}
                    />
                    <span
                      className={`flex-1 text-base md:text-lg font-medium transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-all ${
                        isActive
                          ? "opacity-100 translate-x-0 text-foreground"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ─── RIGHT: sticky card that swaps with active service ─── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.article
                key={active?.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
              >
                {active?.image && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur border border-border text-foreground">
                      {active.phaseName}
                    </span>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h4 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                    {active?.title}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    {active?.blurb}
                  </p>
                  <Link
                    href={active?.href ?? "#"}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all"
                  >
                    Explore {active?.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
