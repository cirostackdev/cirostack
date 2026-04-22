"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { industriesData } from "@/data/industries-generated";
import { industriesData as parentData } from "@/data/industries";
import imgDefault from "@/assets/hero-industry.jpg";

interface Props {
  categoryId: string;
}

export default function IndustryCategory({ categoryId }: Props) {
  const parent = parentData[categoryId];
  if (!parent) return null;

  const Icon = parent.icon;

  // Filter sub-industries belonging to this parent category
  const subIndustries = Object.values(industriesData).filter(
    (ind) => ind.parentCategory === parent.title
  );

  return (
    <Layout>
      <SEO
        title={`${parent.title} Software Solutions`}
        description={parent.tagline}
        url={`/industries/${categoryId}`}
      />

      <PageHero
        icon={Icon}
        title={parent.title}
        description={parent.tagline}
        image={imgDefault}
        ctaText="Start Your Project"
        ctaLink="/contact"
      />

      {/* ── Category intro ── */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {parent.description}
            </p>
          </div>

          {/* Stats */}
          {parent.stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 md:gap-14 mb-16">
              {parent.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                    {s.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Key challenges */}
          {parent.challenges.length > 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <SectionHeading
                badge="Industry Challenges"
                title={`What ${parent.title.toLowerCase()} businesses face`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parent.challenges.map((challenge, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {challenge}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solutions */}
          {parent.solutions.length > 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <SectionHeading
                badge="Our Solutions"
                title={`How we solve it`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parent.solutions.map((sol) => (
                  <div
                    key={sol.title}
                    className="p-5 rounded-xl border border-border bg-card"
                  >
                    <h4 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">
                      {sol.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {sol.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Sub-industries grid ── */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            badge={`${parent.title} Sectors`}
            title="Explore specialized solutions"
            description={`We build tailored software for every corner of the ${parent.title.toLowerCase()} industry.`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {subIndustries.map((sub) => {
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.id}
                  href={`/industries/${sub.id}`}
                  className="block group"
                >
                  <div className="h-full p-5 md:p-6 rounded-xl surface-glass hover-lift">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <SubIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-sm md:text-base mb-1.5">
                      {sub.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">
                      {sub.tagline}
                    </p>
                    <span className="text-primary text-xs font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Ready to transform your{" "}
              <span className="text-gradient">
                {parent.title.toLowerCase()}
              </span>{" "}
              business?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Tell us about your project. We respond within 24 hours with a
              free, no-obligation quote.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="rounded-full text-base px-8 group"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
