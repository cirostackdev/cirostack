"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";

export function ValueProps({ service }: { service: ServiceEntry }) {
    return (
        <section className="py-24 bg-background border-t border-border/40">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The CiroStack Advantage</h2>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                        Why our {service.title} methodology works
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {service.valueProps.map((prop, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 md:p-10 rounded-3xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 text-2xl font-display font-bold text-foreground">
                                0{idx + 1}
                            </div>
                            <h4 className="text-2xl font-bold text-foreground mb-4">{prop.title}</h4>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {prop.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
