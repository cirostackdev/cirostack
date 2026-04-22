"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Heart, Zap, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
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
  const project = projects[id || ""];

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
        title={`${project.title} - Case Study`}
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
                <div className="surface-glass rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">About the Client</h2>
                  <p className="text-muted-foreground leading-relaxed">{project.aboutClient}</p>
                </div>
              </motion.div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface-glass rounded-2xl p-6 md:p-8 border-l-4 border-l-destructive/50">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">The Challenge</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{project.challenge}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="surface-glass rounded-2xl p-6 md:p-8 border-l-4 border-l-primary/50">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">The Solution</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{project.solution}</p>
                </motion.div>
              </div>

              {/* Key Features */}
              <div>
                <SectionHeading badge="Features" title="Key Features" center={false} />
                <CaseStudyFeatures features={project.keyFeatures} />
              </div>

              {/* Results */}
              <div>
                <SectionHeading badge="Impact" title="The Results" center={false} />
                <p className="text-muted-foreground leading-relaxed mb-8 -mt-8">{project.result}</p>
                <CaseStudyMetrics metrics={project.metrics} />
              </div>

              {/* Process */}
              <div>
                <SectionHeading badge="Process" title="Our Process" center={false} />
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

              {/* What client loved & challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface-glass rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <Heart className="w-5 h-5 text-foreground" />
                    <h3 className="font-display font-semibold text-foreground text-lg">What the Client Loved</h3>
                  </div>
                  <ul className="space-y-3">
                    {project.whatClientLoved.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="surface-glass rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <Zap className="w-5 h-5 text-accent" />
                    <h3 className="font-display font-semibold text-foreground text-lg">Challenges We Overcame</h3>
                  </div>
                  <ul className="space-y-3">
                    {project.challengesOvercome.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
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
