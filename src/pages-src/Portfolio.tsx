"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { projects as staticProjects, projectImages } from "@/data/caseStudies";
import { servicesData } from "@/data/services";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

// Derive filter options from actual data (static fallback)
const staticAllProjects = Object.entries(staticProjects).map(([id, p]) => ({ id, ...p }));

// Ordered to match the By Vertical startup menu
const categoriesList = [
  "All categories",
  "AI Startups",
  "Fintech Startups",
  "Healthtech Startups",
  "Edtech Startups",
  "Proptech Startups",
  "Legaltech Startups",
  "Logistics & Supply Chain",
  "E-commerce & Retail",
  "B2B SaaS",
  "Consumer Apps",
];

// Ordered to match the Services menu (Ideate → Build → Improve → Operate → Scale)
const servicesList = [
  "All services",
  // Ideate
  "Startup Branding",
  "UX & UI Design Services",
  "Cloud Consulting & Services",
  // Build
  "Website Development",
  "Frontend Development",
  "Backend Development",
  "Mobile Apps Development Services",
  // Improve
  "Generative AI Development Services",
  "AI & ML Development Services",
  // Operate
  "DevOps Consulting Services",
  "Software Auditing Services",
  "CTO as a Service",
  // Scale
  "Dedicated Development Teams",
  "US Nearshore Software Development",
  "Software Development Outsourcing",
];

interface PortfolioProps {
  serverProjects?: any[] | null;
}

const Portfolio = ({ serverProjects }: PortfolioProps = {}) => {
  // Prefer DB projects if available, fall back to static data
  const allProjects = useMemo(() => {
    if (serverProjects && serverProjects.length > 0) {
      return serverProjects.map((p: any) => ({
        id: p.slug,
        title: p.title,
        client: p.client,
        vertical: p.vertical,
        category: p.category,
        service: p.service,
        description: p.description,
        imageUrl: p.imageUrl,
      }));
    }
    return staticAllProjects;
  }, [serverProjects]);
  const searchParams = useSearchParams();
  const prefilterService = searchParams.get("service");

  const [indFilters, setIndFilters] = useState<string[]>([]); // category filter
  const [serviceFilters, setServiceFilters] = useState<string[]>(
    prefilterService ? [prefilterService] : []
  );

  const filtered = allProjects.filter((p) => {
    const indMatch = indFilters.length === 0 || indFilters.includes("All categories") || indFilters.includes(p.vertical);
const svcMatch = serviceFilters.length === 0 || serviceFilters.includes("All services") ||
      serviceFilters.some(f => p.service.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(p.service.toLowerCase()));
    return indMatch && svcMatch;
  });

  return (
    <Layout>
      <SEO
        title="Our Portfolio and Case Studies"
        description="Explore case studies and successful software projects delivered by CiroStack for startups and established businesses."
        url="/portfolio"
      />
      <section className="section-padding pt-32">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filter Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <MultiSelectFilter
              label="Category"
              options={categoriesList}
              selected={indFilters}
              onChange={setIndFilters}
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
                    <div className="h-48 overflow-hidden relative">
                      <Image src={project.imageUrl || projectImages[project.id] || "/placeholder.svg"} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{project.client}</p>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{project.vertical}</span>
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
          <Link href="/start"><Button size="lg">Start Your Project <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
