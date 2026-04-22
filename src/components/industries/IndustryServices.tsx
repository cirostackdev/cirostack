"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { IndustryEntry } from "@/data/industries-generated";
import SectionHeading from "@/components/SectionHeading";

interface IndustryServicesProps {
    industry: IndustryEntry;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export function IndustryServices({ industry }: IndustryServicesProps) {
    if (!industry.serviceApplications || industry.serviceApplications.length === 0) return null;

    return (
        <section className="py-24 bg-card border-y border-border section-alt">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading
                    badge="Core Services"
                    title={`How CiroStack Empowers ${industry.title}`}
                    description="We apply our proven engineering disciplines to solve your most complex sector challenges."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {industry.serviceApplications.map((service, i) => (
                        <motion.div
                            key={service.serviceName}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={i}
                            className="p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col h-full"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Layers className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-display font-bold text-foreground text-xl mb-3 group-hover:text-primary transition-colors">
                                {service.serviceName}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                                {service.applicationDetail}
                            </p>

                            <Link
                                href={`/services/${service.slug}`}
                                className="inline-flex items-center text-sm font-semibold text-primary hover:underline mt-auto group/link"
                            >
                                Explore Service <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
