"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface BentoProject {
  id: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  description: string;
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
 * Right: a vertical list of case studies styled like a magazine contents page : 
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
      >
        <Link href={`/portfolio/${featured.id}`} className="block group">
          <div className="rounded-2xl overflow-hidden surface-glass hover-lift">
            {/* Image */}
            <div className="h-72 overflow-hidden relative">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
                Featured
              </span>
            </div>
            {/* Content */}
            <div className="p-6">
              <p className="text-xs text-muted-foreground font-medium mb-1">{featured.client}</p>
              <h3 className="font-display font-semibold text-foreground text-xl mb-2">{featured.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{featured.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{featured.industry}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{featured.service}</span>
              </div>
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
                href={`/portfolio/${p.id}`}
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
