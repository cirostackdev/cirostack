"use client";

import { motion } from "framer-motion";
import type { IndustryEntry } from "@/data/industries-generated";

/**
 * Map parent category names to image folder slugs.
 * Each category has 10 images (0–9) in /images/industries/{slug}-{n}.jpg
 */
const categorySlugMap: Record<string, string> = {
    "Retail & E-Commerce": "retail",
    "Healthcare & Medical": "healthcare",
    "Finance & Banking": "finance",
    "Real Estate": "realestate",
    "Education": "education",
    "Travel & Hospitality": "travel",
    "Manufacturing": "manufacturing",
    "Professional Services": "services",
    "Media & Entertainment": "media",
    "Non-Profit": "nonprofit",
    "Non-Profit & Social Enterprise": "nonprofit",
    "Technology": "technology",
    "Technology & Startups": "technology",
    "Agriculture": "agriculture",
    "Agriculture & Farming": "agriculture",
    "Construction": "construction",
    "Construction & Engineering": "construction",
    "Logistics & Supply Chain": "logistics",
    "Government": "government",
    "Government & Public Sector": "government",
    "Sports & Fitness": "sports",
    "Sports & Recreation": "sports",
    "Beauty & Lifestyle": "beauty",
    "Beauty & Personal Care": "beauty",
    "Automotive": "automotive",
    "Legal Services": "legal",
    "Small Business": "smallbusiness",
    "Transportation & Logistics": "transportation",
};

/**
 * Number of available images per category.
 * Most categories have 10 images (0–9). Categories with more get listed here.
 */
const categoryImageCount: Record<string, number> = {
    "Small Business": 30,
    "Legal Services": 30,
    "Automotive": 30,
    "Beauty & Personal Care": 30,
    "Sports & Recreation": 30,
    "Government & Public Sector": 30,
    "Transportation & Logistics": 30,
    "Non-Profit & Social Enterprise": 30,
    "Construction & Engineering": 30,
    "Agriculture & Farming": 30,
    "Technology & Startups": 30,
    "Media & Entertainment": 30,
    "Professional Services": 30,
    "Retail & E-Commerce": 30,
};

interface IndustryDeepDiveProps {
    industry: IndustryEntry;
    /** The industry's index within its parent category (0–9). Used to pick unique images. */
    industryIndexInCategory?: number;
}

export function IndustryDeepDive({ industry, industryIndexInCategory = 0 }: IndustryDeepDiveProps) {
    if (!industry.deepDive || industry.deepDive.length === 0) return null;

    const catSlug = categorySlugMap[industry.parentCategory] || "retail";

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">

                {industry.deepDive.map((section, index) => {
                    const isEven = index % 2 === 0;

                    // Pick a unique image: rotate through the pool using industry index + phase index
                    const imagePoolSize = categoryImageCount[industry.parentCategory] || 10;
                    const imageIndex = (industryIndexInCategory * 3 + index) % imagePoolSize;
                    const imageSrc = `/images/industries/${catSlug}-${imageIndex}.jpg`;

                    return (
                        <div key={section.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center mb-24 last:mb-0`}>

                            <motion.div
                                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className="w-full lg:w-1/2"
                            >
                                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-video lg:aspect-square bg-muted shadow-2xl group border border-border/50">
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
                                    <img
                                        src={imageSrc}
                                        alt={section.imageAlt}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="w-full lg:w-1/2 space-y-6"
                            >
                                <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">Phase 0{index + 1}</span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                                    {section.title}
                                </h2>

                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    {section.content.map((paragraph, pIndex) => (
                                        <p key={pIndex}>{paragraph}</p>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}

            </div>
        </section>
    );
}
