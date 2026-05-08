"use client";

import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { type IndustryEntry } from "@/data/industries-generated";
import { allTestimonials } from "@/data/testimonials";
import { HIDE_TESTIMONIALS } from "@/lib/feature-flags";

export function IndustryClientReviews({ industry }: { industry: IndustryEntry }) {
    if (HIDE_TESTIMONIALS) return null;
    const items = allTestimonials.filter(
        t => t.startups?.includes(industry.id)
    );

    if (items.length === 0) return null;

    return (
        <TestimonialsMarquee
            items={items}
            heading="What our partners say"
            subheading={`Trusted by ${industry.title} leaders and engineering teams worldwide.`}
            duration="auto"
        />
    );
}
