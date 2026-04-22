"use client";

import { motion } from "framer-motion";
import type { IndustryStat } from "@/data/industries";

interface IndustryStatsProps {
    stats: IndustryStat[];
}

export function IndustryStats({ stats }: IndustryStatsProps) {
    return (
        <section className="py-16 border-y border-border section-alt">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
                                {stat.value}
                            </div>
                            <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
