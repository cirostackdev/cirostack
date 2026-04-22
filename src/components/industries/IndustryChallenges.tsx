"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { IndustryEntry } from "@/data/industries";

interface IndustryChallengesProps {
    industry: IndustryEntry;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export function IndustryChallenges({ industry }: IndustryChallengesProps) {
    const Icon = industry.icon;

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-widest uppercase rounded-full bg-muted text-muted-foreground border border-border">
                            Industry Challenges
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-8 leading-tight">
                            We understand your unique pain points
                        </h2>
                        <div className="space-y-6">
                            {industry.challenges.map((challenge, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1 bg-emerald-500/10 p-1 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                    </div>
                                    <span className="text-lg text-muted-foreground leading-relaxed">
                                        {challenge}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={1}
                        className="p-10 md:p-12 rounded-3xl surface-glass border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Icon className="w-64 h-64 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-inner">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 leading-tight">
                                {industry.tagline}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {industry.description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
