"use client";

/**
 * TestimonialsMarquee
 *
 * Shared infinite right-to-left scrolling testimonials strip.
 * Pass any array of { text, name, role } objects.
 * The list is duplicated internally to create a seamless loop.
 */

import { Star, Quote } from "lucide-react";

export type TestimonialItem = {
    text: string;
    name: string;
    role: string;
};

type Props = {
    items: TestimonialItem[];
    /** Section heading — defaults to "What our partners say" */
    heading?: string;
    /** Section sub-heading */
    subheading?: string;
    /** CSS animation duration — longer = slower. Default "100s" */
    duration?: string;
    /** Background class for the section wrapper. Default "bg-card" */
    sectionBg?: string;
};

export function TestimonialsMarquee({
    items,
    heading = "What our partners say",
    subheading = "Engineering excellence verified by industry leaders.",
    duration = "100s",
    sectionBg = "bg-card",
}: Props) {
    if (!items || items.length === 0) return null;

    // Duplicate so the loop is seamless even with very few items
    const track = items.length < 5
        ? [...items, ...items, ...items, ...items]
        : [...items, ...items];

    // Normalize speed: ~3.5s per card so all marquees feel the same regardless of item count
    const halfTrackCount = track.length / 2;
    const normalizedDuration = duration === "auto"
        ? `${Math.round(halfTrackCount * 3.5)}s`
        : duration;

    return (
        <section className={`py-14 md:py-24 ${sectionBg} border-t border-border/40 overflow-hidden`}>
            {/* Header */}
            <div className="container mx-auto px-4 md:px-6 mb-8 md:mb-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2 md:mb-3">
                        Testimonials
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-display font-bold text-foreground mb-3 md:mb-4">
                        {heading}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground">{subheading}</p>
                </div>
            </div>

            {/* Marquee track */}
            <div className="relative">
                {/* Edge fade masks */}
                <div className={`pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r ${sectionBg === "bg-card" ? "from-card" : "from-background"} to-transparent`} />
                <div className={`pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l ${sectionBg === "bg-card" ? "from-card" : "from-background"} to-transparent`} />

                <div
                    className="flex gap-4 md:gap-8 animate-marquee w-max py-4"
                    style={{ "--marquee-duration": normalizedDuration } as React.CSSProperties}
                >
                    {track.map((t, i) => (
                        <div
                            key={i}
                            className="w-[300px] md:w-[440px] shrink-0 p-6 md:p-9 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative"
                        >
                            <Quote className="absolute top-6 right-6 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 text-primary/10" />
                            <div className="flex gap-1 mb-4 md:mb-5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-sm md:text-base leading-relaxed text-muted-foreground italic mb-6 md:mb-8 min-h-[72px] md:min-h-[96px]">
                                "{t.text}"
                            </p>
                            <div className="border-t border-border/40 pt-4 md:pt-5">
                                <p className="font-bold text-foreground text-sm md:text-base">{t.name}</p>
                                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
