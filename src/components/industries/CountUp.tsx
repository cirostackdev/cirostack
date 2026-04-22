"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CountUpProps {
  value: string;
  label: string;
  duration?: number;
}

/** Parses a value like "20+", "200", "5", "99.9%" into [number, prefix, suffix]. */
function parseValue(raw: string): { num: number | null; prefix: string; suffix: string } {
  const match = raw.match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) return { num: null, prefix: raw, suffix: "" };
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] };
}

export default function CountUp({ value, label, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { num, prefix, suffix } = parseValue(value);
  const [display, setDisplay] = useState<string>(num === null ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView || num === null) return;
    const start = performance.now();
    const decimals = (num.toString().split(".")[1] || "").length;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = num * eased;
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, prefix, suffix, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gradient leading-none tabular-nums">
        {num === null ? value : display}
      </p>
      <p className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.18em]">
        {label}
      </p>
    </motion.div>
  );
}
