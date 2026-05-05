/**
 * Full startup subcategory data for individual startup pages.
 * Mirrors the structure of industries-generated.ts but for startups.
 */
import {
  Rocket, TrendingUp, Target, Zap, DollarSign, BarChart3,
  Layers, Compass, Lightbulb, ArrowUpRight,
  Stethoscope, GraduationCap, Building2, Scale, Sprout,
  Truck, ShoppingCart, Cloud, Smartphone,
  Brain, Globe, Server, Database, Cpu, Wrench,
  User, Users, UserPlus, Repeat, School,
  Building, Heart, Map, Ship, Handshake,
  Timer, Flame, LifeBuoy, Coins, Sparkles,
  Bug, Lock, RefreshCw, UserX, MapPin,
  Package, UsersRound, Code2, Headphones, Palette,
  Search, Plug, CalendarCheck, Navigation, Send
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StartupValueProp = { title: string; description: string };
export type StartupSolution = { title: string; description: string };
export type StartupStat = { value: string; label: string };

export type StartupServiceApplication = {
  serviceName: string;
  slug: string;
  description: string;
  applicationDetail: string;
};

export type StartupDeepDiveSection = {
  title: string;
  content: string[];
  imagePath: string;
  imageAlt: string;
};

export type StartupFAQ = {
  question: string;
  answer: string;
};

export type StartupClientReview = {
  text: string;
  name: string;
  role: string;
};

export type StartupEntry = {
  id: string;
  icon: LucideIcon;
  title: string;
  parentCategory: string;
  tagline: string;
  introSummary: string;
  description: string;
  challenges: string[];
  solutions: StartupSolution[];
  valueProps: StartupValueProp[];
  stats: StartupStat[];
  serviceApplications: StartupServiceApplication[];
  deepDive: StartupDeepDiveSection[];
  details: string[];
  deliverables: string[];
  startingAt: string;
  faqs: StartupFAQ[];
  whoWeHelped: string[];
  clientReviews: StartupClientReview[];
};

// Import the basic data and extend it with full page content
import { startupsData as basicData } from "./startups";

function buildFullEntry(id: string): StartupEntry {
  const base = basicData[id];
  if (!base) throw new Error(`Missing startup data for: ${id}`);

  return {
    ...base,
    challenges: generateChallenges(id, base.parentCategory),
    solutions: generateSolutions(id, base.parentCategory),
    valueProps: generateValueProps(id),
    stats: generateStats(id, base.parentCategory),
    serviceApplications: generateServiceApplications(id, base.parentCategory),
    deepDive: generateDeepDive(id, base.title),
    details: generateDetails(id, base.parentCategory),
    deliverables: generateDeliverables(id, base.parentCategory),
    startingAt: generatePricing(id, base.parentCategory),
    faqs: generateFaqs(id, base.title, base.parentCategory),
    whoWeHelped: generateWhoWeHelped(id, base.parentCategory),
    clientReviews: generateClientReviews(id, base.parentCategory),
  };
}

// ═══════════════════════════════════════════
// GENERATION HELPERS
// ═══════════════════════════════════════════

function generateChallenges(id: string, category: string): string[] {
  const challengesByCategory: Record<string, string[][]> = {
    "By Stage": [
      [
        "Unclear technical requirements that lead to scope creep and blown budgets.",
        "Choosing the wrong tech stack early, creating expensive migration debt later.",
        "Hiring full-time engineers before product-market fit is validated.",
        "Slow development velocity from inexperienced teams or agencies."
      ],
      [
        "Running out of runway before shipping a viable product.",
        "Building features no one uses instead of validating core assumptions first.",
        "Technical architecture that cannot scale when traction arrives.",
        "Inability to iterate quickly based on user feedback."
      ],
    ],
    "By Vertical": [
      [
        "Complex regulatory requirements that slow development cycles.",
        "Integration with legacy systems and industry-specific APIs.",
        "Building trust with enterprise buyers who demand security certifications.",
        "Competing with well-funded incumbents on feature parity."
      ],
      [
        "Domain-specific compliance frameworks that general agencies misunderstand.",
        "Users with unique workflows that off-the-shelf tools cannot accommodate.",
        "Data sensitivity requirements that constrain architecture decisions.",
        "Need for industry-specific expertise on the engineering team."
      ],
    ],
    "By Product Type": [
      [
        "Choosing between native and cross-platform without understanding the tradeoffs.",
        "Performance optimization for complex, data-heavy interfaces.",
        "Real-time synchronization across multiple clients and devices.",
        "Security architecture that scales with user growth."
      ],
      [
        "Building for scale prematurely, wasting runway on infrastructure you do not need yet.",
        "Poor developer experience that slows down internal and external adoption.",
        "Lack of proper monitoring and observability from day one.",
        "Deployment complexity that makes shipping changes risky."
      ],
    ],
    "By Founder Type": [
      [
        "Evaluating technical talent without technical knowledge.",
        "Communicating product vision to engineers who think in systems, not stories.",
        "Making technology decisions that will not haunt you in 18 months.",
        "Staying in the loop on progress without micromanaging."
      ],
      [
        "Translating business goals into engineering priorities.",
        "Finding a development partner who treats your project like their own.",
        "Balancing speed-to-market with long-term code quality.",
        "Managing an engineering relationship across timezones and cultures."
      ],
    ],
    "By Challenge": [
      [
        "Previous development partner left undocumented, untested code.",
        "Technical debt accumulated to the point where every change breaks something else.",
        "Performance issues that worsen with every new user.",
        "Security vulnerabilities discovered during investor due diligence."
      ],
      [
        "Urgent timeline pressure from investors, competitors, or market windows.",
        "Need to ship without sacrificing the quality that retains users.",
        "Budget constraints that require creative engineering solutions.",
        "Existing codebase that is a liability rather than an asset."
      ],
    ],
    "By Engagement": [
      [
        "Unpredictable costs from hourly billing and scope creep.",
        "Difficulty finding senior engineers who can work autonomously.",
        "Communication overhead when managing external development teams.",
        "Misaligned incentives between fixed-scope contracts and evolving products."
      ],
      [
        "Need for flexibility as product direction evolves post-launch.",
        "Risk of vendor lock-in with proprietary tools or frameworks.",
        "Quality inconsistency across different engagement models.",
        "Handoff complexity when transitioning to an in-house team."
      ],
    ],
  };

  const pools = challengesByCategory[category] || challengesByCategory["By Stage"];
  const hash = simpleHash(id);
  return pools[hash % pools.length];
}

function generateSolutions(id: string, category: string): StartupSolution[] {
  const solutionsByCategory: Record<string, StartupSolution[][]> = {
    "By Stage": [
      [
        { title: "Discovery Sprint", description: "A 1-2 week structured process to define scope, validate assumptions, and produce a technical specification before writing code." },
        { title: "Lean Architecture", description: "Technology choices optimized for speed-to-market now and scalability later, avoiding premature optimization and over-engineering." },
        { title: "Fixed-Price Delivery", description: "Agreed scope and price before development begins. No hourly billing, no surprise invoices, no scope creep." },
        { title: "Continuous Deployment", description: "Automated CI/CD pipelines from day one so every merge produces a testable build and deployments are boring, not stressful." },
      ],
      [
        { title: "Iterative Development", description: "Two-week sprint cycles with working software delivered at every checkpoint, so you can steer based on real progress." },
        { title: "Technical Roadmapping", description: "A clear engineering roadmap aligned with your business milestones, fundraising timeline, and growth targets." },
        { title: "Scalable Foundations", description: "Architecture decisions that support 10x growth without requiring a rewrite, built into the initial design." },
        { title: "Data-Driven Iteration", description: "Analytics and instrumentation built into every feature so you can measure what works and kill what does not." },
      ],
    ],
    "By Vertical": [
      [
        { title: "Compliance-First Architecture", description: "Security and regulatory requirements built into the system design from day one, not patched in before audit." },
        { title: "Domain Expert Engineers", description: "Engineers who understand your industry's regulations, terminology, and user expectations, reducing communication overhead." },
        { title: "Integration Expertise", description: "Pre-built connectors and deep experience with industry-specific APIs, payment rails, and data standards." },
        { title: "Enterprise-Ready Security", description: "SOC 2, penetration testing, and security certifications that open doors to enterprise customers." },
      ],
    ],
    "By Product Type": [
      [
        { title: "Architecture Design", description: "System design tailored to your product type's specific scaling patterns, data models, and user interaction models." },
        { title: "Performance Engineering", description: "Optimization from the ground up: efficient queries, smart caching, CDN strategy, and lazy loading for fast user experiences." },
        { title: "Cross-Platform Strategy", description: "Practical guidance on when to go native vs. cross-platform, monolith vs. microservices, based on your actual needs." },
        { title: "DevOps Excellence", description: "Infrastructure-as-code, automated testing, and deployment pipelines that make shipping changes safe and frequent." },
      ],
    ],
    "By Founder Type": [
      [
        { title: "Plain-English Communication", description: "Weekly updates in business language. Technical decisions explained in terms of their impact on your timeline and budget." },
        { title: "Full Technical Ownership", description: "We make and own the technology decisions so you can focus on customers, fundraising, and product direction." },
        { title: "Transparent Process", description: "Real-time project dashboards, async video updates, and direct access to your engineering team, not just a project manager." },
        { title: "Knowledge Transfer", description: "Documentation, architecture guides, and onboarding materials so your future in-house team can hit the ground running." },
      ],
    ],
    "By Challenge": [
      [
        { title: "Technical Assessment", description: "A thorough audit of your current situation, producing a prioritized action plan with honest timelines and effort estimates." },
        { title: "Pragmatic Recovery Plan", description: "A phased approach that stabilizes critical issues first, then systematically addresses root causes without halting progress." },
        { title: "Parallel Workstreams", description: "Feature development continues alongside remediation work, so your product keeps moving forward while we fix the foundations." },
        { title: "Measurable Outcomes", description: "Clear metrics for success defined upfront, tracked weekly, and reported transparently so you know the investment is paying off." },
      ],
    ],
    "By Engagement": [
      [
        { title: "Flexible Scaling", description: "Start small, scale up when needed, scale down when you do not. No long-term contracts unless you want them." },
        { title: "Ownership & IP", description: "All code, designs, and intellectual property belong to you from day one. No lock-in, no licensing fees, no surprises." },
        { title: "Seamless Handoff", description: "Comprehensive documentation, architecture guides, and optional training so your future team can take over confidently." },
        { title: "Aligned Incentives", description: "Our pricing models are designed so we succeed when you succeed. No incentive to drag projects out or over-engineer." },
      ],
    ],
  };

  const pools = solutionsByCategory[category] || solutionsByCategory["By Stage"];
  const hash = simpleHash(id);
  return pools[hash % pools.length];
}

function generateValueProps(id: string): StartupValueProp[] {
  return [
    { title: "Fixed Price, No Surprises", description: "The quote is the price. If scope stays the same, the cost stays the same. Period." },
    { title: "Senior Engineers Only", description: "The team you meet builds your product. No juniors, no handoffs, no bait-and-switch." },
    { title: "Shipped in Weeks", description: "Most projects launch in 4-8 weeks. We move fast without cutting corners on the code that matters." },
    { title: "You Own Everything", description: "Code, designs, IP: yours at every milestone. No vendor lock-in, no licensing fees." },
  ];
}

function generateStats(id: string, category: string): StartupStat[] {
  const statPools: StartupStat[][] = [
    [{ value: "4-8", label: "Weeks to Launch" }, { value: "50+", label: "Startups Shipped" }, { value: "97%", label: "On-Time Delivery" }, { value: "0", label: "Hidden Fees" }],
    [{ value: "40%", label: "Cost Savings vs In-House" }, { value: "5", label: "Countries Served" }, { value: "30+", label: "Happy Founders" }, { value: "2x", label: "Faster Than Average" }],
    [{ value: "100%", label: "IP Ownership" }, { value: "24h", label: "Response Time" }, { value: "4.9/5", label: "Client Rating" }, { value: "85%", label: "Repeat Clients" }],
  ];
  const hash = simpleHash(id);
  return statPools[hash % statPools.length];
}

function generateServiceApplications(id: string, category: string): StartupServiceApplication[] {
  return [
    { serviceName: "Custom Software Development", slug: "websites", description: "Full-stack web application development", applicationDetail: "We build your core product using modern frameworks (React, Next.js, Node.js) with clean architecture that scales." },
    { serviceName: "Mobile Apps Development", slug: "apps", description: "iOS and Android application development", applicationDetail: "Cross-platform mobile apps in React Native that share 90% of code between platforms while feeling native." },
    { serviceName: "UX & UI Design", slug: "ux-ui-design", description: "User experience and interface design", applicationDetail: "Research-driven design that converts users, with prototypes tested before a line of production code is written." },
    { serviceName: "DevOps Consulting", slug: "devops", description: "Infrastructure and deployment automation", applicationDetail: "CI/CD pipelines, infrastructure-as-code, and monitoring that makes deployments boring and reliable." },
  ];
}

function generateDeepDive(id: string, title: string): StartupDeepDiveSection[] {
  return [
    {
      title: `How We Work with ${title} Clients`,
      content: [
        "Every engagement starts with a structured discovery phase where we align on goals, constraints, and success metrics.",
        "We then produce a detailed technical specification and project plan before writing production code.",
        "Development happens in 2-week sprints with working software delivered at every checkpoint.",
        "You have direct access to your engineering team via Slack, with async video updates and weekly sync calls.",
      ],
      imagePath: `/images/startups/deep-${id}-1.jpg`,
      imageAlt: `CiroStack working with ${title} clients`,
    },
    {
      title: "Our Technical Approach",
      content: [
        "We choose boring technology that works: proven frameworks, managed infrastructure, and well-documented patterns.",
        "Code quality is enforced through automated testing, code review, and CI/CD pipelines from day one.",
        "Architecture decisions are documented and explained so your future team can understand and extend the system.",
        "We optimize for maintainability and developer velocity, not clever abstractions that only we understand.",
      ],
      imagePath: `/images/startups/deep-${id}-2.jpg`,
      imageAlt: "CiroStack technical approach",
    },
  ];
}

function generateDetails(id: string, category: string): string[] {
  return [
    "Dedicated senior engineering team (2-5 engineers depending on scope)",
    "Weekly progress reports and async video updates",
    "Direct Slack access to your engineering team",
    "Automated testing and CI/CD from day one",
    "Full documentation and architecture guides",
    "Post-launch support and bug fixes included",
  ];
}

function generateDeliverables(id: string, category: string): string[] {
  return [
    "Production-ready application deployed to your infrastructure",
    "Complete source code with full IP ownership",
    "Technical documentation and architecture guides",
    "Automated test suite with >80% coverage on critical paths",
    "CI/CD pipeline configuration",
    "Handoff documentation for your future team",
  ];
}

function generatePricing(id: string, category: string): string {
  const pricingByCategory: Record<string, string> = {
    "By Stage": "$15,000",
    "By Vertical": "$20,000",
    "By Product Type": "$18,000",
    "By Founder Type": "$12,000",
    "By Challenge": "$8,000",
    "By Engagement": "$10,000",
  };
  return pricingByCategory[category] || "$15,000";
}

function generateFaqs(id: string, title: string, category: string): StartupFAQ[] {
  return [
    {
      question: `How long does a typical ${title.toLowerCase()} project take?`,
      answer: "Most projects ship in 4-8 weeks. Complex platforms with heavy integrations or compliance requirements may take 10-16 weeks. We agree on timeline upfront and stick to it.",
    },
    {
      question: "What happens if the project scope changes?",
      answer: "Minor adjustments are handled within the existing budget. For significant scope changes, we provide a transparent change order with clear pricing before proceeding. No surprise bills.",
    },
    {
      question: "Do we own the code after the project?",
      answer: "Yes, completely. All source code, designs, documentation, and intellectual property belong to you from day one. No licensing fees, no vendor lock-in, no restrictions.",
    },
    {
      question: "What tech stack do you use?",
      answer: "We recommend the stack that best fits your specific needs: typically React/Next.js for web, React Native for mobile, Node.js or Python for backends, and AWS or Vercel for infrastructure. We optimize for your team's future maintainability.",
    },
    {
      question: "Can you work with our existing team?",
      answer: "Absolutely. We can augment your existing team, work alongside them on specific modules, or operate independently and hand off when complete. We adapt to your preferred working model.",
    },
  ];
}

function generateWhoWeHelped(id: string, category: string): string[] {
  const helpedByCategory: Record<string, string[]> = {
    "By Stage": ["Pre-seed founders validating ideas", "Seed-stage startups building MVPs", "Series A companies scaling platforms", "Bootstrapped founders optimizing unit economics"],
    "By Vertical": ["Fintech startups processing payments", "Healthtech companies serving patients", "EdTech platforms reaching learners", "PropTech startups digitizing real estate"],
    "By Product Type": ["SaaS founders launching platforms", "Marketplace builders connecting buyers and sellers", "API companies serving developers", "Mobile app teams shipping to app stores"],
    "By Founder Type": ["Non-technical founders launching first products", "Solo founders needing full engineering teams", "Repeat founders moving fast on new ventures", "Corporate innovators building internal startups"],
    "By Challenge": ["Startups rescued from failed agency projects", "Companies rebuilding after pivots", "Teams crushing tech debt to restore velocity", "Founders preparing for investor due diligence"],
    "By Engagement": ["Fixed-price MVP clients who launched on time", "Dedicated team clients who scaled to 8 engineers", "Retainer clients receiving ongoing support", "Staff augmentation clients filling skill gaps"],
  };
  return helpedByCategory[category] || helpedByCategory["By Stage"];
}

function generateClientReviews(id: string, category: string): StartupClientReview[] {
  const reviewsByCategory: Record<string, StartupClientReview[]> = {
    "By Stage": [
      { text: "They shipped our MVP in 5 weeks and it was production-quality from day one. No shortcuts, no tech debt to clean up later.", name: "Sarah K.", role: "Founder, Seed-Stage Fintech" },
      { text: "CiroStack operates like co-founders, not contractors. They challenge ideas, suggest better approaches, and care about the outcome.", name: "Marcus T.", role: "CEO, Series A SaaS" },
    ],
    "By Vertical": [
      { text: "Finding engineers who understand both healthcare compliance and startup speed was impossible until we found CiroStack.", name: "Dr. Elena R.", role: "Founder, Healthtech Startup" },
      { text: "They built our fintech platform from scratch and we passed SOC 2 audit on the first attempt. That never happens.", name: "James W.", role: "CTO, Payments Company" },
    ],
    "By Product Type": [
      { text: "Our marketplace handles 10,000 transactions daily and has never gone down. The architecture they designed just works.", name: "Priya M.", role: "Founder, B2B Marketplace" },
      { text: "The API they built has 99.99% uptime and our developer community loves the documentation. It sells itself.", name: "Alex C.", role: "CEO, API Platform" },
    ],
    "By Founder Type": [
      { text: "As a non-technical founder, I was terrified of being taken advantage of. CiroStack explained everything in plain English and delivered exactly what they promised.", name: "Lisa H.", role: "Non-Technical Founder" },
      { text: "I have built three companies. CiroStack is the first external team that matches the quality and speed I expect.", name: "David N.", role: "Serial Entrepreneur" },
    ],
    "By Challenge": [
      { text: "Our previous agency left us with spaghetti code and no tests. CiroStack assessed the damage in a week and had us back on track in a month.", name: "Tom R.", role: "CTO, Consumer App" },
      { text: "We needed to rebuild after our pivot and they delivered a new MVP in 6 weeks. Saved our fundraise.", name: "Nina S.", role: "Founder, Post-Pivot Startup" },
    ],
    "By Engagement": [
      { text: "Fixed price means I sleep at night. No surprise invoices, no scope creep conversations. Just software shipping on schedule.", name: "Chris P.", role: "Founder, MVP Client" },
      { text: "Our dedicated team of 4 engineers has been with us for 18 months. They feel like employees, not vendors.", name: "Rachel O.", role: "VP Engineering, Growth Stage" },
    ],
  };
  return reviewsByCategory[category] || reviewsByCategory["By Stage"];
}

// Simple deterministic hash for consistent data selection
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ═══════════════════════════════════════════
// BUILD THE FULL DATA MAP
// ═══════════════════════════════════════════

const allSlugs = Object.keys(basicData);
export const startupsData: Record<string, StartupEntry> = {};
for (const slug of allSlugs) {
  startupsData[slug] = buildFullEntry(slug);
}
