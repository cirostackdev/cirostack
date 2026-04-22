"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryFAQProps {
  items: FAQItem[];
  title?: string;
  badge?: string;
}

export default function CategoryFAQ({
  items,
  title = "Frequently asked questions",
  badge = "FAQ",
}: CategoryFAQProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-muted text-muted-foreground border border-border">
          {badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          {title}
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border-b border-border"
          >
            <AccordionTrigger className="text-left text-base md:text-lg font-display font-semibold text-foreground hover:text-primary transition-colors py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
