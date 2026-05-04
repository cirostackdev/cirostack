"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { industriesData as subIndustries } from "@/data/industries-generated";
import { industriesData as parentCategories } from "@/data/industries";

/* Build the full list of 200 sub-industries with their parent icon and hero image */
const allChips = Object.values(subIndustries).map((ind) => {
  const parent = Object.values(parentCategories).find(
    (p) => p.title === ind.parentCategory
  );
  return {
    label: ind.title,
    icon: parent?.icon,
    image: `/images/industries/hero-${ind.id}.jpg`,
    path: `/industries/${ind.id}`,
  };
});

interface HeroVisualStackProps {
  image?: string;
}

export default function HeroVisualStack({ image: _image }: HeroVisualStackProps) {
  /* Shuffle once on mount so repeat visits feel fresh */
  const chips = useMemo(() => {
    const arr = [...allChips];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const advance = () => {
      const next = (idxRef.current + 1) % chips.length;
      const src = chips[next].image;

      const go = () => {
        loadedRef.current.add(src);
        idxRef.current = next;
        setIdx(next);
        timeoutId = setTimeout(advance, 3500);
      };

      if (loadedRef.current.has(src)) {
        go();
      } else {
        const img = new Image();
        img.src = src;
        img.onload = go;
        img.onerror = () => { timeoutId = setTimeout(advance, 3500); };
      }
    };

    timeoutId = setTimeout(advance, 3500);
    return () => clearTimeout(timeoutId);
  }, [chips]);

  const current = chips[idx];
  const Icon = current.icon;

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-square">
      {/* Ambient gradient blobs */}
      <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-primary/30 blur-3xl opacity-60" />
      <div className="absolute -bottom-16 -left-10 w-80 h-80 rounded-full bg-accent/30 blur-3xl opacity-50" />

      {/* Featured screenshot: swaps with active industry */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute inset-6 md:inset-8 rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card"
      >
        <Link href={current.path} className="block w-full h-full">
          <AnimatePresence mode="sync">
            <motion.img
              key={idx}
              src={current.image}
              alt={`${current.label} project`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/20 via-transparent to-transparent" />
        </Link>
      </motion.div>

      {/* Floating industry chip: top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute top-2 right-2 md:top-0 md:right-0 z-10"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl min-w-[180px]">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {Icon && <Icon className="w-5 h-5 text-primary" />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              WE'VE BUILT SOFTWARE FOR
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="font-display font-semibold text-sm text-foreground truncate"
              >
                {current.label}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Floating metric chip: bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-2 left-2 md:bottom-8 md:left-0 z-10"
      >
        <div className="px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-display font-bold text-gradient">
              4–8
            </span>
            <span className="text-xs text-muted-foreground">weeks to ship</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 w-6 rounded-full ${
                  i < 3 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
