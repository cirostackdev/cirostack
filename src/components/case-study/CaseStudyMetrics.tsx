"use client";

import { motion } from "framer-motion";

interface Metric {
  value: string;
  label: string;
}

const CaseStudyMetrics = ({ metrics }: { metrics: Metric[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
    {metrics.map((m, i) => (
      <motion.div
        key={m.label}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="bg-card px-6 py-8 text-center"
      >
        <p className="text-3xl md:text-4xl font-display font-bold text-[hsl(var(--trust))]">{m.value}</p>
        <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">{m.label}</p>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyMetrics;
