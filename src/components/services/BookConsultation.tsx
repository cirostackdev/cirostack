"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function BookConsultation({ bookingType }: { bookingType: string }) {
    return (
        <section className="py-24 md:py-32 bg-slate-950 text-white dark:bg-slate-900 border-y border-slate-800 relative overflow-hidden">
            {/* Decorative gradient orb */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight">
                        Ready to dive deeper?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Every incredible product sequence starts with a conversation. Book a zero-pressure {bookingType.toLowerCase()} with our senior engineers to discuss your architecture.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-lg rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)]">
                            Book a {bookingType}
                            <ArrowRight className="ml-3 w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
