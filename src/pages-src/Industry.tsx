"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";

// Data
import { industriesData } from "@/data/industries-generated";
import { getIndustryStats } from "@/data/industry-stats-map";

// Sections
import { IndustryIntro } from "@/components/industries/IndustryIntro";
import { IndustryStats } from "@/components/industries/IndustryStats";
import { IndustryChallenges } from "@/components/industries/IndustryChallenges";
import { IndustryDeepDive } from "@/components/industries/IndustryDeepDive";
import { IndustrySolutions } from "@/components/industries/IndustrySolutions";
import { IndustryValueProps } from "@/components/industries/IndustryValueProps";
import { IndustryServices } from "@/components/industries/IndustryServices";
import { IndustryOurService } from "@/components/industries/IndustryOurService";
import { IndustryWhoWeHelped } from "@/components/industries/IndustryWhoWeHelped";
import { IndustryClientReviews } from "@/components/industries/IndustryClientReviews";
import { IndustryFAQ } from "@/components/industries/IndustryFAQ";
import { RelatedCaseStudies } from "@/components/industries/RelatedCaseStudies";
import { IndustryCTA } from "@/components/industries/IndustryCTA";

// Fallback image
import imgDefault from "@/assets/hero-industry.jpg";

// Helper to get industry-specific hero image (generated into public/images/industries/)
function getIndustryHeroImage(slug: string): string {
    return `/images/industries/hero-${slug}.jpg`;
}

export default function Industry() {
    const pathname = usePathname();
    const id = pathname.split("/").filter(Boolean).pop() ?? "";

    // 1. Resolve the generated industry data directly
    const industryData = industriesData[id];

    // Calculate this industry's index within its parent category for unique image assignment
    const industryIndexInCategory = industryData
        ? Object.values(industriesData)
            .filter(i => i.parentCategory === industryData.parentCategory)
            .findIndex(i => i.id === industryData.id)
        : 0;

    // 404 Fallback
    if (!industryData) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold mb-4">Industry not found</h1>
                    <p className="text-muted-foreground mb-8">The industry page you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    // Use industry-specific hero image with fallback to default
    const heroImage = getIndustryHeroImage(id);

    return (
        <Layout>
            <SEO
                title={`${industryData.title} Software Solutions | CiroStack`}
                description={industryData.description}
                url={`/industries/${id}`}
            />

            {/* 1. Page Hero */}
            <PageHero
                badge={industryData.parentCategory}
                title={`${industryData.title} Transformation`}
                description={industryData.description}
                image={heroImage}
                ctaText="Discuss Your Project"
                ctaLink="/contact"
                secondaryCtaText="View Case Studies"
                secondaryCtaLink="/portfolio"
            />

            {/* 2. Stats Section — unique per industry */}
            <IndustryStats stats={getIndustryStats(id, industryData.parentCategory)} />

            {/* 3. Intro Section */}
            <IndustryIntro title={industryData.title} summary={industryData.introSummary} />

            {/* 4. Deep Dive Image & Text Section */}
            <IndustryDeepDive industry={industryData} industryIndexInCategory={industryIndexInCategory} />

            {/* 5. Our Service (NEW) */}
            <IndustryOurService industry={industryData} />

            {/* 6. Challenges Section */}
            <IndustryChallenges industry={industryData} />

            {/* 7. Who We Helped (NEW) */}
            <IndustryWhoWeHelped industry={industryData} />

            {/* 8. Solutions Section */}
            <IndustrySolutions industry={industryData} />

            {/* 9. Services Application Section */}
            <IndustryServices industry={industryData} />

            {/* 10. Value Props Section */}
            <IndustryValueProps industry={industryData} />

            {/* 11. Client Reviews (NEW) */}
            <IndustryClientReviews industry={industryData} />

            {/* 12. Related Case Studies */}
            <RelatedCaseStudies industry={industryData} />

            {/* 13. FAQ (NEW) */}
            <IndustryFAQ industry={industryData} />

            {/* 14. Call to Action */}
            <IndustryCTA industry={industryData} />

        </Layout>
    );
}
