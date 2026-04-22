"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";

export function ServiceProcess({ service }: { service: ServiceEntry }) {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">How we execute</h2>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                        Our Proven Methodology
                    </h3>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        A structured, repeatable engineering process that mathematically removes risk from complex software deployments.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2" />

                    <div className="space-y-12">
                        {service.processSteps.map((step, idx) => (
                            <div key={idx} className={`relative flex items-center justify-between md:justify-normal group ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                                {/* Node */}
                                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-background border-4 border-border shadow-[0_0_0_4px_rgba(var(--background),1)] -translate-x-1/2 z-10 transition-colors group-hover:bg-foreground" />

                                {/* Content Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`ml-12 md:ml-0 md:w-[calc(50%-3rem)] bg-card border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
                                >
                                    <div className="text-muted-foreground font-bold text-lg mb-2">Phase 0{idx + 1}</div>
                                    <h4 className="text-2xl font-bold mb-3">{step.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </motion.div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
