"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Check } from "lucide-react";
import type { IndustryEntry } from "@/data/industries";

interface IndustrySolutionsProps {
    industry: IndustryEntry;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export function IndustrySolutions({ industry }: IndustrySolutionsProps) {
    return (
        <section className="py-24 bg-card border-y border-border section-alt relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading
                    badge="Our Solutions"
                    title="How we help"
                    description={`Proven technology solutions engineered specifically for the ${industry.title} sector.`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {industry.solutions.map((sol, i) => (
                        <motion.div
                            key={sol.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={i}
                            className="p-8 md:p-10 rounded-3xl bg-background border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group flex gap-6 items-start"
                        >
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
                                <Check className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-foreground text-xl md:text-2xl mb-4 group-hover:text-primary transition-colors">
                                    {sol.title}
                                </h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    {sol.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
