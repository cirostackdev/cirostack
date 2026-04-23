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
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group hover:border-border transition-all duration-500">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500">
                        <MessageSquare className="w-10 h-10 text-foreground" />
                    </div>

                    <h2 className="text-4xl md:5xl font-display font-bold text-foreground mb-6 leading-tight">
                        Ready to transform your <span className="text-foreground italic">{industry.title}</span> operations?
                    </h2>

                    <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Let's discuss your specific challenges. Our engineering experts will work with you to architect the perfect solution.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto shadow-lg hover:-translate-y-1 transition-all">
                                Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/portfolio">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full w-full sm:w-auto">
                                View Case Studies
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
