"use client";

import { motion } from "framer-motion";

interface ProcessStep {
  phase: string;
  activities: string;
  duration: string;
}

const CaseStudyProcess = ({ steps }: { steps: ProcessStep[] }) => (
  <div className="space-y-0">
    {steps.map((p, i) => (
      <motion.div
        key={p.phase}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.07 }}
        className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-6 border-t border-border last:border-b"
      >
        <span className="text-4xl md:text-5xl font-display font-bold text-muted-foreground/20 tabular-nums leading-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="font-display font-semibold text-foreground text-base md:text-lg">{p.phase}</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium shrink-0">{p.duration}</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{p.activities}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyProcess;
