"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import type { IndustryEntry } from "@/data/industries";

interface IndustryCTAProps {
    industry: IndustryEntry;
}

export function IndustryCTA({ industry }: IndustryCTAProps) {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:shadow-primary/5">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                        <MessageSquare className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                        Ready to transform your <span className="text-primary">{industry.title}</span> operations?
                    </h2>

                    <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Let's discuss your specific challenges. Our engineering experts will work with you to architect the perfect solution.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                                Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/portfolio">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full w-full sm:w-auto border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                                View Case Studies
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
