"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function IndustryExpertise({ service }: { service: ServiceEntry }) {
    if (!service.industryExpertise || service.industryExpertise.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Built for your industry
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        We possess deep domain expertise across the strictest regulatory environments and highest scale markets.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {service.industryExpertise.map((industry, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-6 py-4 rounded-full bg-background border border-border shadow-sm flex items-center gap-3 hover:border-primary/50 transition-colors cursor-default"
                        >
                            <Check className="w-5 h-5 text-emerald-600" />
                            <span className="font-medium text-foreground">{industry}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
