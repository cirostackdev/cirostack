"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function WhoWeHelped({ service }: { service: ServiceEntry }) {
    return (
        <section className="py-24 bg-card text-card-foreground border-t border-border/40">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Who we help</h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            We partner with forward-thinking organizations ranging from agile startups to established enterprises to deliver <strong>{service.title.toLowerCase()}</strong> solutions that drive true market leadership.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
                            </div>
                            <span className="font-bold text-lg">4.9/5</span>
                            <span className="text-muted-foreground ml-1">average client rating</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {service.whoWeHelped.map((profile, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-secondary/50 rounded-2xl border border-border/50 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4 text-foreground font-bold">
                                    {idx + 1}
                                </div>
                                <p className="font-medium leading-relaxed">{profile}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
