"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { posts as staticPosts, BlogPost as BlogPostType } from "@/data/blog";
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
  "Founder Playbook",
  "MVP & Launch",
  "Funding & Tech",
  "African Startups",
];

const allTags = [
  // Startup journey
  "MVP", "Pre-Seed", "Seed Stage", "Series A", "Scaling",
  // Startup types (By Vertical)
  "Fintech", "Healthtech", "Edtech", "Proptech", "Legaltech",
  "AI Startups", "B2B SaaS", "E-Commerce", "Consumer Apps", "Logistics Tech",
  // Services
  "Fixed-Price", "Outsourcing", "Dedicated Teams", "CTO as a Service",
  // Product
  "AI & ML", "Mobile App", "Web App", "UX Design",
  // Founder
  "Non-Technical Founder", "Solo Founder", "First-Time Founder",
];

type SortOption = "newest" | "oldest" | "shortest" | "longest";
const sortLabels: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  shortest: "Shortest Read",
  longest: "Longest Read",
};


interface BlogProps {
  serverPosts?: any[] | null;
}

const Blog = ({ serverPosts }: BlogProps = {}) => {
  // Prefer DB posts if available, fall back to static data
  const posts: BlogPostType[] = useMemo(() => {
    if (serverPosts && serverPosts.length > 0) {
      return serverPosts.map((p: any) => ({
        id: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        author: p.author,
        date: p.date,
        dateSort: new Date(p.dateSort),
        readTime: `${p.readMin} min read`,
        readMin: p.readMin,
        image: p.imageUrl || "/placeholder.svg",
        featured: p.featured,
        tags: p.tags || [],
      }));
    }
    return staticPosts;
  }, [serverPosts]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryOptions);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [stripEmail, setStripEmail] = useState("");
  const [stripDone, setStripDone] = useState(false);

  const handleStripSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripEmail) return;
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: stripEmail }),
      });
    } finally {
      setStripDone(true);
    }
  };

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
                    <div className="h-40 overflow-hidden relative">
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
          {stripDone ? (
            <p className="text-sm text-primary font-medium">You're subscribed! Check your inbox for a welcome email.</p>
          ) : (
            <form onSubmit={handleStripSubscribe} className="flex gap-3 max-w-md mx-auto">
              <Input placeholder="your@email.com" type="email" required value={stripEmail} onChange={e => setStripEmail(e.target.value)} />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
