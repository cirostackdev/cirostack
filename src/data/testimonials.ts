/**
 * Curated testimonials with service and startup tags for filtered marquee rendering.
 *
 * services : service page slugs (matches heroImages keys in ServiceDetail.tsx)
 * startups : startup page slugs (matches startupsData keys)
 *
 * Untagged items (no services/startups field) appear on ALL pages.
 */
export type Testimonial = {
    text: string;
    name: string;
    role: string;
    services?: string[];
    startups?: string[];
};

export const allTestimonials: Testimonial[] = [
    {
        text: "CiroStack delivered our complex MVP ahead of schedule. Their engineering team is truly world-class and acted as a true partner rather than a simple vendor.",
        name: "Michael Chen",
        role: "CTO, FinTech Systems",
        services: ["websites", "ai", "digital-transformation"],
        startups: ["fintech", "b2b-saas", "mvp", "seed-stage"],
    },
    {
        text: "The cloud migration strategy they architected saved us nearly 40% on our monthly AWS overhead. I cannot recommend their enterprise consulting enough.",
        name: "Sarah Jenkins",
        role: "VP of Engineering, HealthNet",
        services: ["cloud-engineering", "cloud-consulting"],
        startups: ["healthtech", "scaling-tech", "growth"],
    },
    {
        text: "Their UX/UI redesign drastically simplified our checkout flow. We saw a 22% increase in conversion rates within the first month of launch.",
        name: "David Dubois",
        role: "Founder, RetailFlow",
        services: ["ux-ui-design", "websites"],
        startups: ["ecommerce", "consumer-apps", "web-app", "first-time-founder"],
    },
    {
        text: "CiroStack delivered our platform ahead of schedule and the code quality was exceptional. They felt like a true extension of our own engineering team.",
        name: "Marcus Webb",
        role: "CTO, NovaPay",
        services: ["apps", "ai", "startups"],
        startups: ["fintech", "mobile-app", "seed-stage", "non-technical-founder"],
    },
    {
        text: "Working with CiroStack transformed our operations. Their AI integration doubled our efficiency within months. Genuinely outstanding results.",
        name: "Leila Nkosi",
        role: "CEO, BrightFlow",
        services: ["ai", "ai-ml", "digital-transformation"],
        startups: ["ai-startup", "ai-product", "ai-integration", "scale-up"],
    },
    {
        text: "Transparent, fast, and genuinely talented. The best software agency we've partnered with: full stop.",
        name: "Tom Harding",
        role: "Founder, Stacklite",
        services: ["websites", "dedicated-teams", "startups"],
        startups: ["repeat-founder", "saas-platform", "b2b-saas", "growth"],
    },
    {
        text: "CiroStack transformed our online retail platform completely. Their engineering team cut our page load times by 60% and our cart abandonment dropped overnight.",
        name: "Elena Rostova",
        role: "Director of Product, ShopVault",
        services: ["websites", "ux-ui-design"],
        startups: ["ecommerce", "web-app", "early-traction"],
    },
    {
        text: "We needed a custom inventory management system that could scale to Black Friday traffic. CiroStack built it in 6 weeks, and it held flawlessly.",
        name: "James Osei",
        role: "Head of Engineering, MegaMart",
        services: ["cloud-engineering", "data-engineering"],
        startups: ["ecommerce", "marketplace", "scaling-tech"],
    },
    {
        text: "Building HIPAA-compliant software is notoriously difficult to get right. CiroStack's compliance-as-code approach gave us audit-ready infrastructure from day one.",
        name: "Dr. Patricia Wu",
        role: "CTO, CareLink Health",
        services: ["iam", "software-auditing", "security-audit"],
        startups: ["healthtech", "fundraising-ready", "seed-stage"],
    },
    {
        text: "Their patient portal redesign reduced our support tickets by 35%. The UX is intuitive enough that elderly patients use it without assistance.",
        name: "Nathaniel Adeyemi",
        role: "COO, MedStream",
        services: ["ux-ui-design", "apps"],
        startups: ["healthtech", "mobile-app", "consumer-apps"],
    },
    {
        text: "The real-time transaction monitoring system they built processes over 2 million events per day with zero downtime. Remarkable engineering.",
        name: "Sophie Laurent",
        role: "VP Engineering, ClearBank",
        services: ["data-engineering", "ai-ml"],
        startups: ["fintech", "b2b-saas", "scale-up", "ai-product"],
    },
    {
        text: "We hired CiroStack to rescue a failing fintech project. They diagnosed the architecture issues within a week and had a new system in production within two months.",
        name: "Raj Patel",
        role: "Founder, PayRoute",
        services: ["startups", "digital-transformation"],
        startups: ["fintech", "agency-rescue", "post-pivot", "tech-debt"],
    },
    {
        text: "Our LMS used to crash during peak exam periods. After CiroStack's cloud re-architecture, it has handled over 50,000 concurrent students seamlessly.",
        name: "Professor Laura Vance",
        role: "CTO, EduPrime",
        services: ["cloud-engineering", "apps"],
        startups: ["edtech", "scaling-tech", "saas-platform"],
    },
    {
        text: "The AI-driven personalised learning engine they built has measurably improved student completion rates. This is genuinely transformative technology.",
        name: "Chidi Okeke",
        role: "CEO, LearnPath",
        services: ["ai", "ai-ml"],
        startups: ["edtech", "ai-product", "ai-integration", "mvp"],
    },
    {
        text: "CiroStack built our supply chain visibility platform from scratch. We now have real-time tracking across 14 warehouses. ROI was evident within 90 days.",
        name: "Hans Müller",
        role: "Head of Ops, SwiftLogix",
        services: ["data-engineering", "cloud-engineering"],
        startups: ["logistics-tech", "b2b-saas", "mvp", "early-traction"],
    },
    {
        text: "The predictive maintenance AI model they deployed reduced our factory downtime by 28% in the first quarter. Extraordinary results.",
        name: "Maria Santos",
        role: "Plant Director, PrecisionMFG",
        services: ["ai-ml", "automation-testing"],
        startups: ["logistics-tech", "ai-product", "ai-integration"],
    },
    {
        text: "We needed to scale from 1,000 to 100,000 users in 6 months. CiroStack designed an architecture that handled the growth without a single outage.",
        name: "Aiden Park",
        role: "Co-Founder, Notifiq",
        services: ["cloud-engineering", "startups"],
        startups: ["b2b-saas", "saas-platform", "scaling-tech", "growth", "solo-founder"],
    },
    {
        text: "Their AI automation suite eliminated 8 hours of manual data-entry work per day for our operations team. The ROI paid for itself in the first month.",
        name: "Fatima Al-Rashid",
        role: "COO, DataNest",
        services: ["ai", "ai-ml", "data-engineering"],
        startups: ["ai-startup", "ai-product", "b2b-saas", "corporate-innovator"],
    },
    {
        text: "The property listing platform CiroStack built for us is faster and more intuitive than Zillow. Our agents love it. Our clients love it even more.",
        name: "Greg Thompson",
        role: "CEO, UrbanNest Realty",
        services: ["websites", "apps"],
        startups: ["proptech", "marketplace", "web-app", "mobile-app"],
    },
    {
        text: "We went from a broken streaming backend to a Netflix-calibre experience in under 3 months. CiroStack's media engineering expertise is second to none.",
        name: "Isabelle Fontaine",
        role: "CTO, StreamDeck",
        services: ["cloud-engineering", "apps"],
        startups: ["consumer-apps", "mobile-app", "scaling-tech", "agency-rescue"],
    },
];
