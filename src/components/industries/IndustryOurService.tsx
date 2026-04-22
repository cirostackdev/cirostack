"use client";

import { CheckCircle } from "lucide-react";
import { type IndustryEntry } from "@/data/industries-generated";
import { motion } from "framer-motion";

export function IndustryOurService({ industry }: { industry: IndustryEntry }) {
    if (!industry.details || industry.details.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30 border-y border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Description & Capabilities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Technical Capability</h2>
                        <h3 className="text-4xl font-display font-bold mb-6 text-foreground">Our {industry.title} Stack</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {industry.description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-xl font-bold mb-6 border-b border-border pb-4">Key Priorities</h4>
                        <div className="grid gap-4">
                            {industry.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
                                    <span className="text-foreground leading-relaxed">{detail}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Included & Deliverables */}
                <div className="pt-16 border-t border-border/50">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div>
                            <h4 className="text-3xl font-display font-bold">Standard Deliverables</h4>
                            <p className="text-muted-foreground mt-2">The architecture artifacts you receive in every {industry.title} engagement.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industry.deliverables.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border hover:shadow-md transition-shadow"
                            >
                                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                                <span className="font-medium text-card-foreground leading-snug pt-0.5">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
