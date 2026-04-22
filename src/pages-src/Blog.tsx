"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import heroBlog from "@/assets/hero-blog.jpg";
import imgFixedPrice from "@/assets/blog-fixed-price.jpg";
import imgAiAutomation from "@/assets/blog-ai-automation.jpg";
import imgReactNextjs from "@/assets/blog-react-nextjs.jpg";
import imgDesignTrends from "@/assets/blog-design-trends.jpg";
import imgMvpLaunch from "@/assets/blog-mvp-launch.jpg";
import imgLangchain from "@/assets/blog-langchain.jpg";
import imgCloudMigration from "@/assets/blog-cloud-migration.jpg";
import imgHealthcareTech from "@/assets/blog-healthcare-tech.jpg";
import imgCicdPipeline from "@/assets/blog-cicd-pipeline.jpg";
import imgFintechSecurity from "@/assets/blog-fintech-security.jpg";
import imgDesignSystem from "@/assets/blog-design-system.jpg";
import imgEcommerceHeadless from "@/assets/blog-ecommerce-headless.jpg";
import imgMlProduction from "@/assets/blog-ml-production.jpg";
import imgOutsourcingGuide from "@/assets/blog-outsourcing-guide.jpg";
import imgDataPipeline from "@/assets/blog-data-pipeline.jpg";
import imgScalingStartup from "@/assets/blog-scaling-startup.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const categoryOptions = [
  "All Categories",
  "Custom Software",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Product & UX",
  "Industry Insights",
  "Startup Playbook",
];

const allTags = [
  "React", "Next.js", "Node.js", "Python", "OpenAI", "LangChain",
  "AWS", "Azure", "Kubernetes", "CI/CD",
  "MVP", "SaaS", "Fixed-Price", "Outsourcing",
  "Healthcare", "Fintech", "E-Commerce", "Enterprise",
  "Data Engineering", "Security", "UX Design",
];

type SortOption = "newest" | "oldest" | "shortest" | "longest";
const sortLabels: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  shortest: "Shortest Read",
  longest: "Longest Read",
};

