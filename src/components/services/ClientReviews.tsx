"use client";

import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { allTestimonials } from "@/data/testimonials";

type Props = {
    /** Service slug (e.g. "ai-ml", "websites"). When provided, filters to relevant testimonials. */
    serviceId?: string;
};

export function ClientReviews({ serviceId }: Props) {
    // Filter to testimonials tagged for this service (or untagged — show everywhere).
    // Fall back to the full list if fewer than 3 match.
    const filtered = serviceId
        ? allTestimonials.filter(t => !t.services || t.services.includes(serviceId))
        : allTestimonials;

    const items = filtered.length >= 3 ? filtered : allTestimonials;

    return (
        <TestimonialsMarquee
            items={items}
            heading="What our partners say"
            subheading="Engineering excellence verified by industry leaders across every service we offer."
            duration="auto"
        />
    );
}
