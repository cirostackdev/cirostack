"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface BentoProject {
  title: string;
  client: string;
  industry: string;
  metric: string;
  tags: string[];
  image: string;
}

interface BentoProjectsProps {
  projects: BentoProject[];
}

/**
 * Editorial case-study showcase.
 * Left: a large featured project with a clean number index + metric callout.
 * Right: a vertical list of case studies styled like a magazine contents page —
 * numbered rows with hover preview, metric pill, and arrow affordance.
 */
export default function BentoProjects({ projects }: BentoProjectsProps) {
  const featured = projects[0];
  const list = projects.slice(1, 6);
  if (!featured) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-stretch">
      {/* ───── Featured ───── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Link
          href="/portfolio"
          className="group block relative rounded-3xl overflow-hidden border border-border bg-card aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[560px]"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Top row */}
          <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-white">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70">
              Case Study / 001
            </span>
            <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              Featured
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-3">
              {featured.industry} — {featured.client}
            </p>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white leading-[1.05] tracking-tight mb-5 max-w-xl">
              {featured.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs md:text-sm font-semibold text-white border-t border-white/30 pt-2 px-1">
                {featured.metric}
              </span>
              <span className="flex-1" />
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                Read case study
                <span className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ───── Editorial list ───── */}
      <div className="flex flex-col">
        <div className="hidden lg:flex items-center justify-between pb-5 mb-2 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            Selected Work
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            {String(list.length + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <ul className="flex-1 flex flex-col">
          {list.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 + i * 0.06 }}
              className="border-b border-border last:border-b-0"
            >
              <Link
                href="/portfolio"
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 py-5 md:py-6"
              >
                {/* Index + thumb */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono tabular-nums text-muted-foreground w-6">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-border shrink-0">
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 truncate">
                    {p.industry}
                  </p>
                  <h4 className="text-base md:text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                    {p.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {p.metric}
                  </p>
                </div>

                {/* Arrow */}
                <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-hover:translate-x-1 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
