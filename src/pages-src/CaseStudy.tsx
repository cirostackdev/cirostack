"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { projects, projectImages } from "@/data/caseStudies";
import imgHealthflow from "@/assets/portfolio-healthflow.jpg";

import CaseStudyHeroImage from "@/components/case-study/CaseStudyHeroImage";
import CaseStudyMetrics from "@/components/case-study/CaseStudyMetrics";
import CaseStudyFeatures from "@/components/case-study/CaseStudyFeatures";
import CaseStudyProcess from "@/components/case-study/CaseStudyProcess";
import CaseStudyTestimonial from "@/components/case-study/CaseStudyTestimonial";
import CaseStudySidebar from "@/components/case-study/CaseStudySidebar";

export { projects, projectImages };

const CaseStudy = () => {
  const { id } = useParams();
  const staticProject = projects[id || ""];
  const [dbProject, setDbProject] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/cms/portfolio/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data) setDbProject(data); })
        .catch(() => {});
    }
  }, [id]);

  // Merge: prefer DB data, fallback to static
  const project = dbProject
    ? {
        ...staticProject,
        title: dbProject.title,
        client: dbProject.client,
        vertical: dbProject.vertical,
        category: dbProject.category,
        service: dbProject.service,
        country: dbProject.country,
        location: dbProject.location,
        size: dbProject.size,
        duration: dbProject.duration,
        year: dbProject.year,
        description: dbProject.description,
        aboutClient: dbProject.aboutClient || staticProject?.aboutClient,
        challenge: dbProject.challenge || staticProject?.challenge,
        solution: dbProject.solution || staticProject?.solution,
        result: dbProject.result || staticProject?.result,
        keyFeatures: dbProject.keyFeatures || staticProject?.keyFeatures || [],
        metrics: dbProject.metrics || staticProject?.metrics || [],
        technologies: dbProject.technologies || staticProject?.technologies || [],
        process: dbProject.process || staticProject?.process || [],
        whatClientLoved: dbProject.whatClientLoved || staticProject?.whatClientLoved || [],
        challengesOvercome: dbProject.challengesOvercome || staticProject?.challengesOvercome || [],
        testimonial: dbProject.testimonial || staticProject?.testimonial,
        relatedProjects: dbProject.relatedProjects || staticProject?.relatedProjects || [],
      }
    : staticProject;

  if (!project) {
    return (
      <Layout>
        <SEO title="Case Study Not Found" description="The case study you are looking for does not exist." />
        <PageHero
          icon={Briefcase}
          title="Project Not Found"
          description="The case study you're looking for doesn't exist."
          image={projectImages[id || ""] || imgHealthflow}
          ctaText="Back to Portfolio"
          ctaLink="/portfolio"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${project.title}: Case Study`}
        description={project.description}
        url={`/portfolio/${id}`}
      />
      <PageHero
        icon={Briefcase}
        title={project.title}
        description={project.description}
        image={projectImages[id || ""] || imgHealthflow}
        ctaText="Contact Us"
        ctaLink="/contact"
      />

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back link */}
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-16">

              {/* Hero image */}
              <CaseStudyHeroImage image={projectImages[id || ""] || imgHealthflow} title={project.title} />

              {/* About client */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">About the Client</h2>
                <p className="text-muted-foreground leading-relaxed">{project.aboutClient}</p>
              </motion.div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2 border-t border-border">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">The Challenge</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{project.challenge}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">The Solution</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{project.solution}</p>
                </motion.div>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-6">Key Features</h2>
                <CaseStudyFeatures features={project.keyFeatures} />
              </div>

              {/* Results */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">The Results</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{project.result}</p>
                <CaseStudyMetrics metrics={project.metrics} />
              </div>

              {/* Process */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-2">Our Process</h2>
                <CaseStudyProcess steps={project.process} />
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <CaseStudyTestimonial
                  quote={project.testimonial.quote}
                  author={project.testimonial.author}
                  role={project.testimonial.role}
                />
              )}

              {/* What client loved & challenges overcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2 border-t border-border">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-5">What the Client Loved</h3>
                  <ul className="space-y-3">
                    {project.whatClientLoved.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--trust))] mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-5">Challenges We Overcame</h3>
                  <ul className="space-y-3">
                    {project.challengesOvercome.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

            </div>

            {/* Sidebar */}
            <CaseStudySidebar project={project} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudy;
