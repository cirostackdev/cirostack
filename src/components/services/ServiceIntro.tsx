"use client";

import { motion } from "framer-motion";

export function ServiceIntro({ title, summary }: { title: string; summary: string }) {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Subtle abstract background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-5xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight text-primary">
                        {title} that delivers <span className="text-muted-foreground font-medium italic">{summary}</span>
                    </h2>
                </motion.div>
            </div>
        </section>
    );
}
