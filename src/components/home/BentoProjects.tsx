"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";

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

export default function BentoProjects({ projects }: BentoProjectsProps) {
  const [hero, ...rest] = projects;
  if (!hero) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5 md:h-[640px]">
      {/* Hero project — large, spans 2 cols × 2 rows on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="md:col-span-2 md:row-span-2"
      >
        <Link
          href="/portfolio"
          className="group relative block h-full min-h-[360px] rounded-3xl overflow-hidden bg-card border border-border"
        >
          <img
            src={hero.image}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20">
              Featured
            </span>
            <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
              {hero.industry} · {hero.client}
            </p>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
              {hero.title}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <Zap className="w-3 h-3" />
              {hero.metric}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Smaller projects */}
      {rest.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
        >
          <Link
            href="/portfolio"
            className="group relative block h-full min-h-[200px] rounded-3xl overflow-hidden bg-card border border-border"
          >
            <img
              src={p.image}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[10px] uppercase tracking-widest text-white/70 mb-1">
                {p.industry}
              </p>
              <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-2 leading-tight">
                {p.title}
              </h3>
              <span className="text-xs text-white/80 font-medium">{p.metric}</span>
            </div>
            <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
