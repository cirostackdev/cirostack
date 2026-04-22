"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Globe, Smartphone, Bot, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroPricing from "@/assets/hero-pricing.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

interface PackageCardProps {
  name: string;
  price: string;
  bestFor: string;
  timeline: string;
  support: string;
  features: string[];
  popular?: boolean;
  examples?: string[];
}

const PackageCard = ({ name, price, bestFor, timeline, support, features, popular, examples }: PackageCardProps) => (
  <div className={`rounded-2xl p-6 md:p-8 flex flex-col h-full ${popular ? "surface-glass glow-border ring-1 ring-primary/30" : "surface-glass"}`}>
    {popular && (
      <span className="inline-block self-start px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-muted text-muted-foreground border border-border">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-display font-bold text-foreground">{name}</h3>
    <p className="text-3xl font-display font-bold text-primary mt-2">{price}</p>
    <p className="text-sm text-muted-foreground mt-2">{bestFor}</p>
    <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
      <span>⏱ {timeline}</span>
      <span>🛟 {support} support</span>
    </div>
    <div className="border-t border-border mt-6 pt-6 space-y-3 flex-1">
      {features.map((f) => (
        <div key={f} className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-sm text-muted-foreground">{f}</span>
        </div>
      ))}
    </div>
    {examples && examples.length > 0 && (
      <div className="border-t border-border mt-4 pt-4">
        <p className="text-xs font-medium text-foreground mb-2">Examples:</p>
        <ul className="space-y-1">
          {examples.map((e) => (
            <li key={e} className="text-xs text-muted-foreground">• {e}</li>
          ))}
        </ul>
      </div>
    )}
    <Link href="/contact" className="mt-6">
      <Button className="w-full" variant={popular ? "default" : "outline"}>
        Get Started <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  </div>
);

const websitePackages = [
  {
    name: "Starter",
    price: "₦1,200,000",
    bestFor: "Consultants, restaurants, local shops, professionals",
    timeline: "2–3 weeks",
    support: "30 days",
    features: [
      "Up to 5 pages",
      "Professional template design",
      "Mobile-friendly responsive layout",
      "Content management system (CMS)",
      "Contact form",
      "Basic SEO",
      "Google Analytics setup",
      "Social media links",
    ],
  },
  {
    name: "Business",
    price: "₦2,500,000",
    bestFor: "Growing companies, service providers, organizations",
    timeline: "4–5 weeks",
    support: "60 days",
    popular: true,
    features: [
      "Everything in Starter, plus:",
      "Up to 12 pages",
      "Fully custom design (not a template)",
      "Blog integration",
      "Advanced SEO with keyword research",
      "Custom contact forms & interactive elements",
      "2 hours of training",
    ],
  },
  {
    name: "Premium",
    price: "₦5,000,000",
    bestFor: "Established businesses, brands making a major statement",
    timeline: "6–8 weeks",
    support: "90 days",
    features: [
      "Everything in Business, plus:",
      "Up to 25 pages",
      "Premium custom design with unique illustrations",
      "Full custom CMS",
      "Advanced SEO strategy with ongoing recommendations",
      "Custom functionality (member areas, booking, calculators)",
      "3 hours of training",
    ],
  },
  {
    name: "E-commerce",
    price: "₦6,500,000",
    bestFor: "Retailers, wholesalers, anyone selling products online",
    timeline: "6–8 weeks",
    support: "90 days",
    features: [
      "Up to 15 pages including product listings",
      "Online store with up to 50 products",
      "Payment integration (Paystack, Flutterwave, Stripe)",
      "Shopping cart & checkout system",
      "Inventory management",
      "Order notifications & customer emails",
      "Product search & filtering",
      "Mobile-optimized shopping",
      "Advanced SEO for products",
      "3 hours of training",
    ],
  },
];

const appPackages = [
  {
    name: "MVP Web App",
    price: "₦7,500,000",
    bestFor: "Testing a new business idea, launching an MVP",
    timeline: "8–12 weeks",
    support: "30 days",
    features: [
      "Web-based application (any browser)",
      "User registration & login system",
      "Database for user information",
      "Core features to test your idea",
      "Clean, functional design",
      "1–2 integrations (payment, email, etc.)",
      "Admin panel",
      "2 hours of training",
    ],
  },
  {
    name: "Full Web App",
    price: "₦15,000,000",
    bestFor: "Businesses needing a complete software solution",
    timeline: "12–16 weeks",
    support: "60 days",
    popular: true,
    features: [
      "Everything in MVP, plus:",
      "Full feature set for your business",
      "Advanced custom UI design",
      "3–5 integrations with business tools",
      "Comprehensive testing",
      "Reporting & analytics dashboard",
      "Performance optimization",
      "3 hours of training",
    ],
  },
  {
    name: "Mobile App",
    price: "₦18,000,000",
    bestFor: "Businesses needing iPhone & Android apps",
    timeline: "12–16 weeks",
    support: "60 days",
    features: [
      "Works on both iOS & Android",
      "One codebase — faster & lower cost",
      "User registration & login",
      "Push notifications, camera access",
      "Clean, modern mobile design",
      "2–4 integrations",
      "App store submission support",
      "Comprehensive testing on both platforms",
      "3 hours of training",
    ],
  },
  {
    name: "Enterprise App",
    price: "₦30,000,000+",
    bestFor: "Large organizations with complex, scalable needs",
    timeline: "16–24+ weeks",
    support: "90 days + SLA",
    features: [
      "Web + mobile apps working together",
      "Advanced security (encryption, access controls, audit logs)",
      "5+ integrations with existing systems",
      "Scalable architecture",
      "Custom premium design",
      "Security testing included",
      "High performance for large user bases",
      "5 hours of training",
    ],
  },
];

const aiPackages = [
  {
    name: "Quick Win",
    price: "₦2,500,000",
    bestFor: "Testing AI, automating one task, adding a chatbot",
    timeline: "3–4 weeks",
    support: "30 days",
    features: [
      "Simple AI chatbot (website or WhatsApp)",
      "OR automation of one repetitive task",
      "Pre-trained AI model",
      "1 integration with existing tool",
      "Basic setup & configuration",
      "1 hour of training",
    ],
    examples: ["Customer service FAQ chatbot", "Automated lead qualification", "Social media comment responder"],
  },
  {
    name: "Growth",
    price: "₦6,000,000",
    bestFor: "Automating multiple workflows, connecting systems",
    timeline: "6–8 weeks",
    support: "60 days",
    popular: true,
    features: [
      "Multi-step automation workflows",
      "Fine-tuned AI prompts for accuracy",
      "Up to 3 integrations",
      "Performance monitoring dashboard",
      "Data processing & structured outputs",
      "3 hours of training",
    ],
    examples: ["Automated lead nurturing pipeline", "Invoice processing & accounting sync", "Customer support triage system"],
  },
  {
    name: "Enterprise",
    price: "₦12,000,000+",
    bestFor: "Custom AI tools, department-wide automation",
    timeline: "10–16 weeks",
    support: "90 days + SLA",
    features: [
      "Custom AI solution for your business",
      "Custom-trained model or complex pipeline",
      "Unlimited integrations",
      "Full custom user interface",
      "Large-scale data processing",
      "Advanced security & compliance",
      "8 hours of training",
    ],
    examples: ["Business data analysis & insights", "Full department automation", "AI recommendation engine", "Document processing for legal/medical"],
  },
];

const faqs = [
  { q: "How do I know which package to choose?", a: "Start with your budget and must-have features. If you're unsure, pick the package that feels right and we'll adjust it during our discovery call. Many clients start with Starter or Business and upgrade later." },
  { q: "Can I customize these packages?", a: "Absolutely. These are starting points. We'll tailor any package to your specific needs during our consultation." },
  { q: "What if I need features not listed?", a: "Tell us. We'll create a custom quote based on your requirements using the same transparent pricing approach." },
  { q: "What does 'support after launch' include?", a: "Bug fixes, small adjustments, and help if something breaks. It does not include major new features or content updates (those would be a separate project or maintenance retainer)." },
  { q: "Do you offer maintenance after support ends?", a: "Yes. We offer monthly retainers for ongoing maintenance, updates, and support. Ask us for details." },
  { q: "How do payments work?", a: "We use milestone payments: 30% to start, 30% when designs are approved, 30% when development is complete, and 10% on launch. For smaller projects, we may use 50/50." },
  { q: "What do I need to provide?", a: "Content (text, images, logos), timely feedback, and access to any existing systems we need to integrate with. We'll guide you through everything." },
];

const Pricing = () => {
  return (
    <Layout>
      <SEO
        title="Fixed-Price Software Development Pricing"
        description="Transparent, fixed-price packages for websites, apps, and AI solutions ranging from MVPs to enterprise systems."
        url="/pricing"
      />
      <PageHero
        icon={DollarSign}
        title="Pricing"
        description="No confusion. No hidden fees. Fixed-price development — what we agree is what you pay."
        image={heroPricing}
        ctaText="Contact Us"
        ctaLink="/contact"
      />

      {/* What every package includes */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {[
              { icon: "💰", label: "Fixed price — no surprises" },
              { icon: "📋", label: "Clear milestones at every stage" },
              { icon: "🔑", label: "You own everything — code & design" },
              { icon: "🛟", label: "Support after launch — we don't disappear" },
            ].map((item) => (
              <div key={item.label} className="surface-glass rounded-xl p-5 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Websites */}
      <section className="section-padding section-alt" id="websites">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Websites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websitePackages.map((pkg, i) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="section-padding" id="apps">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Web & Mobile Apps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appPackages.map((pkg, i) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="section-padding section-alt" id="ai">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">AI Automation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiPackages.map((pkg, i) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" id="faq">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <SectionHeading badge="FAQ" title="Frequently asked questions" description="Everything you need to know about working with CiroStack." />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="surface-glass rounded-xl px-6 border-none">
                <AccordionTrigger className="text-foreground text-left font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Payment info */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">How payments work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { pct: "30%", label: "To start" },
              { pct: "30%", label: "Design approved" },
              { pct: "30%", label: "Dev complete" },
              { pct: "10%", label: "Launch day" },
            ].map((step) => (
              <div key={step.label} className="surface-glass rounded-xl p-5">
                <p className="text-2xl font-display font-bold text-primary">{step.pct}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">For smaller projects, we may use 50% upfront and 50% on completion.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Not sure which package?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">No problem. Just reach out and we'll help you figure it out. Free consultation, no obligations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Get a Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
            <a href="mailto:hello@cirostack.com">
              <Button size="lg" variant="outline">Email Us</Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
