"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { startupsData } from "@/data/startups-generated";

const VALID_STARTUP_SLUGS = new Set([
  // By Vertical
  "fintech", "healthtech", "edtech", "proptech", "legaltech",
  "ai-startup", "logistics-tech", "ecommerce", "b2b-saas", "consumer-apps",
  // By Product Type
  "web-app", "mobile-app", "ai-product", "saas-platform", "marketplace", "api-product",
  // By Founder Type
  "non-technical-founder", "first-time-founder", "solo-founder", "repeat-founder",
  "student-startup", "corporate-innovator", "female-led", "african-startup",
  "diaspora-founder", "social-enterprise",
  // By Challenge
  "fast-mvp", "scaling-tech", "agency-rescue", "fundraising-ready",
  "ai-integration", "tech-debt", "post-pivot", "no-tech-team", "africa-launch",
  // By Stage
  "pre-idea", "validation", "mvp", "early-traction", "seed-stage", "growth", "scale-up",
]);

interface StartupApplicationsProps {
  serviceSlug: string;
  serviceTitle: string;
}

export function StartupApplications({ serviceSlug, serviceTitle }: StartupApplicationsProps) {
  const applications = useMemo(() => {
    const results: { startupTitle: string; startupSlug: string; serviceName: string; applicationDetail: string; parentCategory: string }[] = [];

    for (const startup of Object.values(startupsData)) {
      if (!VALID_STARTUP_SLUGS.has(startup.id)) continue;
      const match = startup.serviceApplications.find(sa => sa.slug === serviceSlug);
      if (match) {
        results.push({
          startupTitle: startup.title,
          startupSlug: startup.id,
          serviceName: match.serviceName,
          applicationDetail: match.applicationDetail,
          parentCategory: startup.parentCategory,
        });
      }
    }

    const priority = ["By Vertical", "By Product Type", "By Challenge", "By Stage", "By Founder Type", "By Engagement"];
    results.sort((a, b) => priority.indexOf(a.parentCategory) - priority.indexOf(b.parentCategory));
    return results;
  }, [serviceSlug]);

  if (applications.length === 0) return null;

  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
            For Startups
          </h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            How we apply {serviceTitle} to your startup
          </h3>
          <p className="text-muted-foreground text-lg mt-4">
            Every startup vertical has unique requirements. Here is how this service adapts to yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, idx) => (
            <motion.div
              key={app.startupSlug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={`/startups/${app.startupSlug}`}
                className="block h-full p-6 md:p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/40 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {app.parentCategory}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {app.serviceName}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  for {app.startupTitle}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {app.applicationDetail}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
