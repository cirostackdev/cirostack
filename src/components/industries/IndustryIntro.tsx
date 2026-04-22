"use client";

import { motion } from "framer-motion";

interface IndustryIntroProps {
    title: string;
    summary: string;
}

export function IndustryIntro({ title, summary }: IndustryIntroProps) {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                            Transforming <span className="text-primary">{title}</span> through Technology
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {summary}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
