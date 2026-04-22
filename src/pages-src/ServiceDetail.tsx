"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";

// Import new service data and components
import { servicesData } from "@/data/services";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { OurService } from "@/components/services/OurService";
import { BookConsultation } from "@/components/services/BookConsultation";
import { ValueProps } from "@/components/services/ValueProps";
import { WhoWeHelped } from "@/components/services/WhoWeHelped";
import { ClientReviews } from "@/components/services/ClientReviews";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { IndustryExpertise } from "@/components/services/IndustryExpertise";
import { ReasonsToChoose } from "@/components/services/ReasonsToChoose";
import { Technologies } from "@/components/services/Technologies";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";

// Import external data for cross-linking
import { projects, projectImages } from "@/pages-src/CaseStudy";
import { posts, postImages } from "@/pages-src/BlogPost";

// Unique hero images per service
import imgWebsites from "@/assets/svc-websites.jpg";
import imgApps from "@/assets/svc-apps.jpg";
import imgAi from "@/assets/svc-ai.jpg";
import imgUxUi from "@/assets/svc-ux-ui.jpg";
import imgCloudConsulting from "@/assets/svc-cloud-consulting.jpg";
import imgCloudEng from "@/assets/svc-cloud-engineering.jpg";
import imgEmbedded from "@/assets/svc-embedded.jpg";
import imgDedicatedTeams from "@/assets/svc-dedicated-teams.jpg";
import imgDigitalTransformation from "@/assets/svc-digital-transformation.jpg";
import imgAiMl from "@/assets/svc-ai-ml.jpg";
import imgDataEngineering from "@/assets/svc-data-engineering.jpg";
import imgIam from "@/assets/svc-iam.jpg";
import imgAutomationTesting from "@/assets/svc-automation-testing.jpg";
import imgDevops from "@/assets/svc-devops.jpg";
import imgSoftwareAuditing from "@/assets/svc-software-auditing.jpg";
import imgSecurityAudit from "@/assets/svc-security-audit.jpg";
import imgNearshore from "@/assets/svc-nearshore.jpg";
import imgOutsourcing from "@/assets/svc-outsourcing.jpg";
import imgStartups from "@/assets/svc-startups.jpg";

const heroImages: Record<string, string> = {
  "websites": imgWebsites,
  "apps": imgApps,
  "ai": imgAi,
  "ux-ui-design": imgUxUi,
  "cloud-consulting": imgCloudConsulting,
  "cloud-engineering": imgCloudEng,
  "embedded-software": imgEmbedded,
  "dedicated-teams": imgDedicatedTeams,
  "digital-transformation": imgDigitalTransformation,
  "ai-ml": imgAiMl,
  "data-engineering": imgDataEngineering,
  "iam": imgIam,
  "automation-testing": imgAutomationTesting,
  "devops": imgDevops,
  "software-auditing": imgSoftwareAuditing,
  "security-audit": imgSecurityAudit,
  "nearshore": imgNearshore,
  "outsourcing": imgOutsourcing,
  "startups": imgStartups,
};

export default function ServiceDetail() {
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean).pop() ?? "";

  if (!id || !servicesData[id]) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold mb-4">Service not found</h1>
          <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button>Return to Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const service = servicesData[id];
  const heroImage = heroImages[id] || imgAi;

  // Filter case studies relevant to this service (match by service title)
  const relevantProjects = Object.entries(projects).filter(
    ([, p]) => p.service.toLowerCase() === service.title.toLowerCase()
  );
  // Filter 2 recent insights
  const relevantPosts = Object.entries(posts).slice(0, 2);

  // Filter 3 related services (exclude current)
  const relatedServices = Object.values(servicesData)
    .filter(s => s.id !== id)
    .slice(0, 3);

  return (
    <Layout>
      <SEO
        title={`${service.title} | CiroStack Consulting`}
        description={service.description}
      />

      {/* 1. Page Hero */}
      <PageHero
        title={service.title}
        description={service.tagline}
        image={heroImage}
      />

      {/* 2. Intro Section */}
      <ServiceIntro title={service.title} summary={service.introSummary} />

      {/* 3. Our Service Section */}
      <OurService service={service} />

      {/* 4. Book Consultation (CTA 1) */}
      <BookConsultation bookingType={service.bookingType} />

      {/* 5. Value Props Section */}
      <ValueProps service={service} />

      {/* 6. Who We Helped */}
      <WhoWeHelped service={service} />

      {/* 7. Case Study Section */}
      {relevantProjects.length > 0 && (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Proven Results</h2>
              <p className="text-muted-foreground text-lg">See how we've applied {service.title} in the real world.</p>
            </div>
            <Link href="/portfolio" className="hidden md:flex items-center text-primary font-bold hover:underline">
              View all case studies <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {relevantProjects.slice(0, 4).map(([slug, project], idx) => (
              <Link href={`/portfolio/${slug}`} key={idx} className="group block">
                <div className="overflow-hidden rounded-2xl mb-4 aspect-[16/9] border border-border/50">
                  <img src={projectImages[slug]} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex gap-3 text-sm font-bold text-primary mb-2">
                  <span>{project.industry}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{project.category}</span>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
              </Link>
            ))}
          </div>
          {relevantProjects.length > 4 && (
            <div className="mt-12 text-center">
              <Link href={`/portfolio?service=${encodeURIComponent(service.title)}`}>
                <Button variant="outline" size="lg">
                  View All {relevantProjects.length} Case Studies <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      )}

      {/* 8. Client Reviews */}
      <ClientReviews serviceId={id} />

      {/* 9. Service Process */}
      <ServiceProcess service={service} />

      {/* 10. Industry Expertise */}
      <IndustryExpertise service={service} />

      {/* 11. Reasons To Choose Us */}
      <ReasonsToChoose service={service} />

      {/* 12. Technologies */}
      <Technologies service={service} />

      {/* 13. Insights Section */}
      <section className="py-24 bg-card border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{service.title} Insights</h2>
              <p className="text-muted-foreground text-lg">Latest thoughts from our engineering leadership.</p>
            </div>
            <Link href="/resources" className="hidden md:flex items-center text-primary font-bold hover:underline">
              View all articles <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {relevantPosts.map(([slug, post], idx) => (
              <Link href={`/blog/${slug}`} key={idx} className="group block bg-background rounded-3xl p-6 border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                <div className="text-xs font-bold tracking-widest uppercase text-primary mb-4">{post.category}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{post.content[0].type === "paragraph" ? post.content[0].text : ""}</p>
                <div className="flex items-center justify-between text-sm font-medium border-t border-border pt-4">
                  <span>{post.author}</span>
                  <span className="text-muted-foreground">{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Book Consultation (CTA 2) */}
      <BookConsultation bookingType={service.bookingType} />

      {/* 15. FAQ Section */}
      <ServiceFAQ service={service} />

      {/* 16. Related Services */}
      <section className="py-24 bg-secondary/20 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-3xl font-display font-bold mb-10 text-center">Continue Exploring</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((rs, idx) => (
              <Link href={`/services/${rs.id}`} key={idx} className="group block bg-background p-6 rounded-2xl border border-border hover:border-primary transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <rs.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{rs.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{rs.tagline}</p>
                <div className="mt-6 flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
}
