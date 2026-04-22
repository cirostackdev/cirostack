"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { projects, projectImages } from "@/data/caseStudies";

import heroPortfolio from "@/assets/hero-portfolio.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

// Derive filter options from actual data
const allProjects = Object.entries(projects).map(([id, p]) => ({ id, ...p }));
const industriesList = ["All industries", ...Array.from(new Set(allProjects.map(p => p.industry))).sort()];
const countriesList = ["All countries", ...Array.from(new Set(allProjects.map(p => p.country))).sort()];
const servicesList = ["All services", ...Array.from(new Set(allProjects.map(p => p.service))).sort()];

const Portfolio = () => {
  const searchParams = useSearchParams();
  const prefilterService = searchParams.get("service");

  const [indFilters, setIndFilters] = useState<string[]>([]);
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>(
    prefilterService ? [prefilterService] : []
  );

  const filtered = allProjects.filter((p) => {
    const indMatch = indFilters.length === 0 || indFilters.includes("All industries") || indFilters.includes(p.industry);
    const coMatch = countryFilters.length === 0 || countryFilters.includes("All countries") || countryFilters.includes(p.country);
    const svcMatch = serviceFilters.length === 0 || serviceFilters.includes("All services") || serviceFilters.includes(p.service);
    return indMatch && coMatch && svcMatch;
  });

  return (
    <Layout>
      <SEO
        title="Our Portfolio and Case Studies"
        description="Explore case studies and successful software projects delivered by CiroStack for startups and established businesses."
        url="/portfolio"
      />
      <PageHero
        icon={Briefcase}
        title="Our Portfolio"
        description="Real results for real businesses. Explore our case studies and see the impact we've made."
        image={heroPortfolio}
        ctaText="Contact Us"
        ctaLink="/contact"
      />

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filter Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <MultiSelectFilter
              label="Industries"
              options={industriesList}
              selected={indFilters}
              onChange={setIndFilters}
            />
            <MultiSelectFilter
              label="Countries"
              options={countriesList}
              selected={countryFilters}
              onChange={setCountryFilters}
            />
            <MultiSelectFilter
              label="Services"
              options={servicesList}
              selected={serviceFilters}
              onChange={setServiceFilters}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div key={project.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/portfolio/${project.id}`} className="block group">
                  <div className="rounded-2xl overflow-hidden surface-glass hover-lift">
                    <div className="h-48 overflow-hidden">
                      <img src={projectImages[project.id]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{project.client}</p>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{project.industry}</span>
                        <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{project.service}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-alt text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Want results like these?</h2>
          <p className="text-muted-foreground mb-8">Let's discuss how we can help your business grow.</p>
          <Link href="/contact"><Button size="lg">Start Your Project <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
