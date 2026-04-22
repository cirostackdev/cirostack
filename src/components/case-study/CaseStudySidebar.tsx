"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectEntry } from "@/data/caseStudies";
import { projectImages } from "@/data/caseStudies";

interface SidebarProps {
  project: ProjectEntry;
}

const CaseStudySidebar = ({ project }: SidebarProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-6"
  >
    {/* Technology Stack */}
    <div className="surface-glass rounded-2xl p-6">
      <h3 className="font-display font-semibold text-foreground mb-5 text-lg">Technology Stack</h3>
      <div className="space-y-5">
        {project.technologies.map((tech) => (
          <div key={tech.area}>
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">{tech.area}</p>
            <div className="flex flex-wrap gap-2">
              {tech.tools.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-foreground font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Project Info */}
    <div className="surface-glass rounded-2xl p-6">
      <h3 className="font-display font-semibold text-foreground mb-4 text-lg">Project Details</h3>
      <div className="space-y-3">
        {[
          { label: "Client", value: project.client },
          { label: "Industry", value: project.industry },
          { label: "Location", value: project.location },
          { label: "Company Size", value: project.size },
          { label: "Duration", value: project.duration },
          { label: "Year", value: project.year },
          { label: "Service", value: project.service },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-foreground font-medium text-right max-w-[55%]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Related Projects */}
    <div className="surface-glass rounded-2xl p-6">
      <h3 className="font-display font-semibold text-foreground mb-4 text-lg">Related Projects</h3>
      <div className="space-y-3">
        {project.relatedProjects.map((rp) => (
          <Link
            key={rp.id}
            href={`/portfolio/${rp.id}`}
            className="group block rounded-xl overflow-hidden bg-secondary/50 hover:bg-secondary transition-colors"
          >
            {projectImages[rp.id] && (
              <div className="h-24 overflow-hidden">
                <img
                  src={projectImages[rp.id]}
                  alt={rp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{rp.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{rp.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="surface-glass rounded-2xl p-6 glow-border">
      <h3 className="font-display font-semibold text-foreground mb-3 text-lg">Want results like these?</h3>
      <p className="text-sm text-muted-foreground mb-5">Let's discuss your project and build something great together.</p>
      <Link href="/contact">
        <Button className="w-full">Start Your Project <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </Link>
    </div>

    {/* Pricing */}
    <div className="surface-glass rounded-2xl p-6 text-center">
      <p className="text-sm text-muted-foreground mb-3">Explore our transparent pricing</p>
      <Link href="/pricing">
        <Button variant="outline" className="w-full">View Packages</Button>
      </Link>
    </div>
  </motion.div>
);

export default CaseStudySidebar;
