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

            <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight text-foreground">
                        Ready to start your project?
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        Let's discuss your specific challenges. Our engineering experts will work with you to architect the perfect solution.
                    </p>

                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-8 text-base font-semibold group">
                            Schedule a Consultation <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
