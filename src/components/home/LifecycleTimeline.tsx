"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Lightbulb, Hammer, TrendingUp, Settings, Rocket } from "lucide-react";

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

export default function LifecycleTimeline({ phases }: LifecycleTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative max-w-5xl mx-auto">
      {/* Vertical rail */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
      <motion.div
        style={{ height: lineHeight }}
        className="absolute left-6 md:left-1/2 top-0 w-px bg-gradient-to-b from-primary to-accent md:-translate-x-px"
      />

      <div className="space-y-12 md:space-y-20">
        {phases.map((phase, i) => {
          const Icon = phaseIcons[i] ?? Lightbulb;
          const isRight = i % 2 === 1;
          return (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className={`relative flex md:items-center gap-6 md:gap-12 ${
                isRight ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Node */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Content card (offset around the rail) */}
              <div className="pl-20 md:pl-0 md:w-[calc(50%-3rem)]">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-xs font-mono text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {phase.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {phaseDescriptions[i]}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {phase.services.map((svc) => (
                    <li key={svc.label}>
                      <Link
                        href={svc.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors group"
                      >
                        {svc.label}
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spacer on the other side (desktop only) */}
              <div className="hidden md:block md:w-[calc(50%-3rem)]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
