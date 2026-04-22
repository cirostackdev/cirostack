"use client";

import { motion } from "framer-motion";

interface ProcessStep {
  phase: string;
  activities: string;
  duration: string;
}

const CaseStudyProcess = ({ steps }: { steps: ProcessStep[] }) => (
  <div className="relative">
    {/* Timeline line */}
    <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border/50 to-transparent hidden md:block" />
    
    <div className="space-y-6">
      {steps.map((p, i) => (
        <motion.div
          key={p.phase}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-5 group"
        >
          <div className="hidden md:flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-sm font-bold text-foreground group-hover:bg-foreground group-hover:text-background transition-all">
              {i + 1}
            </div>
          </div>
          <div className="flex-1 surface-glass rounded-2xl p-5 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-foreground">{p.phase}</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">{p.duration}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.activities}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default CaseStudyProcess;
