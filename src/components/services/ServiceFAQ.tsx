"use client";

import { type ServiceEntry } from "@/data/services/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function ServiceFAQ({ service }: { service: ServiceEntry }) {
    if (!service.faqs || service.faqs.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know about our {service.title.toLowerCase()} process.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {service.faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
                            <AccordionTrigger className="text-left text-lg font-bold hover:text-foreground transition-colors py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
