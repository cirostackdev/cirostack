"use client";

import { type IndustryEntry } from "@/data/industries-generated";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function IndustryFAQ({ industry }: { industry: IndustryEntry }) {
    if (!industry.faqs || industry.faqs.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Specific insights into our {industry.title} engineering process.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {industry.faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
                            <AccordionTrigger className="text-left text-lg font-bold hover:text-foreground transition-colors py-6 text-foreground">
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
