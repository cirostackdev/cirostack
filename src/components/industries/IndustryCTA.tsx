"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { IndustryEntry } from "@/data/industries";

interface IndustryCTAProps {
    industry: IndustryEntry;
}

export function IndustryCTA({ industry }: IndustryCTAProps) {
    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight text-foreground">
                        Ready to start your <span className="text-gradient italic">{industry.title}</span> project?
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        Let's discuss your specific challenges. Our engineering experts will work with you to architect the perfect solution.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="h-16 px-10 text-lg rounded-full font-bold w-full sm:w-auto shadow-lg hover:-translate-y-1 transition-all">
                                Schedule a Consultation <ArrowRight className="ml-3 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/portfolio">
                            <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full w-full sm:w-auto">
                                View Case Studies
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
