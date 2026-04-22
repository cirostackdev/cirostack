"use client";

import { motion } from "framer-motion";

interface Metric {
  value: string;
  label: string;
}

const CaseStudyMetrics = ({ metrics }: { metrics: Metric[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {metrics.map((m, i) => (
      <motion.div
        key={m.label}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="relative group rounded-2xl p-6 text-center surface-glass hover-lift overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-3xl md:text-4xl font-display font-bold text-gradient relative z-10">{m.value}</p>
        <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider relative z-10">{m.label}</p>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyMetrics;