const posts = [
  { id: "why-fixed-price", title: "Why Fixed-Price Development Beats Hourly Billing", excerpt: "Predictable budgets, aligned incentives, and faster delivery — how our fixed-price model gives clients confidence from day one.", category: "Startup Playbook", author: "CiroStack Team", date: "Feb 15, 2026", dateSort: new Date("2026-02-15"), readTime: "5 min read", readMin: 5, image: imgFixedPrice, featured: true, tags: ["Fixed-Price", "SaaS", "Outsourcing"] },
  { id: "ai-automation-guide", title: "How We Use OpenAI & LangChain to Automate Enterprise Workflows", excerpt: "Real client use cases where generative AI replaced 20+ hours of weekly manual work across support, data entry, and reporting.", category: "AI & Machine Learning", author: "CiroStack Team", date: "Feb 10, 2026", dateSort: new Date("2026-02-10"), readTime: "7 min read", readMin: 7, image: imgAiAutomation, featured: true, tags: ["OpenAI", "LangChain", "Python", "Enterprise"] },
  { id: "react-vs-nextjs", title: "React vs Next.js: A Decision Framework from 50+ Client Projects", excerpt: "When to choose a SPA vs SSR — with guidance on performance, SEO, and time-to-market trade-offs for custom applications.", category: "Custom Software", author: "CiroStack Team", date: "Feb 5, 2026", dateSort: new Date("2026-02-05"), readTime: "6 min read", readMin: 6, image: imgReactNextjs, tags: ["React", "Next.js", "Node.js"] },
  { id: "web-design-trends", title: "UX Patterns That Drive Retention in SaaS Products", excerpt: "Design principles and interface patterns we apply at CiroStack to help SaaS clients reduce churn and boost user activation.", category: "Product & UX", author: "CiroStack Team", date: "Jan 28, 2026", dateSort: new Date("2026-01-28"), readTime: "4 min read", readMin: 4, image: imgDesignTrends, tags: ["UX Design", "SaaS", "React"] },
  { id: "mvp-launch-checklist", title: "The MVP Launch Checklist: From Architecture to Analytics", excerpt: "Everything founders need before going live — tech stack, cloud infrastructure, CI/CD, monitoring, and launch-day ops.", category: "Startup Playbook", author: "CiroStack Team", date: "Jan 20, 2026", dateSort: new Date("2026-01-20"), readTime: "8 min read", readMin: 8, image: imgMvpLaunch, tags: ["MVP", "AWS", "CI/CD", "Kubernetes"] },
  { id: "langchain-tutorial", title: "Building a Production AI Chatbot with LangChain & Node.js", excerpt: "A technical deep-dive into building conversational AI that integrates with healthcare, fintech, and e-commerce platforms.", category: "AI & Machine Learning", author: "CiroStack Team", date: "Jan 15, 2026", dateSort: new Date("2026-01-15"), readTime: "10 min read", readMin: 10, image: imgLangchain, tags: ["LangChain", "Node.js", "OpenAI", "Healthcare"] },

  // New posts
  { id: "cloud-migration-kubernetes", title: "Migrating to Kubernetes on AWS: A Step-by-Step Playbook", excerpt: "How we help enterprises containerize monolithic applications and deploy them on managed Kubernetes clusters with zero downtime.", category: "Cloud & DevOps", author: "CiroStack Team", date: "Mar 5, 2026", dateSort: new Date("2026-03-05"), readTime: "9 min read", readMin: 9, image: imgCloudMigration, featured: true, tags: ["AWS", "Kubernetes", "CI/CD", "Enterprise"] },
  { id: "healthcare-digital-transformation", title: "Digital Transformation in Healthcare: Building HIPAA-Compliant Platforms", excerpt: "Lessons from building telehealth portals, EMR integrations, and patient-facing apps that pass rigorous compliance audits.", category: "Industry Insights", author: "CiroStack Team", date: "Mar 3, 2026", dateSort: new Date("2026-03-03"), readTime: "8 min read", readMin: 8, image: imgHealthcareTech, featured: true, tags: ["Healthcare", "Security", "Node.js"] },
  { id: "cicd-devops-best-practices", title: "CI/CD Pipelines That Actually Work: Our DevOps Toolkit", excerpt: "The exact tools, workflows, and automation patterns our DevOps team uses to ship client projects with confidence every sprint.", category: "Cloud & DevOps", author: "CiroStack Team", date: "Feb 28, 2026", dateSort: new Date("2026-02-28"), readTime: "7 min read", readMin: 7, image: imgCicdPipeline, tags: ["CI/CD", "AWS", "Kubernetes"] },
  { id: "fintech-security-architecture", title: "Security-First Architecture for Fintech Applications", excerpt: "How we design banking-grade security into fintech platforms — from encryption at rest to real-time fraud detection with ML.", category: "Industry Insights", author: "CiroStack Team", date: "Feb 25, 2026", dateSort: new Date("2026-02-25"), readTime: "11 min read", readMin: 11, image: imgFintechSecurity, tags: ["Fintech", "Security", "Python", "Enterprise"] },
  { id: "design-system-scale", title: "Building a Design System That Scales Across Products", excerpt: "How we create reusable component libraries and design tokens that maintain consistency across multi-product SaaS portfolios.", category: "Product & UX", author: "CiroStack Team", date: "Feb 22, 2026", dateSort: new Date("2026-02-22"), readTime: "6 min read", readMin: 6, image: imgDesignSystem, tags: ["UX Design", "React", "SaaS"] },
  { id: "headless-ecommerce-architecture", title: "Headless Commerce: Why Top Retailers Are Decoupling Their Frontends", excerpt: "The architectural shift powering the fastest e-commerce experiences — and how CiroStack implements it with React and Node.js.", category: "Industry Insights", author: "CiroStack Team", date: "Feb 18, 2026", dateSort: new Date("2026-02-18"), readTime: "7 min read", readMin: 7, image: imgEcommerceHeadless, tags: ["E-Commerce", "React", "Next.js", "Node.js"] },
  { id: "ml-models-production", title: "From Jupyter Notebook to Production: Deploying ML Models That Last", excerpt: "The gap between a working prototype and a production ML system is vast. Here's how our data engineering team bridges it.", category: "AI & Machine Learning", author: "CiroStack Team", date: "Feb 12, 2026", dateSort: new Date("2026-02-12"), readTime: "9 min read", readMin: 9, image: imgMlProduction, tags: ["Python", "Data Engineering", "AWS", "Enterprise"] },
  { id: "outsourcing-vs-inhouse", title: "Outsourcing vs In-House Development: An Honest Comparison", excerpt: "When does outsourcing make sense? A transparent breakdown of cost, quality, speed, and control from both sides of the table.", category: "Startup Playbook", author: "CiroStack Team", date: "Feb 8, 2026", dateSort: new Date("2026-02-08"), readTime: "6 min read", readMin: 6, image: imgOutsourcingGuide, tags: ["Outsourcing", "Fixed-Price", "Enterprise"] },
  { id: "real-time-data-pipelines", title: "Building Real-Time Data Pipelines with Python and AWS", excerpt: "How we architect event-driven data systems that process millions of records daily for analytics, ML, and business intelligence.", category: "Custom Software", author: "CiroStack Team", date: "Jan 25, 2026", dateSort: new Date("2026-01-25"), readTime: "8 min read", readMin: 8, image: imgDataPipeline, tags: ["Data Engineering", "Python", "AWS"] },
  { id: "scaling-saas-post-funding", title: "Scaling Your SaaS After Series A: Technical Decisions That Matter", excerpt: "The infrastructure, team, and architecture choices that separate startups that scale from those that stall after funding.", category: "Startup Playbook", author: "CiroStack Team", date: "Jan 18, 2026", dateSort: new Date("2026-01-18"), readTime: "7 min read", readMin: 7, image: imgScalingStartup, tags: ["SaaS", "MVP", "AWS", "Kubernetes"] },
];

