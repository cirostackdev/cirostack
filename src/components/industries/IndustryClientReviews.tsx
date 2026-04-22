"use client";

import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { type IndustryEntry } from "@/data/industries-generated";
import { allTestimonials } from "@/data/testimonials";

export function IndustryClientReviews({ industry }: { industry: IndustryEntry }) {
    // Filter to testimonials tagged for this industry's parentCategory.
    // Fall back to full list if fewer than 3 match.
    const filtered = allTestimonials.filter(
        t => !t.industries || t.industries.includes(industry.parentCategory)
    );

    const items = filtered.length >= 3 ? filtered : allTestimonials;

    return (
        <TestimonialsMarquee
            items={items}
            heading="What our partners say"
            subheading={`Trusted by ${industry.title} leaders and engineering teams worldwide.`}
            duration="auto"
        />
    );
}
