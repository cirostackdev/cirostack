"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lightbulb, Hammer, TrendingUp, Settings, Rocket } from "lucide-react";
import { servicesData } from "@/data/services";

import imgAi from "@/assets/reason-ai-0.jpg";
import imgStartups from "@/assets/reason-startups-0.jpg";
import imgDigitalTransformation from "@/assets/reason-digital-transformation-0.jpg";
import imgWebsites from "@/assets/reason-websites-0.jpg";
import imgApps from "@/assets/reason-apps-0.jpg";
import imgUxUi from "@/assets/reason-ux-ui-design-0.jpg";
import imgCloudConsulting from "@/assets/reason-cloud-consulting-0.jpg";
import imgCloudEngineering from "@/assets/reason-cloud-engineering-0.jpg";
import imgDataEngineering from "@/assets/reason-data-engineering-0.jpg";
import imgIam from "@/assets/reason-iam-0.jpg";
import imgSecurityAudit from "@/assets/reason-security-audit-0.jpg";
import imgDedicatedTeams from "@/assets/reason-dedicated-teams-0.jpg";
import imgNearshore from "@/assets/reason-nearshore-0.jpg";
import imgAutomationTesting from "@/assets/reason-automation-testing-0.jpg";
import imgSoftwareAuditing from "@/assets/reason-software-auditing-0.jpg";

const SERVICE_IMAGES: Record<string, string> = {
  ai: imgAi as unknown as string,
  startups: imgStartups as unknown as string,
  "digital-transformation": imgDigitalTransformation as unknown as string,
  websites: imgWebsites as unknown as string,
  apps: imgApps as unknown as string,
  "ux-ui-design": imgUxUi as unknown as string,
  "cloud-consulting": imgCloudConsulting as unknown as string,
  "cloud-engineering": imgCloudEngineering as unknown as string,
  "data-engineering": imgDataEngineering as unknown as string,
  iam: imgIam as unknown as string,
  "security-audit": imgSecurityAudit as unknown as string,
  "dedicated-teams": imgDedicatedTeams as unknown as string,
  nearshore: imgNearshore as unknown as string,
  "automation-testing": imgAutomationTesting as unknown as string,
  "software-auditing": imgSoftwareAuditing as unknown as string,
};

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
  "Web, mobile, design: turning ideas into product.",
  "Cloud, performance, scale: making it production-ready.",
  "Data, identity, security: running it reliably.",
  "Teams, QA, audits: growing with confidence.",
];

function imageForSlug(slug: string): string | undefined {
  return SERVICE_IMAGES[slug];
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

  /* Desktop active index (scroll-driven) and mobile active index (click-driven, defaults to first). */
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /* Desktop only: pick the service row whose center is closest to the viewport center. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      if (!mq.matches) return;
      const viewportCenter = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setDesktopActiveIndex(bestIdx);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const active = items[desktopActiveIndex] ?? items[0];

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
              const isDesktopActive = i === desktopActiveIndex;
              const isMobileActive = i === mobileActiveIndex;

              return (
                <li
                  key={`${item.phaseIndex}-${item.slug}`}
                  className="relative"
                >
                  {/* Phase header: only on first service of the phase */}
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

                  {/* Service row: Link on desktop, click toggles card on mobile */}
                  <Link
                    href={item.href}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    data-index={i}
                    onClick={(e) => {
                      if (
                        typeof window !== "undefined" &&
                        window.matchMedia("(max-width: 1023px)").matches
                      ) {
                        e.preventDefault();
                        setMobileActiveIndex(i);
                      }
                    }}
                    className="group relative flex items-center gap-4 pl-16 pr-4 py-3 rounded-lg transition-colors hover:bg-muted/40"
                  >
                    {/* Node dot on rail */}
                    <span
                      className={`absolute left-6 -translate-x-1/2 w-2.5 h-2.5 rounded-full border transition-all ${
                        isMobileActive
                          ? "bg-foreground border-foreground scale-125"
                          : "bg-background border-border group-hover:border-foreground"
                      } ${
                        isDesktopActive
                          ? "lg:bg-foreground lg:border-foreground lg:scale-125"
                          : "lg:bg-background lg:border-border lg:scale-100"
                      }`}
                    />
                    <span
                      className={`flex-1 text-base md:text-lg font-medium transition-colors ${
                        isMobileActive ? "text-foreground" : "text-muted-foreground"
                      } ${
                        isDesktopActive ? "lg:text-foreground" : "lg:text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-all ${
                        isMobileActive
                          ? "opacity-100 translate-x-0 text-foreground rotate-90 lg:rotate-0"
                          : "opacity-60"
                      } ${
                        isDesktopActive
                          ? "lg:opacity-100 lg:translate-x-0 lg:text-foreground"
                          : "lg:opacity-0 lg:-translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0"
                      }`}
                    />
                  </Link>

                  {/* Mobile inline card: opens directly under the active service */}
                  <AnimatePresence initial={false}>
                    {isMobileActive && (
                      <motion.div
                        key={`mobile-card-${item.slug}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="lg:hidden overflow-hidden pl-16 pr-4"
                      >
                        <Link
                          href={item.href}
                          className="group block mt-3 mb-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                        >
                          {item.image && (
                            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                              <span className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur border border-border text-foreground">
                                {item.phaseName}
                              </span>
                            </div>
                          )}
                          <div className="p-5">
                            <h4 className="text-lg font-display font-bold text-foreground mb-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              {item.blurb}
                            </p>
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                              Explore {item.label}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ─── RIGHT: sticky card that swaps with active service (desktop only) ─── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active?.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Link
                  href={active?.href ?? "#"}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-foreground/30 transition-all"
                >
                  {active?.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={active.image}
                        alt={active.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                      Explore {active?.label}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