const Blog = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryOptions);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0 && selectedCategories.length < categoryOptions.length) count++;
    if (selectedTags.length > 0) count++;
    if (search) count++;
    return count;
  }, [selectedCategories, selectedTags, search]);

  const filtered = useMemo(() => {
    const isAllCategories = selectedCategories.length === 0 || selectedCategories.includes("All Categories");
    return posts
      .filter((p) => isAllCategories || selectedCategories.includes(p.category))
      .filter((p) => selectedTags.length === 0 || selectedTags.some((t) => p.tags.includes(t)))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        switch (sort) {
          case "oldest": return a.dateSort.getTime() - b.dateSort.getTime();
          case "shortest": return a.readMin - b.readMin;
          case "longest": return b.readMin - a.readMin;
          default: return b.dateSort.getTime() - a.dateSort.getTime();
        }
      });
  }, [selectedCategories, selectedTags, search, sort]);

  const handleClearAll = () => {
    setSelectedCategories(categoryOptions);
    setSelectedTags([]);
    setSearch("");
    setSort("newest");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Layout>
      <SEO
        title="Software Development & AI Blog"
        description="Read the latest insights on software engineering, AI automation, and product design from the CiroStack team."
        url="/blog"
      />
      <PageHero
        icon={BookOpen}
        title="Blog"
        description="Tips, guides, and insights from the CiroStack team to help you build better products."
        image={heroBlog}
        ctaText="Contact Us"
        ctaLink="/contact"
      />

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filter Bar */}
          <div className="rounded-2xl surface-glass p-4 md:p-6 mb-10 space-y-4">
            {/* Row 1: Search + Dropdowns + Sort */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title or content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <MultiSelectFilter
                label="Categories"
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
              <Popover open={sortOpen} onOpenChange={setSortOpen}>
                <PopoverTrigger asChild>
                  <button className="flex h-11 w-full md:w-48 items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <span className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                      <span className="font-medium">{sortLabels[sort]}</span>
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1 rounded-xl shadow-lg border border-border" align="start">
                  {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sort === key ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted/50"}`}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Row 2: Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {posts.length} posts
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={`/blog/${post.id}`} className="block group">
                  <div className="rounded-2xl surface-glass hover-lift overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">{post.category}</span>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-2 mt-3 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts found. Try a different search or category.</p>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="section-padding section-alt text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Stay in the loop</h2>
          <p className="text-muted-foreground mb-6">Get the latest insights delivered to your inbox.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input placeholder="your@email.com" type="email" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
