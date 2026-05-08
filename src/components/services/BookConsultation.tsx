"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function BookConsultation({ bookingType }: { bookingType: string }) {
    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">

            <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight text-foreground">
                        Ready to dive deeper?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        Every incredible product sequence starts with a conversation. Book a zero-pressure {bookingType.toLowerCase()} with our senior engineers to discuss your architecture.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-8 text-base font-semibold group">
                            Book a {bookingType}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
