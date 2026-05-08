"use client";

import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { type IndustryEntry } from "@/data/industries-generated";
import { allTestimonials } from "@/data/testimonials";
import { HIDE_TESTIMONIALS } from "@/lib/feature-flags";

export function IndustryClientReviews({ industry }: { industry: IndustryEntry }) {
    if (HIDE_TESTIMONIALS) return null;
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
