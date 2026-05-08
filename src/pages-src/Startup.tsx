"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";

// Data
import { startupsData } from "@/data/startups-generated";

// Sections (reusing industry components - same data shape)
import { IndustryIntro } from "@/components/industries/IndustryIntro";
import { IndustryStats } from "@/components/industries/IndustryStats";
import { IndustryChallenges } from "@/components/industries/IndustryChallenges";
import { IndustryDeepDive } from "@/components/industries/IndustryDeepDive";
import { IndustryServices } from "@/components/industries/IndustryServices";
import { IndustryOurService } from "@/components/industries/IndustryOurService";
import { IndustryWhoWeHelped } from "@/components/industries/IndustryWhoWeHelped";
import { IndustryClientReviews } from "@/components/industries/IndustryClientReviews";
import { IndustryFAQ } from "@/components/industries/IndustryFAQ";
import { RelatedCaseStudies } from "@/components/industries/RelatedCaseStudies";
import { IndustryCTA } from "@/components/industries/IndustryCTA";

export default function Startup() {
    const pathname = usePathname();
    const id = pathname.split("/").filter(Boolean).pop() ?? "";

    const startupData = startupsData[id];

    const startupIndexInCategory = startupData
        ? Object.values(startupsData)
            .filter(i => i.parentCategory === startupData.parentCategory)
            .findIndex(i => i.id === startupData.id)
        : 0;

    // 404 Fallback
    if (!startupData) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold mb-4">Page not found</h1>
                    <p className="text-muted-foreground mb-8">The startup page you are looking for does not exist.</p>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    const heroImage = `/images/startups/hero-${id}.jpg`;

    return (
        <Layout>
            <SEO
                title={`${startupData.title} | CiroStack`}
                description={startupData.description}
                url={`/startups/${id}`}
            />

            <PageHero
                badge={startupData.parentCategory}
                title={startupData.title}
                description={startupData.description}
                image={heroImage}
                ctaText="Start Your Project"
                ctaLink="/contact"
                secondaryCtaText="View Case Studies"
                secondaryCtaLink="/portfolio"
            />

            <IndustryStats stats={startupData.stats} />

            <IndustryIntro title={startupData.title} summary={startupData.introSummary} />

            <IndustryDeepDive industry={startupData as any} industryIndexInCategory={startupIndexInCategory} />

            <IndustryOurService industry={startupData as any} />

            <IndustryChallenges industry={startupData as any} />

            <IndustryWhoWeHelped industry={startupData as any} />

            <IndustryServices industry={startupData as any} />

            <IndustryClientReviews industry={startupData as any} />

            <RelatedCaseStudies industry={startupData as any} />

            <IndustryFAQ industry={startupData as any} />

            <IndustryCTA industry={startupData as any} />
        </Layout>
    );
}
