"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const CaseStudyTestimonial = ({ quote, author, role }: TestimonialProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-l-4 border-primary pl-8 py-2"
  >
    <Quote className="w-8 h-8 text-primary/30 mb-4" />
    <blockquote className="text-foreground font-display text-xl md:text-2xl leading-relaxed mb-6">
      "{quote}"
    </blockquote>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-primary font-bold text-sm">{author.charAt(0)}</span>
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">{author}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  </motion.div>
);

export default CaseStudyTestimonial;
