"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { IndustryEntry } from "@/data/industries";

interface IndustryValuePropsProps {
    industry: IndustryEntry;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export function IndustryValueProps({ industry }: IndustryValuePropsProps) {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-widest uppercase rounded-full bg-muted text-muted-foreground border border-border">
                        Why Partner With Us
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                        The CiroStack Advantage for {industry.title}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We don't just build software. We engineer competitive advantages that drive measurable business outcomes in your sector.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {industry.valueProps.map((vp, i) => (
                        <motion.div
                            key={vp.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={i}
                            className="p-8 rounded-3xl surface-glass border border-border/50 text-center hover:border-primary/30 transition-colors"
                        >
                            <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="font-display font-bold text-foreground text-xl mb-4">
                                {vp.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {vp.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
