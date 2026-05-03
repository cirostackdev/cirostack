"use client";

import { motion } from "framer-motion";

interface Feature {
  feature: string;
  description: string;
  benefit: string;
}

const CaseStudyFeatures = ({ features }: { features: Feature[] }) => (
  <div className="space-y-0">
    {features.map((kf, i) => (
      <motion.div
        key={kf.feature}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.06 }}
        className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-6 border-t border-border last:border-b"
      >
        <span className="text-4xl md:text-5xl font-display font-bold text-muted-foreground/20 tabular-nums leading-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="font-display font-semibold text-foreground text-base md:text-lg mb-1">{kf.feature}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">{kf.description}</p>
          <span className="text-[hsl(var(--trust))] text-xs font-semibold">{kf.benefit}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyFeatures;
