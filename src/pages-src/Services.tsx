"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Globe, Smartphone, Bot, ArrowRight, CheckCircle, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import heroServices from "@/assets/hero-services.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const servicesList = [
  {
    icon: Globe,
    title: "Websites",
    slug: "websites",
    tagline: "Beautiful, fast websites that drive results.",
    description: "We design and build responsive websites that look incredible on every device. Whether you need a landing page, business site, or e-commerce store — we deliver pixel-perfect quality.",
    deliverables: ["Up to 10 custom pages", "Responsive design", "SEO optimization", "CMS integration", "Analytics setup", "Performance optimization"],
    startingAt: "$3,000",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile Apps",
    slug: "apps",
    tagline: "Custom applications that scale with your vision.",
    description: "From MVPs to enterprise platforms, we build robust web and mobile applications with modern tech stacks. Real-time features, offline support, and seamless user experiences.",
    deliverables: ["Custom UI/UX design", "Cross-platform support", "API development", "Database architecture", "User authentication", "Push notifications"],
    startingAt: "$8,000",
  },
  {
    icon: Bot,
    title: "AI Automation",
    slug: "ai",
    tagline: "Intelligent tools that work while you sleep.",
    description: "We build AI-powered solutions that automate repetitive tasks, analyze data, and create new capabilities for your business. Chatbots, document processing, and custom AI integrations.",
    deliverables: ["AI chatbots", "Document analysis", "Workflow automation", "Data extraction", "Custom AI models", "API integrations"],
    startingAt: "$5,000",
  },
];

const Services = () => {
  return (
    <Layout>
      <SEO
        title="Software Development Services"
        description="Explore CiroStack's fixed-price software development packages including websites, mobile apps, and AI automation."
        url="/services"
      />
      <PageHero
        icon={Layers}
        title="Our Services"
        description="Fixed-price packages with transparent scope. No hourly billing, no surprises. Everything you need to launch and grow."
        image={heroServices}
        ctaText="Get a Free Quote"
        ctaLink="/contact"
      />

      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-16 md:space-y-24">
            {servicesList.map((service, i) => (
              <motion.div
                key={service.slug}
                id={service.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground font-medium mb-4">{service.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <Link href="/contact">
                    <Button className="mt-2">
                      Discuss Your Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className={`rounded-2xl surface-glass p-8 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <h4 className="font-display font-semibold text-foreground mb-4">What's included</h4>
                  <div className="space-y-3">
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Not sure which service you need?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Book a free consultation and we'll help you figure out the best path forward.</p>
          <Link href="/contact">
            <Button size="lg">Get a Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
