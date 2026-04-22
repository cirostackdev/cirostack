"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface Feature {
  feature: string;
  description: string;
  benefit: string;
}

const CaseStudyFeatures = ({ features }: { features: Feature[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {features.map((kf, i) => (
      <motion.div
        key={kf.feature}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
        className="group surface-glass rounded-2xl p-6 hover-lift"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <Zap className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{kf.feature}</h3>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{kf.description}</p>
            <p className="text-primary text-xs font-semibold mt-2 flex items-center gap-1">
              <span className="w-4 h-px bg-primary" />
              {kf.benefit}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyFeatures;
