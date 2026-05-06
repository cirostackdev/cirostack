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
import { startupContentOverrides } from "./startups-content";

function buildFullEntry(id: string): StartupEntry {
  const base = basicData[id];
  if (!base) throw new Error(`Missing startup data for: ${id}`);

  const o = startupContentOverrides[id] ?? {};

  return {
    ...base,
    challenges: o.challenges ?? generateChallenges(id, base.parentCategory),
    solutions: o.solutions ?? generateSolutions(id, base.parentCategory),
    valueProps: o.valueProps ?? generateValueProps(id),
    stats: o.stats ?? generateStats(id, base.parentCategory),
    serviceApplications: o.serviceApplications ?? generateServiceApplications(id, base.parentCategory),
    deepDive: o.deepDive ?? generateDeepDive(id, base.title),
    details: o.details ?? generateDetails(id, base.parentCategory),
    deliverables: o.deliverables ?? generateDeliverables(id, base.parentCategory),
    startingAt: o.startingAt ?? generatePricing(id, base.parentCategory),
    faqs: o.faqs ?? generateFaqs(id, base.title, base.parentCategory),
    whoWeHelped: o.whoWeHelped ?? generateWhoWeHelped(id, base.parentCategory),
    clientReviews: o.clientReviews ?? generateClientReviews(id, base.parentCategory),
  };
}

// ═══════════════════════════════════════════
// GENERATION HELPERS
// ═══════════════════════════════════════════

function generateChallenges(id: string, category: string): string[] {
  // Per-entry unique challenges for BY VERTICAL
  const verticalChallenges: Record<string, string[]> = {
    "fintech": [
      "PCI-DSS compliance adds 3-6 months to a product built without it from the start.",
      "Bank API integrations (Plaid, Stripe Connect, Open Banking) have undocumented edge cases that only surface in production.",
      "Fraud detection systems must balance false positives (blocking real customers) with false negatives (losing money).",
      "Regulatory requirements differ by state, country, and financial product type, and they change quarterly.",
    ],
    "healthtech": [
      "HIPAA requires encryption at rest, in transit, and in audit logs, which constrains every architecture choice.",
      "EHR integrations via FHIR R4 and HL7v2 are poorly documented and vary by hospital system vendor.",
      "Patient-facing UX must accommodate low health literacy while meeting clinical accuracy standards.",
      "BAA agreements with every cloud vendor and subprocessor create procurement bottlenecks that delay launch.",
    ],
    "edtech": [
      "Traffic spikes 300-500% during enrollment season and exam periods, then drops to near-zero in summer.",
      "Video streaming costs compound with scale: 10,000 concurrent learners can cost $15,000/month in bandwidth alone.",
      "FERPA and COPPA compliance restrict how student data flows through analytics and third-party tools.",
      "Two completely different user personas (instructors and students) share the same platform with conflicting UX needs.",
    ],
    "proptech": [
      "MLS data licensing agreements restrict how property data can be displayed, cached, and redistributed.",
      "Property search must return results in under 300ms with complex geospatial queries across millions of listings.",
      "Multi-party transactions involve 6-10 stakeholders (agents, buyers, sellers, lenders, inspectors) each with their own workflow.",
      "Real estate regulations vary by municipality, not just by state, creating a patchwork compliance surface.",
    ],
    "legaltech": [
      "Attorney-client privilege means every architecture decision must account for who can access what data and when.",
      "Law firms adopt new software slowly: 18-24 month sales cycles require a product that proves value in a trial period.",
      "Jurisdiction variance means document templates, workflows, and compliance rules differ across every court system.",
      "Legal AI must cite sources accurately. A hallucinated case citation can result in sanctions against the attorney.",
    ],
    "agritech": [
      "Field operations happen where there is no internet: offline-first architecture is not optional, it is the default state.",
      "IoT sensors generate millions of telemetry data points daily that must be stored, processed, and acted on affordably.",
      "Smallholder farmers use feature phones with USSD interfaces, not smartphones with web browsers.",
      "FSMA 204 traceability requirements demand supply chain visibility that most ag-tech platforms were not designed for.",
    ],
    "logistics-tech": [
      "Real-time fleet GPS tracking for 1,000+ vehicles requires infrastructure that handles constant location updates at sub-second intervals.",
      "Route optimization is an NP-hard problem that must be solved approximately in under 2 seconds for driver acceptance.",
      "Driver apps must work offline in tunnels, basements, and rural areas, then sync seamlessly when connectivity returns.",
      "Last-mile delivery introduces address ambiguity, failed deliveries, and proof-of-delivery requirements that break simple tracking models.",
    ],
    "ecommerce": [
      "Shopify and WooCommerce hit limits at $5M+ revenue: custom discount logic, multi-warehouse inventory, and B2B pricing require headless architecture.",
      "Every 100ms of page load delay reduces conversion by 1%. Performance is directly tied to revenue.",
      "Checkout abandonment sits at 70% industry average. Every friction point in the flow costs measurable money.",
      "Inventory synchronization across marketplace channels (Amazon, website, retail) creates oversell and stockout risks.",
    ],
    "b2b-saas": [
      "Enterprise buyers require SAML SSO, SCIM provisioning, and audit logs before they will sign a contract over $50K/year.",
      "Multi-tenancy data isolation must be bulletproof: one customer seeing another customer's data kills the company.",
      "Usage-based billing requires metering infrastructure that is both accurate enough for invoicing and fast enough to not slow the product.",
      "Moving upmarket means supporting custom SLAs, dedicated infrastructure, and white-labeling without fragmenting the codebase.",
    ],
    "consumer-apps": [
      "Day-1 to Day-7 retention is the only metric that matters: most consumer apps lose 75% of users in the first week.",
      "Push notification systems must balance re-engagement against uninstall rates. Too many notifications kills the app.",
      "Social features (feeds, messaging, reactions) require real-time infrastructure that scales non-linearly with user growth.",
      "App store review processes add 2-7 days to every release cycle and reject builds for undocumented reasons.",
    ],
  };

  if (verticalChallenges[id]) return verticalChallenges[id];

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
  // Per-entry unique solutions for BY VERTICAL
  const verticalSolutions: Record<string, StartupSolution[]> = {
    "fintech": [
      { title: "PCI-DSS by Design", description: "Compliance is an architecture pattern, not a checklist. We structure data flows, encryption, and access controls so your first audit is a formality." },
      { title: "Bank-Grade Integrations", description: "Pre-built patterns for Plaid, Stripe Connect, Open Banking APIs, and ACH processing. We know the edge cases because we have hit them." },
      { title: "Fraud Detection Infrastructure", description: "Rule engines and ML scoring pipelines that flag suspicious activity in real-time without blocking legitimate transactions." },
      { title: "Multi-Jurisdiction Licensing", description: "Architecture that supports state-by-state and country-by-country regulatory variance without duplicating your entire backend." },
    ],
    "healthtech": [
      { title: "HIPAA-Native Architecture", description: "Encryption, access logging, BAA-compliant infrastructure, and audit trails built into the system from the first commit." },
      { title: "EHR Integration (FHIR R4)", description: "Production-tested connectors for Epic, Cerner, Allscripts, and Athenahealth. We handle the HL7v2 edge cases that documentation omits." },
      { title: "Clinical-Grade UX", description: "Interfaces that physicians can use in 30-second interactions between patients, and patients can navigate at any literacy level." },
      { title: "Telehealth Infrastructure", description: "WebRTC video with HIPAA-compliant recording, waiting rooms, multi-provider sessions, and the fallback to phone when bandwidth drops." },
    ],
    "edtech": [
      { title: "Elastic Scaling", description: "Infrastructure that handles 5x traffic spikes during enrollment and exam periods without manual intervention or over-provisioning during quiet months." },
      { title: "Video Cost Optimization", description: "Adaptive bitrate streaming, CDN strategy, and transcoding pipelines that keep bandwidth costs predictable as your learner base grows." },
      { title: "Dual-Persona UX", description: "Separate, optimized interfaces for instructors (content creation, grading, analytics) and students (learning, collaboration, progress) on one platform." },
      { title: "Student Data Compliance", description: "FERPA and COPPA-compliant data architecture that still enables the analytics you need to improve learning outcomes." },
    ],
    "proptech": [
      { title: "Sub-300ms Property Search", description: "Geospatial indexing, intelligent caching, and query optimization that returns complex filtered results faster than users can scroll." },
      { title: "MLS Compliance Architecture", description: "Data handling patterns that satisfy MLS licensing restrictions on display, caching, refresh rates, and attribution requirements." },
      { title: "Multi-Party Transaction Workflows", description: "State machines that coordinate agents, buyers, sellers, lenders, inspectors, and title companies through complex closing processes." },
      { title: "Digital Signature Integration", description: "DocuSign, Dotloop, and custom e-signature flows that handle the legal requirements of real estate documents across jurisdictions." },
    ],
    "legaltech": [
      { title: "Privilege-Aware Architecture", description: "Data access patterns, encryption boundaries, and audit systems designed around attorney-client privilege from the data model up." },
      { title: "Document Automation Engine", description: "Template systems that handle conditional logic, jurisdiction variance, defined terms, and cross-referencing across complex legal documents." },
      { title: "Legal AI with Citations", description: "RAG pipelines that retrieve from verified legal databases, cite sources accurately, and flag confidence levels so attorneys can trust the output." },
      { title: "Firm-Friendly Onboarding", description: "Self-service trials, SSO integration with legal practice management tools (Clio, MyCase), and migration paths that reduce adoption friction." },
    ],
    "agritech": [
      { title: "Offline-First Architecture", description: "Local-first data storage with conflict resolution and background sync. The app works fully in the field and syncs when connectivity returns." },
      { title: "IoT Telemetry at Scale", description: "Time-series ingestion pipelines that handle millions of sensor readings daily, with alerting, aggregation, and affordable long-term storage." },
      { title: "Feature Phone Support", description: "USSD menu interfaces and SMS-based interactions that reach smallholder farmers without smartphones or reliable data connections." },
      { title: "Supply Chain Traceability", description: "FSMA 204 compliant tracking from farm to fork: lot-level tracing, critical tracking events, and the data architecture that makes recall response fast." },
    ],
    "logistics-tech": [
      { title: "Real-Time Fleet Tracking", description: "Sub-second location updates for 1,000+ vehicles with efficient data pipelines, map rendering, and historical replay for dispatch decisions." },
      { title: "Route Optimization Engine", description: "Constraint-based routing that factors in vehicle capacity, time windows, traffic, driver hours, and priority packages, solved in under 2 seconds." },
      { title: "Offline Driver Apps", description: "Mobile applications that queue deliveries, capture signatures, and record proof-of-delivery without connectivity, syncing transparently when back online." },
      { title: "Last-Mile Intelligence", description: "Address validation, delivery attempt management, customer notification systems, and the exception handling that real-world delivery requires." },
    ],
    "ecommerce": [
      { title: "Headless Commerce Architecture", description: "Next.js frontends, composable backends, and API-first design that lets you outgrow Shopify without rebuilding from scratch." },
      { title: "Checkout Optimization", description: "One-page checkout flows, saved payment methods, address autocomplete, and the micro-interactions that measurably reduce cart abandonment." },
      { title: "Multi-Channel Inventory Sync", description: "Real-time inventory across your website, Amazon, retail POS, and warehouse systems. No overselling, no manual reconciliation." },
      { title: "Performance Engineering", description: "Sub-2-second page loads through image optimization, edge caching, code splitting, and the Core Web Vitals scores that affect SEO ranking." },
    ],
    "b2b-saas": [
      { title: "Multi-Tenant Architecture", description: "Proper data isolation between customers with shared infrastructure efficiency. Row-level, schema-level, or database-level depending on your security requirements." },
      { title: "Enterprise Auth (SSO/SCIM)", description: "SAML 2.0, OIDC, and SCIM provisioning that integrates with Okta, Azure AD, and OneLogin. The feature that unblocks $100K+ contracts." },
      { title: "Usage-Based Billing", description: "Metering infrastructure that tracks consumption accurately, integrates with Stripe or Chargebee, and supports hybrid pricing models." },
      { title: "Audit & Compliance Layer", description: "Immutable audit logs, role-based access control, and the compliance documentation that enterprise security reviews demand." },
    ],
    "consumer-apps": [
      { title: "Retention-First Onboarding", description: "Activation flows that get users to their first value moment in under 60 seconds. Measured by Day-1 and Day-7 retention, not downloads." },
      { title: "Smart Notification System", description: "ML-driven send-time optimization, frequency capping, and preference management that brings users back without triggering uninstalls." },
      { title: "Real-Time Social Infrastructure", description: "Feeds, messaging, reactions, and presence indicators built on WebSocket infrastructure that scales with viral growth." },
      { title: "App Store Optimization", description: "Release management, A/B testing of store listings, review response workflows, and the CI/CD that handles Apple and Google review processes." },
    ],
  };

  if (verticalSolutions[id]) return verticalSolutions[id];

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
  const verticalValueProps: Record<string, StartupValueProp[]> = {
    "fintech": [
      { title: "Compliance Built In", description: "PCI-DSS, SOC 2, and regulatory requirements are architecture decisions, not afterthoughts. Your first audit passes clean." },
      { title: "Engineers Who Know Finance", description: "Our team has shipped payment systems, lending platforms, and banking APIs. We speak your regulator's language." },
      { title: "Fixed Price, Auditable Code", description: "No hourly billing. No surprise invoices. Code your compliance team can review and your QSA can approve." },
      { title: "Production-Grade from Day One", description: "Transaction handling, idempotency, reconciliation, and fraud detection built into the foundation, not patched in later." },
    ],
    "healthtech": [
      { title: "HIPAA as Architecture", description: "Encryption, access controls, and audit trails are structural. Compliance evidence generates automatically, not manually before audits." },
      { title: "EHR Integration Experience", description: "Production-tested FHIR R4 and HL7v2 connectors. We know which vendor endpoints work reliably and which require workarounds." },
      { title: "Patient-Grade UX", description: "Interfaces accessible to elderly patients on tablets and usable by physicians in 30-second intervals between appointments." },
      { title: "Zero PHI Exposure in Dev", description: "Synthetic data pipelines that mirror production schemas. No real patient data ever touches development or staging environments." },
    ],
    "edtech": [
      { title: "Peak-Ready Architecture", description: "Auto-scaling infrastructure that handles enrollment spikes without manual intervention or over-provisioning during quiet periods." },
      { title: "Video Cost Control", description: "Adaptive streaming, multi-CDN strategy, and transcoding optimization that cuts per-student costs 40-60% vs. naive implementations." },
      { title: "Two Personas, One Platform", description: "Separate optimized experiences for instructors and students that share a data layer without compromising either workflow." },
      { title: "Student Data Protection", description: "FERPA and COPPA compliance enforced at the infrastructure level, not just policy documents. Analytics without privacy violations." },
    ],
    "proptech": [
      { title: "Sub-300ms Search", description: "Geospatial indexing and query optimization that returns complex filtered results across millions of listings before users notice latency." },
      { title: "MLS Compliance Built In", description: "Data pipelines that respect licensing restrictions on display, caching, refresh rates, and attribution without manual monitoring." },
      { title: "Multi-Party Coordination", description: "Transaction state machines that keep 6-10 stakeholders synchronized through complex closing processes without missed deadlines." },
      { title: "Real Estate Domain Knowledge", description: "Engineers who understand title, escrow, inspection contingencies, and the regulatory patchwork of property transactions." },
    ],
    "legaltech": [
      { title: "Privilege-Protected by Design", description: "Matter-level data isolation enforced at the database layer. Search, backup, and export cannot cross privilege boundaries." },
      { title: "Accurate Legal AI", description: "RAG pipelines with verified sources and pinpoint citations. Confidence scoring that flags uncertainty so attorneys trust the output." },
      { title: "Jurisdiction-Aware Systems", description: "Template engines and workflow tools that handle the variance between courts, states, and regulatory bodies without code duplication." },
      { title: "Firm Adoption Focused", description: "Zero-training interfaces, practice management integrations, and trial experiences designed for attorneys who bill every 6 minutes." },
    ],
    "agritech": [
      { title: "Offline-First, Always", description: "Full functionality without internet. Local storage, queued operations, and seamless sync when connectivity returns. No data loss, ever." },
      { title: "IoT at Ag-Budget Costs", description: "Time-series pipelines that process millions of sensor readings daily without enterprise-scale infrastructure bills." },
      { title: "Feature Phone Reach", description: "USSD and SMS interfaces that serve farmers on basic handsets. No smartphone required. No data plan required." },
      { title: "Farm-to-Fork Traceability", description: "FSMA 204 compliant architecture with lot-level tracking, critical events, and recall-ready reporting built from the start." },
    ],
    "logistics-tech": [
      { title: "Fleet-Scale Tracking", description: "Sub-second GPS updates for 5,000+ vehicles processed, stored, and rendered on live maps without lag or data loss." },
      { title: "Fast Route Optimization", description: "Constraint-based routing solved in under 2 seconds with time windows, capacity limits, driver hours, and priority handling." },
      { title: "Offline Driver Experience", description: "Delivery queues, navigation, and proof-of-delivery that function fully without connectivity and sync transparently." },
      { title: "Last-Mile Intelligence", description: "Address validation, failed delivery handling, customer notifications, and the exception management real logistics requires." },
    ],
    "ecommerce": [
      { title: "Performance Is Revenue", description: "Sub-2-second page loads, optimized Core Web Vitals, and checkout flows where every removed friction point drives measurable conversion." },
      { title: "Beyond Shopify", description: "Headless architecture that supports custom pricing rules, multi-warehouse fulfillment, and B2B logic that off-the-shelf tools restrict." },
      { title: "Flash Sale Ready", description: "Auto-scaling infrastructure and queue-based checkout that handles 50x normal traffic without dropped orders or degraded experience." },
      { title: "Channel Sync", description: "Real-time inventory across website, marketplaces, and retail POS. No overselling, no manual reconciliation, no lost revenue." },
    ],
    "b2b-saas": [
      { title: "Bulletproof Multi-Tenancy", description: "Data isolation verified continuously with automated testing. One customer can never see another customer's data. Full stop." },
      { title: "Enterprise Feature Set", description: "SSO, SCIM, audit logs, RBAC, and usage billing. The features that unblock six-figure contracts, built correctly the first time." },
      { title: "Accurate Metering", description: "Usage tracking that is precise enough for invoicing and fast enough to not slow your product. Disputes do not happen." },
      { title: "Security-Review Ready", description: "Technical controls and documentation that pass enterprise procurement security questionnaires in 1-2 weeks, not months." },
    ],
    "consumer-apps": [
      { title: "Retention-First Design", description: "Onboarding that gets users to value in under 60 seconds. Measured by Day-7 retention, not downloads or signups." },
      { title: "Smart Notifications", description: "ML-driven send-time optimization, frequency capping, and preference management that re-engages without triggering uninstalls." },
      { title: "Social at Scale", description: "Feeds, messaging, and real-time features on WebSocket infrastructure that handles viral growth without proportional cost scaling." },
      { title: "Store-Ready Releases", description: "CI/CD for mobile with TestFlight distribution, staged rollouts, crash monitoring, and metadata that passes store review consistently." },
    ],
  };

  if (verticalValueProps[id]) return verticalValueProps[id];

  return [
    { title: "Fixed Price, No Surprises", description: "The quote is the price. If scope stays the same, the cost stays the same. Period." },
    { title: "Senior Engineers Only", description: "The team you meet builds your product. No juniors, no handoffs, no bait-and-switch." },
    { title: "Shipped in Weeks", description: "Most projects launch in 4-8 weeks. We move fast without cutting corners on the code that matters." },
    { title: "You Own Everything", description: "Code, designs, IP: yours at every milestone. No vendor lock-in, no licensing fees." },
  ];
}

function generateStats(id: string, category: string): StartupStat[] {
  // Per-entry unique stats for BY VERTICAL
  const verticalStats: Record<string, StartupStat[]> = {
    "fintech": [
      { value: "12+", label: "Fintech Products Shipped" },
      { value: "100%", label: "First-Attempt Audit Pass Rate" },
      { value: "6", label: "Payment Integrations Delivered" },
      { value: "<50ms", label: "Transaction Processing Latency" },
    ],
    "healthtech": [
      { value: "8+", label: "HIPAA-Compliant Platforms Built" },
      { value: "0", label: "Compliance Incidents Post-Launch" },
      { value: "4", label: "EHR Systems Integrated (Epic, Cerner)" },
      { value: "99.95%", label: "Uptime on Patient-Facing Systems" },
    ],
    "edtech": [
      { value: "500K+", label: "Concurrent Learners Supported" },
      { value: "60%", label: "Streaming Cost Reduction Achieved" },
      { value: "5x", label: "Peak Traffic Handled Without Downtime" },
      { value: "3", label: "Platforms Serving 100K+ Students" },
    ],
    "proptech": [
      { value: "<200ms", label: "Average Property Search Response" },
      { value: "6", label: "MLS Integrations Delivered" },
      { value: "10M+", label: "Listings Indexed and Searchable" },
      { value: "4", label: "Multi-Party Transaction Systems Built" },
    ],
    "legaltech": [
      { value: "5+", label: "Legal Platforms Shipped" },
      { value: "90%", label: "Document Automation Accuracy" },
      { value: "50+", label: "Jurisdiction Variants Supported" },
      { value: "3x", label: "Faster Contract Generation vs Manual" },
    ],
    "agritech": [
      { value: "2M+", label: "Daily IoT Data Points Processed" },
      { value: "100%", label: "Offline-First Reliability" },
      { value: "4", label: "USSD/SMS Systems Deployed" },
      { value: "6", label: "Supply Chain Traceability Systems Built" },
    ],
    "logistics-tech": [
      { value: "5,000+", label: "Vehicles Tracked in Real-Time" },
      { value: "<2s", label: "Route Optimization Response" },
      { value: "99.9%", label: "Sync Accuracy (Offline to Cloud)" },
      { value: "30%", label: "Average Delivery Cost Reduction" },
    ],
    "ecommerce": [
      { value: "1.4s", label: "Average Page Load (Client Sites)" },
      { value: "23%", label: "Average Conversion Lift Achieved" },
      { value: "8+", label: "Headless Commerce Builds Delivered" },
      { value: "$50M+", label: "Annual GMV Processed by Our Builds" },
    ],
    "b2b-saas": [
      { value: "15+", label: "Multi-Tenant Platforms Shipped" },
      { value: "100%", label: "Data Isolation Across All Builds" },
      { value: "3", label: "Avg. Weeks to Add Enterprise SSO" },
      { value: "5x", label: "Faster Enterprise Deal Closure" },
    ],
    "consumer-apps": [
      { value: "40%+", label: "Day-7 Retention (Best Client)" },
      { value: "10M+", label: "Push Notifications Sent Monthly" },
      { value: "3", label: "Apps That Hit 1M+ Downloads" },
      { value: "<60s", label: "Time to First Value (Onboarding)" },
    ],
  };

  if (verticalStats[id]) return verticalStats[id];

  const statPools: StartupStat[][] = [
    [{ value: "4-8", label: "Weeks to Launch" }, { value: "50+", label: "Startups Shipped" }, { value: "97%", label: "On-Time Delivery" }, { value: "0", label: "Hidden Fees" }],
    [{ value: "40%", label: "Cost Savings vs In-House" }, { value: "5", label: "Countries Served" }, { value: "30+", label: "Happy Founders" }, { value: "2x", label: "Faster Than Average" }],
    [{ value: "100%", label: "IP Ownership" }, { value: "24h", label: "Response Time" }, { value: "4.9/5", label: "Client Rating" }, { value: "85%", label: "Repeat Clients" }],
  ];
  const hash = simpleHash(id);
  return statPools[hash % statPools.length];
}

function generateServiceApplications(id: string, category: string): StartupServiceApplication[] {
  const verticalServices: Record<string, StartupServiceApplication[]> = {
    "fintech": [
      { serviceName: "Payment Platform Development", slug: "websites", description: "PCI-DSS compliant payment infrastructure", applicationDetail: "We build payment processing systems with tokenization, fraud scoring, and multi-rail support (ACH, wire, card, crypto) that pass compliance audits on the first attempt." },
      { serviceName: "Banking API Integration", slug: "apps", description: "Plaid, Stripe Connect, and Open Banking connectors", applicationDetail: "Pre-tested integration patterns for account linking, balance verification, and transaction history that handle the edge cases documentation skips." },
      { serviceName: "Compliance Dashboard Design", slug: "ux-ui-design", description: "Regulatory reporting and monitoring interfaces", applicationDetail: "Admin interfaces that surface compliance status, flag suspicious activity, and generate the reports regulators actually ask for." },
      { serviceName: "Financial Infrastructure", slug: "devops", description: "High-availability transaction processing", applicationDetail: "Zero-downtime deployment pipelines, database replication, and disaster recovery for systems where a minute of downtime means lost money." },
    ],
    "healthtech": [
      { serviceName: "Telehealth Platform Development", slug: "websites", description: "HIPAA-compliant video and patient management", applicationDetail: "WebRTC video consultation with waiting rooms, screen sharing, HIPAA-compliant recording, and automatic failover to phone when bandwidth drops." },
      { serviceName: "EHR Integration", slug: "apps", description: "FHIR R4 and HL7v2 system connectors", applicationDetail: "Bi-directional data exchange with Epic, Cerner, Allscripts, and Athenahealth, handling the vendor-specific quirks that only show up in production." },
      { serviceName: "Patient Experience Design", slug: "ux-ui-design", description: "Accessible, clinical-grade interfaces", applicationDetail: "Interfaces that work for 80-year-old patients on tablets and 30-year-old physicians between appointments. WCAG AA compliant, health-literate." },
      { serviceName: "HIPAA Infrastructure", slug: "devops", description: "Compliant cloud architecture and monitoring", applicationDetail: "AWS/GCP configurations with encryption at rest, in transit, and in logs. BAA-covered infrastructure with automated compliance evidence collection." },
    ],
    "edtech": [
      { serviceName: "Learning Platform Development", slug: "websites", description: "Scalable LMS and course delivery systems", applicationDetail: "Course creation tools, progress tracking, assessment engines, and adaptive learning paths that handle 500K concurrent users during peak enrollment." },
      { serviceName: "Mobile Learning Apps", slug: "apps", description: "Offline-capable educational apps", applicationDetail: "Download-and-learn mobile experiences with offline video playback, progress sync, and push notifications that drive daily learning habits." },
      { serviceName: "Educator Dashboard Design", slug: "ux-ui-design", description: "Teaching and analytics interfaces", applicationDetail: "Instructor tools for content creation, student progress monitoring, and intervention alerts designed for educators who have 5 minutes between classes." },
      { serviceName: "Streaming Infrastructure", slug: "devops", description: "Cost-optimized video delivery at scale", applicationDetail: "Adaptive bitrate transcoding, multi-CDN strategy, and caching that keeps per-student streaming costs under control as you scale." },
    ],
    "proptech": [
      { serviceName: "Property Platform Development", slug: "websites", description: "Listing, search, and transaction systems", applicationDetail: "MLS-compliant property search with geospatial queries, saved searches, alerts, and the listing detail pages that convert browsers into leads." },
      { serviceName: "Transaction Management", slug: "apps", description: "Multi-party real estate workflow tools", applicationDetail: "Digital closing platforms that coordinate documents, signatures, and approvals across buyers, sellers, agents, lenders, and title companies." },
      { serviceName: "Property Search UX", slug: "ux-ui-design", description: "Map-based interfaces and listing design", applicationDetail: "Map interfaces with draw-to-search, instant filters, and property cards optimized for the browsing patterns real estate searchers actually use." },
      { serviceName: "Geospatial Infrastructure", slug: "devops", description: "High-performance location-based systems", applicationDetail: "PostGIS indexing, tile servers, and caching strategies that return complex geospatial queries in under 200ms across millions of listings." },
    ],
    "legaltech": [
      { serviceName: "Legal Platform Development", slug: "websites", description: "Case management and document systems", applicationDetail: "Matter management, document assembly, time tracking, and billing systems built for the workflows that legal professionals actually follow." },
      { serviceName: "Contract Automation", slug: "apps", description: "Intelligent document generation", applicationDetail: "Template engines with conditional logic, defined-term management, jurisdiction detection, and clause libraries that generate accurate legal documents in seconds." },
      { serviceName: "Legal Workflow Design", slug: "ux-ui-design", description: "Attorney-facing interface design", applicationDetail: "Interfaces designed for attorneys billing in 6-minute increments. Every click justified, every screen earning its real estate against the billable hour." },
      { serviceName: "Privilege-Protected Infrastructure", slug: "devops", description: "Encrypted, access-controlled systems", applicationDetail: "Data architecture where privilege boundaries are enforced at the infrastructure level, with audit trails that prove chain of custody." },
    ],
    "agritech": [
      { serviceName: "Farm Management Platform", slug: "websites", description: "Crop planning, monitoring, and analytics", applicationDetail: "Web dashboards that aggregate field sensor data, satellite imagery, and weather forecasts into actionable recommendations for farm managers." },
      { serviceName: "Field Worker Apps", slug: "apps", description: "Offline-first mobile tools for agriculture", applicationDetail: "Mobile apps that work without connectivity in the field: scouting reports, spray logs, harvest tracking, with background sync when connectivity returns." },
      { serviceName: "USSD Interface Design", slug: "ux-ui-design", description: "Feature phone menu systems", applicationDetail: "USSD menu flows and SMS interactions designed for smallholder farmers who access markets, weather, and advisory services from basic handsets." },
      { serviceName: "IoT Data Infrastructure", slug: "devops", description: "Sensor telemetry and time-series pipelines", applicationDetail: "Ingestion pipelines for soil sensors, weather stations, and drone imagery that process millions of data points daily at agricultural-budget costs." },
    ],
    "logistics-tech": [
      { serviceName: "Fleet Management Platform", slug: "websites", description: "Real-time tracking and dispatch systems", applicationDetail: "Live fleet dashboards with vehicle status, driver assignment, route visualization, and the exception management that dispatchers need in real-time." },
      { serviceName: "Driver Mobile App", slug: "apps", description: "Offline-capable delivery and routing apps", applicationDetail: "Turn-by-turn navigation, delivery queue management, proof-of-delivery capture, and customer notifications that work offline in tunnels and basements." },
      { serviceName: "Logistics UX Design", slug: "ux-ui-design", description: "Dispatch and driver interface design", applicationDetail: "Split interfaces: dispatcher dashboards for fleet overview and exception handling, and driver apps optimized for one-handed use while standing." },
      { serviceName: "Tracking Infrastructure", slug: "devops", description: "High-frequency GPS and sync systems", applicationDetail: "Sub-second location update processing for thousands of vehicles, with efficient storage, replay capability, and alerting on geofence events." },
    ],
    "ecommerce": [
      { serviceName: "Headless Commerce Development", slug: "websites", description: "Custom storefront and backend systems", applicationDetail: "Next.js storefronts with composable commerce backends: product catalog, cart, checkout, and order management decoupled for maximum performance." },
      { serviceName: "Shopping Mobile Apps", slug: "apps", description: "Native commerce experiences", applicationDetail: "Mobile shopping apps with one-tap checkout, saved preferences, personalized recommendations, and push notifications timed to buying patterns." },
      { serviceName: "Conversion-Optimized Design", slug: "ux-ui-design", description: "Checkout and product page design", applicationDetail: "Product pages, collection layouts, and checkout flows A/B tested and optimized for the metrics that actually drive revenue: add-to-cart rate and checkout completion." },
      { serviceName: "Commerce Infrastructure", slug: "devops", description: "High-performance, high-availability stores", applicationDetail: "Edge caching, image optimization pipelines, and auto-scaling that keeps page loads under 2 seconds during flash sales and holiday traffic." },
    ],
    "b2b-saas": [
      { serviceName: "SaaS Platform Development", slug: "websites", description: "Multi-tenant application architecture", applicationDetail: "Core platform with tenant isolation, admin consoles, usage dashboards, and the self-serve onboarding that converts free trials into paid subscriptions." },
      { serviceName: "Enterprise Feature Development", slug: "apps", description: "SSO, SCIM, and compliance features", applicationDetail: "SAML/OIDC authentication, SCIM user provisioning, audit logging, and role-based access control that unblock enterprise procurement processes." },
      { serviceName: "SaaS Dashboard Design", slug: "ux-ui-design", description: "Admin, analytics, and settings interfaces", applicationDetail: "Product dashboards, settings panels, and admin tools designed for the daily-use patterns of B2B software where users spend hours, not minutes." },
      { serviceName: "Multi-Tenant Infrastructure", slug: "devops", description: "Isolated, scalable SaaS hosting", applicationDetail: "Tenant-aware infrastructure with data isolation guarantees, per-tenant resource limits, and deployment pipelines that ship to all tenants or one at a time." },
    ],
    "consumer-apps": [
      { serviceName: "Consumer App Development", slug: "websites", description: "Engagement-optimized application platforms", applicationDetail: "Backend services for feeds, profiles, notifications, and the real-time features (chat, reactions, live updates) that drive daily active usage." },
      { serviceName: "iOS & Android Apps", slug: "apps", description: "Native consumer mobile experiences", applicationDetail: "Polished mobile apps with gesture-driven navigation, smooth animations, offline caching, and the 60fps performance users expect from top-tier apps." },
      { serviceName: "Growth-Focused Design", slug: "ux-ui-design", description: "Retention and engagement UX", applicationDetail: "Onboarding flows, notification preferences, and social features designed around behavioral psychology and measured by Day-7 retention, not aesthetics." },
      { serviceName: "Real-Time Infrastructure", slug: "devops", description: "WebSocket and push notification systems", applicationDetail: "Scalable WebSocket infrastructure, push notification pipelines with delivery tracking, and the event-driven architecture that real-time social features require." },
    ],
  };

  if (verticalServices[id]) return verticalServices[id];

  return [
    { serviceName: "Custom Software Development", slug: "websites", description: "Full-stack web application development", applicationDetail: "We build your core product using modern frameworks (React, Next.js, Node.js) with clean architecture that scales." },
    { serviceName: "Mobile Apps Development", slug: "apps", description: "iOS and Android application development", applicationDetail: "Cross-platform mobile apps in React Native that share 90% of code between platforms while feeling native." },
    { serviceName: "UX & UI Design", slug: "ux-ui-design", description: "User experience and interface design", applicationDetail: "Research-driven design that converts users, with prototypes tested before a line of production code is written." },
    { serviceName: "DevOps Consulting", slug: "devops", description: "Infrastructure and deployment automation", applicationDetail: "CI/CD pipelines, infrastructure-as-code, and monitoring that makes deployments boring and reliable." },
  ];
}

function generateDeepDive(id: string, title: string): StartupDeepDiveSection[] {
  const verticalDeepDive: Record<string, StartupDeepDiveSection[]> = {
    "fintech": [
      {
        title: "Building Financial Software That Passes Audits",
        content: [
          "We start every fintech project by mapping your regulatory surface: which jurisdictions, which license types, which compliance frameworks apply. This shapes every architecture decision that follows.",
          "Data flows are designed with PCI-DSS scope minimization in mind. Tokenization, network segmentation, and access controls are structural, not bolted on. Your QSA sees a system that was built for compliance, not retrofitted.",
          "We implement transaction monitoring, suspicious activity detection, and the audit trails that regulators expect. When your compliance officer needs evidence, the system produces it automatically.",
          "Every financial integration (Plaid, Stripe, banking rails) is wrapped with idempotency, retry logic, and reconciliation. Money never gets lost, even when APIs fail mid-transaction.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building compliant fintech infrastructure",
      },
      {
        title: "From Sandbox to Production: The Path We Have Walked Before",
        content: [
          "Sandbox APIs behave nothing like production. Rate limits differ, error codes change, and edge cases multiply. We test against production-like conditions from week one so launch day is predictable.",
          "We build observability into financial systems from the start: transaction success rates, latency percentiles, error categorization, and the alerting that wakes someone up before customers notice.",
          "Scaling financial systems means handling burst traffic (payday, month-end) without degrading transaction latency. Our architecture handles 10x spikes without provisioning 10x infrastructure year-round.",
          "When you are ready for your next funding round, we produce the technical documentation, security posture report, and architecture diagrams that institutional investors and their technical due diligence teams expect.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Fintech product scaling from sandbox to production",
      },
    ],
    "healthtech": [
      {
        title: "HIPAA Compliance as Architecture, Not Paperwork",
        content: [
          "We map every data flow in your system to determine what constitutes PHI and where it travels. This drives encryption boundaries, access control decisions, and infrastructure choices.",
          "Our HIPAA architecture pattern includes: encryption at rest (AES-256), in transit (TLS 1.3), field-level encryption for sensitive identifiers, and audit logging that captures every access event without impacting performance.",
          "BAA agreements with AWS, GCP, and every subprocessor are handled upfront. We maintain a template library of BAA-compatible infrastructure configurations so setup takes days, not months.",
          "When your compliance officer or a covered entity asks for evidence, your system produces it: access logs, encryption status, backup verification, and incident response documentation, all generated automatically.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack implementing HIPAA-compliant healthcare architecture",
      },
      {
        title: "Clinical Workflows That Actually Get Adopted",
        content: [
          "Healthcare software fails when it adds friction to clinical workflows. We observe how physicians, nurses, and administrators actually work before designing a single screen.",
          "EHR integrations are the hardest part of healthtech. We have production experience with Epic (FHIR R4), Cerner (Millennium), and Allscripts. We know which endpoints work reliably and which require workarounds.",
          "Patient-facing interfaces must serve users from age 18 to 85, across literacy levels. We design with progressive disclosure: simple by default, detailed when needed, accessible to assistive technology throughout.",
          "Telehealth requires more than video: scheduling, intake forms, waiting rooms, provider handoff, session recording (encrypted), and the failover to phone that maintains continuity when bandwidth drops.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Healthcare UX designed for clinical adoption",
      },
    ],
    "edtech": [
      {
        title: "Engineering for the Enrollment Spike",
        content: [
          "Education traffic is the most predictable unpredictable load: you know September is coming, but you do not know if 50,000 or 500,000 students will hit your platform on day one.",
          "We architect EdTech platforms with auto-scaling that responds in minutes, not hours. Stateless services, CDN-cached content, and database read replicas that spin up before the load arrives.",
          "Video is the largest cost center for EdTech at scale. We implement adaptive bitrate streaming, efficient transcoding pipelines, and multi-CDN strategies that cut per-student costs by 40-60% compared to naive implementations.",
          "Assessment engines must handle thousands of simultaneous submissions without data loss or timeout errors. Our queuing architecture processes submissions reliably even under extreme concurrent load.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building scalable education platforms",
      },
      {
        title: "Two Products in One: Serving Teachers and Students",
        content: [
          "EdTech platforms serve two user types with conflicting needs. Instructors need complex content creation tools. Students need simple, distraction-free learning experiences. Building one without degrading the other is an architecture problem.",
          "We separate instructor and learner experiences at the component level while sharing the same data layer. Course content created in the instructor UI renders instantly in the student experience without duplicating data.",
          "FERPA compliance constrains how student data flows through your system. We implement directory information separation, parental consent workflows, and data retention policies at the infrastructure level.",
          "Engagement features (streaks, leaderboards, peer discussion) are built with configurable privacy controls so institutions can enable what fits their pedagogy and disable what does not.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Dual-persona EdTech interface design",
      },
    ],
    "proptech": [
      {
        title: "Property Search That Feels Instant",
        content: [
          "Users expect property search to feel like Google Maps: pan, zoom, filter, and results appear instantly. This requires geospatial indexing (PostGIS), aggressive caching, and query optimization that most agencies never implement.",
          "MLS data feeds have strict rules: refresh intervals, attribution requirements, display restrictions, and data retention limits. We build ingestion pipelines that maintain compliance while keeping your search index current.",
          "Saved searches with real-time alerts drive engagement. When a new listing matches a buyer's criteria, they should know within minutes, not hours. Our event-driven architecture makes this scale to millions of saved searches.",
          "Property detail pages must load in under 2 seconds with high-resolution imagery, virtual tours, and neighborhood data. We optimize image delivery, lazy-load heavy content, and pre-fetch predictable next pages.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building high-performance property search",
      },
      {
        title: "Coordinating the Most Complex Transaction in Consumer Finance",
        content: [
          "A real estate transaction involves buyers, sellers, both agents, lenders, inspectors, appraisers, title companies, and attorneys. Each has their own timeline, documents, and approval requirements.",
          "We model transactions as state machines with parallel workflows. The inspection timeline runs independently of the loan approval timeline, but both must complete before closing. Our system tracks all of it.",
          "Digital signatures in real estate must comply with E-SIGN and UETA regulations. We integrate with DocuSign and Dotloop while maintaining audit trails that satisfy title insurance requirements.",
          "Escrow and earnest money tracking require precision. We build financial transaction logging that produces the documentation title companies and regulators need for every dollar that moves.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Multi-party real estate transaction coordination",
      },
    ],
    "legaltech": [
      {
        title: "Building for Privilege and Confidentiality",
        content: [
          "Attorney-client privilege is not just an access control rule. It shapes database schema design, search indexing, backup strategies, and who on our team can even access production data during development.",
          "We implement matter-level isolation: data belonging to one client matter cannot be accessed, searched, or leaked into results for another matter. This constraint is enforced at the database query level, not just the UI.",
          "Conflict checking in law firms requires searching across matters without revealing privileged details. We build systems that flag potential conflicts while maintaining information barriers between practice groups.",
          "When opposing counsel subpoenas your client's records, your system must produce exactly what is required and nothing more. Our metadata tagging and retention policies make targeted production straightforward.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building privilege-protected legal systems",
      },
      {
        title: "Legal AI That Attorneys Will Actually Trust",
        content: [
          "Lawyers will not use AI that hallucinates. A fabricated case citation can result in Rule 11 sanctions. Our RAG pipelines retrieve only from verified legal databases and cite every source with pinpoint references.",
          "We build confidence scoring into every AI output. When the system is uncertain, it says so explicitly. Attorneys see exactly which sources informed each conclusion and can verify before relying on it.",
          "Document automation in law requires more than mail merge. Conditional clauses, jurisdiction-specific language, defined-term consistency, and cross-reference integrity must all be maintained across 50+ page agreements.",
          "Law firm technology adoption is slow by design. Attorneys are risk-averse professionals. Our onboarding flows require zero training, integrate with existing practice management tools, and prove value within a free trial period.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Legal AI with accurate citation and confidence scoring",
      },
    ],
    "agritech": [
      {
        title: "Software That Works Where There Is No Internet",
        content: [
          "Standard web architecture assumes constant connectivity. Agriculture does not have that luxury. Our offline-first approach stores all critical data locally, queues operations, and syncs when connectivity is available.",
          "Conflict resolution in offline-first systems is hard. When two field workers update the same record offline, we use last-write-wins with audit trails, or domain-specific merge strategies depending on the data type.",
          "USSD interfaces are the primary digital access point for millions of smallholder farmers. We design menu trees that deliver market prices, weather alerts, and advisory services in under 5 navigation steps on any basic phone.",
          "SMS-based systems complement USSD for asynchronous communication: delivery confirmations, payment receipts, and weather alerts that reach farmers regardless of their handset capabilities.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building offline-first agricultural software",
      },
      {
        title: "From Sensor to Decision: IoT Data That Drives Action",
        content: [
          "Agricultural IoT generates massive data volumes: soil moisture every 15 minutes across thousands of sensors adds up to millions of data points daily. We build time-series pipelines that ingest, aggregate, and alert at agricultural-budget costs.",
          "Raw sensor data is useless to farmers. We transform telemetry into actionable recommendations: when to irrigate, when to apply inputs, when to harvest. The intelligence layer sits between raw data and farm decisions.",
          "FSMA 204 food traceability requires tracking produce from seed to shelf. We build the critical tracking event architecture, lot-level identification, and supplier data systems that make recall response fast and auditable.",
          "Hardware reliability in agriculture is poor: sensors get damaged by weather, animals, and machinery. Our systems detect sensor failures automatically, alert maintenance teams, and degrade gracefully when data gaps occur.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "IoT data pipeline from field sensors to farm decisions",
      },
    ],
    "logistics-tech": [
      {
        title: "Real-Time Tracking at Fleet Scale",
        content: [
          "Tracking 5,000 vehicles with sub-second location updates means processing 300,000+ GPS points per minute. We build ingestion pipelines that handle this load without dropping data or introducing display lag.",
          "Map rendering for large fleets requires clustering, viewport-based loading, and efficient WebSocket updates. Dispatchers see live positions without their browser consuming gigabytes of memory.",
          "Historical route replay is critical for dispute resolution, driver performance analysis, and compliance documentation. We store GPS histories efficiently and render them on-demand without impacting live tracking performance.",
          "Geofencing at scale (thousands of delivery zones, warehouses, restricted areas) requires spatial indexing that evaluates fence membership in microseconds per vehicle update. Our architecture handles this without dedicated hardware.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building real-time fleet tracking systems",
      },
      {
        title: "The Last Mile: Where Logistics Gets Hard",
        content: [
          "Last-mile delivery introduces problems that line-haul logistics never faces: ambiguous addresses, locked apartment buildings, absent recipients, and the proof-of-delivery requirements that prevent disputes.",
          "Route optimization for delivery drivers is not just shortest-path. Time windows, vehicle capacity, package fragility, customer priority, and driver break requirements all factor into every route calculation.",
          "Driver apps must work with one hand while standing. Large touch targets, voice-guided navigation, swipe-to-complete workflows, and photo capture for proof-of-delivery, all functioning without connectivity.",
          "Customer communication (ETA updates, delivery confirmation, failed-attempt notices) must be automated, accurate, and timely. We build notification pipelines that track delivery state and communicate proactively.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Last-mile delivery technology and driver applications",
      },
    ],
    "ecommerce": [
      {
        title: "When Shopify Is No Longer Enough",
        content: [
          "You outgrow Shopify when your business logic cannot fit in Liquid templates: custom pricing rules, B2B wholesale tiers, subscription bundles, or multi-warehouse fulfillment logic that native apps cannot handle.",
          "Headless commerce separates your storefront from your commerce engine. Next.js delivers sub-second page loads while your backend handles the complex business rules that off-the-shelf platforms restrict.",
          "Migration from Shopify to headless does not have to be a big-bang rewrite. We move storefront pages incrementally, keeping your revenue flowing while the new architecture comes online section by section.",
          "The hidden cost of headless commerce is the operational tooling: content management, promotion scheduling, and merchandising interfaces that non-technical staff use daily. We build these admin tools alongside the storefront.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building headless commerce platforms",
      },
      {
        title: "Performance Is Revenue",
        content: [
          "A 1-second improvement in page load drives 7% more conversions. For a $10M/year store, that is $700K in revenue from infrastructure optimization alone. We measure everything in dollars, not milliseconds.",
          "Core Web Vitals directly affect your Google ranking. LCP under 2.5s, FID under 100ms, CLS under 0.1. We optimize images, fonts, third-party scripts, and layout shifts to hit these targets on every page.",
          "Flash sales and product drops create traffic spikes that crash unprepared stores. Our architecture handles 50x normal traffic with auto-scaling, edge caching, and queue-based checkout that converts even under extreme load.",
          "Checkout optimization is where the money is. Every field removed, every click eliminated, every trust signal added measurably affects completion rates. We A/B test checkout changes and measure revenue impact directly.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "E-commerce performance optimization and conversion engineering",
      },
    ],
    "b2b-saas": [
      {
        title: "Multi-Tenancy Done Right",
        content: [
          "Multi-tenancy is the most consequential architecture decision in B2B SaaS. Row-level isolation is cheapest but hardest to secure. Schema-level is safer but costlier to manage. Database-level is most isolated but most expensive. We help you choose correctly.",
          "Data isolation failures end companies. One customer seeing another customer's data triggers breach notifications, contract terminations, and reputational damage. We implement isolation at the query layer with automated testing that verifies boundaries continuously.",
          "Tenant-aware operations (migrations, feature flags, billing) require tooling that most teams build ad-hoc and break regularly. We implement tenant management as a first-class system concern from the start.",
          "The largest tenants will demand dedicated infrastructure. Your architecture needs to support both shared-pool tenants and isolated enterprise deployments without maintaining two separate codebases.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building multi-tenant SaaS architecture",
      },
      {
        title: "Enterprise Features That Close Deals",
        content: [
          "Enterprise procurement has a checklist. SAML SSO, SCIM provisioning, audit logs, RBAC, and data residency options. Missing any one of these can block a six-figure deal for months. We build them all.",
          "SSO implementation seems simple until you handle: IdP-initiated login, just-in-time provisioning, group-to-role mapping, and the edge cases where Okta, Azure AD, and OneLogin each behave differently.",
          "Usage-based billing requires accurate metering, invoice generation, and the grace periods and notifications that prevent enterprise customers from being surprised. We integrate with Stripe, Chargebee, or build custom.",
          "Enterprise audit requirements mean every data change must be traceable: who changed what, when, from where, and why. Our immutable event log captures this without degrading application performance.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Enterprise SaaS features: SSO, billing, and compliance",
      },
    ],
    "consumer-apps": [
      {
        title: "Retention Is the Only Metric That Matters",
        content: [
          "Getting downloads is a marketing problem. Keeping users past Day 7 is an engineering and design problem. We build onboarding flows that get users to their first value moment in under 60 seconds.",
          "The activation moment differs for every app. For social apps it is adding a friend. For productivity apps it is completing a first task. We identify yours, instrument it, and optimize every step leading to it.",
          "Push notifications are the highest-leverage retention tool and the fastest way to get uninstalled. We build frequency-capped, preference-aware notification systems with ML-driven send-time optimization.",
          "Habit loops (trigger, action, reward, investment) are not just psychology theory. We implement them as product features: streaks, progress indicators, social validation, and personalized content that creates daily usage patterns.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building retention-focused consumer apps",
      },
      {
        title: "Scaling Social Features Without Scaling Costs Linearly",
        content: [
          "Social features (feeds, messaging, reactions) scale non-linearly: 10x users does not mean 10x infrastructure cost, it means 100x connection complexity. Our architecture handles viral growth without proportional cost growth.",
          "Real-time messaging requires WebSocket infrastructure that maintains millions of concurrent connections while delivering messages in under 200ms. We build on proven infrastructure (Redis Pub/Sub, managed WebSocket services) and scale horizontally.",
          "Content feeds must balance recency, relevance, and engagement without the algorithmic complexity that only makes sense at Facebook scale. We build feeds that feel personal with pragmatic ranking approaches.",
          "App store releases add 2-7 days to every deployment cycle. Our mobile CI/CD pipeline handles TestFlight distribution, staged rollouts, crash monitoring, and the metadata optimization that affects store ranking.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "Consumer app social features and real-time infrastructure",
      },
    ],
  };

  if (verticalDeepDive[id]) return verticalDeepDive[id];

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
  const verticalDetails: Record<string, string[]> = {
    "fintech": [
      "Senior engineers with prior fintech and compliance experience",
      "PCI-DSS scope analysis and architecture review in week one",
      "Integration testing against live sandbox APIs from day one",
      "Security-focused code review on every pull request",
      "Pre-audit readiness assessment before compliance review",
      "Post-launch transaction monitoring and alerting setup",
    ],
    "healthtech": [
      "Engineers experienced with HIPAA technical safeguards",
      "BAA agreements handled with all infrastructure vendors upfront",
      "EHR integration specialists available for FHIR/HL7 work",
      "PHI data flow mapping before architecture decisions are finalized",
      "Automated compliance evidence generation from day one",
      "Post-launch security monitoring and incident response plan",
    ],
    "edtech": [
      "Engineers experienced with high-traffic educational platforms",
      "Load testing at 5x projected peak enrollment traffic",
      "Video streaming cost analysis and optimization strategy",
      "FERPA compliance review of all data flows",
      "Separate UX testing with both instructor and student personas",
      "Scalability report with cost projections at 10x current scale",
    ],
    "proptech": [
      "Engineers with MLS integration and geospatial search experience",
      "Property search performance benchmarking (target: sub-300ms)",
      "MLS compliance review before any data is displayed publicly",
      "Multi-party workflow modeling before development begins",
      "Real estate transaction state machine documentation",
      "Post-launch performance monitoring on search latency",
    ],
    "legaltech": [
      "Engineers who understand privilege requirements and legal workflows",
      "Privilege boundary analysis before architecture decisions",
      "Document automation accuracy testing against sample filings",
      "Integration testing with practice management systems (Clio, MyCase)",
      "Jurisdiction-specific logic validation with legal domain experts",
      "Information barrier testing between practice groups and matters",
    ],
    "agritech": [
      "Engineers experienced with offline-first and IoT architectures",
      "Offline sync conflict resolution strategy documented upfront",
      "USSD/SMS interface testing on actual feature phone hardware",
      "IoT data pipeline cost modeling at projected sensor scale",
      "Field testing in low-connectivity environments",
      "FSMA 204 traceability requirement mapping before design",
    ],
    "logistics-tech": [
      "Engineers experienced with real-time tracking and fleet systems",
      "GPS data pipeline load testing at projected fleet scale",
      "Route optimization algorithm benchmarking against known solutions",
      "Offline driver app testing in connectivity dead zones",
      "Geofencing performance testing at 10,000+ zone scale",
      "Integration with existing TMS and WMS systems as needed",
    ],
    "ecommerce": [
      "Engineers experienced with headless commerce and high-traffic stores",
      "Page load performance budget defined before design begins",
      "Checkout conversion baseline measurement and optimization targets",
      "Inventory sync strategy documented for all sales channels",
      "Flash sale load testing at 50x normal traffic",
      "Core Web Vitals monitoring and alerting from launch day",
    ],
    "b2b-saas": [
      "Engineers experienced with multi-tenant architecture at scale",
      "Tenant isolation verification testing on every deployment",
      "SSO integration testing against Okta, Azure AD, and OneLogin",
      "Usage metering accuracy validation against billing records",
      "Enterprise security questionnaire responses prepared during build",
      "Tenant migration tooling for moving between isolation levels",
    ],
    "consumer-apps": [
      "Engineers experienced with high-retention consumer applications",
      "Onboarding funnel instrumentation from first build",
      "Push notification delivery and engagement analytics from launch",
      "App store submission process managed through first approval",
      "Day-1 and Day-7 retention measurement infrastructure",
      "Real-time feature load testing at projected viral growth rates",
    ],
  };

  if (verticalDetails[id]) return verticalDetails[id];

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
  const verticalDeliverables: Record<string, string[]> = {
    "fintech": [
      "PCI-DSS compliant application deployed to BAA-covered infrastructure",
      "Complete source code with security audit documentation",
      "Compliance evidence package (encryption, access logs, network diagrams)",
      "Payment integration documentation with error handling playbook",
      "Automated security scanning and vulnerability monitoring pipeline",
      "Incident response runbook for financial transaction failures",
    ],
    "healthtech": [
      "HIPAA-compliant application deployed to BAA-covered infrastructure",
      "Complete source code with PHI data flow documentation",
      "BAA agreements and compliance evidence package for all vendors",
      "EHR integration documentation with HL7/FHIR endpoint specifications",
      "Automated audit log generation and access monitoring",
      "Security incident response plan meeting HIPAA breach notification requirements",
    ],
    "edtech": [
      "Auto-scaling platform deployed and load-tested at 5x peak projections",
      "Complete source code with dual-persona UX documentation",
      "Video streaming infrastructure with cost optimization report",
      "FERPA compliance documentation and data flow diagrams",
      "Instructor and student onboarding guides",
      "Performance monitoring dashboard with enrollment spike alerting",
    ],
    "proptech": [
      "Production platform with sub-300ms search deployed and benchmarked",
      "Complete source code with MLS compliance documentation",
      "Geospatial search architecture and optimization documentation",
      "Transaction workflow state machine documentation",
      "MLS data refresh and compliance monitoring automation",
      "Property search performance monitoring and alerting pipeline",
    ],
    "legaltech": [
      "Privilege-protected application with matter-level data isolation",
      "Complete source code with privilege boundary documentation",
      "Document automation template system with jurisdiction configuration guides",
      "Legal AI pipeline documentation with source citation accuracy metrics",
      "Practice management system integration specifications",
      "Privilege audit trail and access monitoring documentation",
    ],
    "agritech": [
      "Offline-first application tested in low-connectivity environments",
      "Complete source code with sync conflict resolution documentation",
      "IoT data pipeline with telemetry ingestion and alerting configuration",
      "USSD/SMS interface specifications and menu flow documentation",
      "FSMA 204 traceability architecture and compliance documentation",
      "Sensor failure detection and data gap handling documentation",
    ],
    "logistics-tech": [
      "Real-time tracking platform deployed and load-tested at fleet scale",
      "Complete source code with GPS pipeline architecture documentation",
      "Route optimization engine with algorithm documentation and benchmarks",
      "Offline driver app with sync documentation and conflict resolution specs",
      "Geofencing configuration tools and alerting setup",
      "Fleet operations dashboard with dispatch workflow documentation",
    ],
    "ecommerce": [
      "Headless commerce platform with sub-2-second page loads verified",
      "Complete source code with commerce architecture documentation",
      "Checkout flow with conversion tracking and A/B testing infrastructure",
      "Multi-channel inventory sync with reconciliation documentation",
      "Performance monitoring dashboard (Core Web Vitals, conversion rates)",
      "Flash sale and high-traffic runbook with auto-scaling configuration",
    ],
    "b2b-saas": [
      "Multi-tenant platform with verified data isolation between all tenants",
      "Complete source code with tenant architecture documentation",
      "SSO integration (SAML/OIDC) with IdP configuration guides",
      "Usage metering and billing integration with reconciliation documentation",
      "Enterprise security questionnaire response package",
      "Tenant management tooling and operational runbooks",
    ],
    "consumer-apps": [
      "iOS and Android apps approved and published to stores",
      "Complete source code with retention architecture documentation",
      "Push notification system with preference management and analytics",
      "Onboarding funnel with instrumentation and optimization documentation",
      "Real-time social feature infrastructure with scaling documentation",
      "App store optimization assets and release management pipeline",
    ],
  };

  if (verticalDeliverables[id]) return verticalDeliverables[id];

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
  const verticalFaqs: Record<string, StartupFAQ[]> = {
    "fintech": [
      { question: "How do you handle PCI-DSS compliance during development?", answer: "We design for compliance from the first architecture decision. Tokenization, network segmentation, and encryption are structural choices, not additions. Most clients pass their first QSA audit without remediation items." },
      { question: "Which payment integrations have you worked with?", answer: "Stripe (Connect, Billing, Treasury), Plaid (Auth, Identity, Transactions), Dwolla, Marqeta, banking APIs via Synapse and Unit, and direct ACH via Nacha file generation. We know the edge cases in each." },
      { question: "How long does a fintech MVP typically take?", answer: "A basic payment product takes 8-12 weeks. Products involving bank integrations, lending logic, or multi-state licensing add 4-6 weeks for compliance architecture. We scope precisely before quoting." },
      { question: "Can you help with our banking license or money transmitter application?", answer: "We do not provide legal advice, but we build the technical infrastructure and documentation that licensing applications require: system architecture diagrams, security controls, and compliance monitoring." },
      { question: "How do you handle fraud detection?", answer: "We implement rule-based systems for known patterns and ML scoring for anomaly detection. The key is tuning: too aggressive blocks real customers, too lenient loses money. We build dashboards that let you adjust thresholds based on real data." },
    ],
    "healthtech": [
      { question: "How do you ensure HIPAA compliance throughout development?", answer: "PHI is mapped before architecture begins. Encryption (at rest, in transit, in logs) is structural. BAAs are signed with every vendor. Access controls are role-based and audited. We produce compliance evidence automatically, not manually before audits." },
      { question: "Which EHR systems have you integrated with?", answer: "Epic (FHIR R4, MyChart), Cerner Millennium, Allscripts, Athenahealth, and DrChrono. Each has vendor-specific behaviors that documentation omits. We have production experience with the workarounds." },
      { question: "How long does a healthtech platform take to build?", answer: "A patient-facing app without EHR integration takes 8-10 weeks. Adding EHR integrations adds 6-10 weeks due to vendor onboarding, credential approval, and testing requirements. Telehealth with recording: 10-14 weeks." },
      { question: "Can you help us pass a security audit or SOC 2 review?", answer: "Yes. We implement the technical controls (encryption, access logging, vulnerability scanning, backup verification) and produce the evidence documentation that auditors need. Our clients pass first-attempt audits consistently." },
      { question: "Do your engineers have access to patient data during development?", answer: "No. We use synthetic data that mirrors production schemas without containing real PHI. Production access is restricted to minimum-necessary personnel with background checks, per HIPAA minimum necessary rules." },
    ],
    "edtech": [
      { question: "How do you handle traffic spikes during enrollment season?", answer: "Auto-scaling infrastructure that responds to load signals within minutes. We load-test at 5x projected peak before launch, pre-warm caches for enrollment day, and use CDN-served content for static assets. Your platform stays up." },
      { question: "How do you keep video streaming costs under control?", answer: "Adaptive bitrate transcoding (only generate qualities that users actually request), multi-CDN routing to cheapest available path, aggressive browser caching, and download options that reduce repeat streaming. Typically 40-60% cost reduction vs. naive implementations." },
      { question: "How do you handle FERPA compliance?", answer: "Student education records are isolated with role-based access. Directory information is separated from protected records. Parental consent workflows are implemented where required. Third-party data sharing is restricted to what the school official exception allows." },
      { question: "Can you build for both K-12 and higher education?", answer: "Yes, but they are different products. K-12 requires COPPA compliance (under-13 users), parental consent flows, and simpler UX. Higher education requires LTI integration, credit-bearing assessment engines, and institutional admin tools. We scope accordingly." },
      { question: "How long does an EdTech platform take to build?", answer: "An LMS with course delivery and basic assessment takes 10-14 weeks. Adding live video, adaptive learning paths, or complex institutional admin features adds 4-8 weeks. We scope to your launch date (usually aligned to academic calendars)." },
    ],
    "proptech": [
      { question: "How do you handle MLS data licensing requirements?", answer: "We build data pipelines that respect RETS/RESO Web API refresh intervals, attribution display requirements, listing status rules, and data retention limits. MLS compliance is baked into the ingestion layer, not enforced in the UI." },
      { question: "How fast is your property search?", answer: "Our target is sub-300ms for complex geospatial queries with multiple filters across millions of listings. We achieve this with PostGIS spatial indexing, materialized views, and intelligent query caching. Most searches return in under 200ms." },
      { question: "Can you integrate with multiple MLS systems?", answer: "Yes. We have built integrations with 6+ MLS systems. Each has different data formats, field mappings, and compliance rules. Our normalization layer handles the differences so your application sees a unified data model." },
      { question: "How do you handle multi-party real estate transactions?", answer: "We model each transaction as a state machine with parallel workflows: inspection, appraisal, loan approval, and title search run independently but converge at closing. Every party sees their relevant status and required actions." },
      { question: "How long does a proptech platform take to build?", answer: "A listing search platform takes 8-12 weeks. Adding transaction management, digital signatures, and multi-party coordination adds 6-10 weeks. MLS integration timelines depend on vendor approval processes (typically 2-4 weeks per MLS)." },
    ],
    "legaltech": [
      { question: "How do you handle attorney-client privilege in your architecture?", answer: "Matter-level data isolation enforced at the database query layer, not just the UI. Search indexing respects privilege boundaries. Backup and export operations cannot cross matter boundaries. Audit trails prove access was authorized." },
      { question: "Can you build document automation for multiple jurisdictions?", answer: "Yes. We build template systems with jurisdiction as a first-class variable: different clause libraries, filing requirements, court rules, and formatting standards per jurisdiction. Adding a new jurisdiction means adding configuration, not rewriting code." },
      { question: "How accurate is your legal AI citation system?", answer: "Our RAG pipelines retrieve only from verified legal databases (court opinions, statutes, regulations). Every output includes source citations with pinpoint references. Confidence scores flag uncertain results. Hallucination rate is measured and tracked in production." },
      { question: "How do you handle law firm adoption challenges?", answer: "Zero-training-required interfaces, SSO integration with existing practice management tools (Clio, MyCase, PracticePanther), and self-service trials that prove value within a week. We design for attorneys who bill in 6-minute increments." },
      { question: "How long does a legaltech platform take to build?", answer: "A contract automation tool takes 10-14 weeks. Case management systems with firm-wide workflows take 12-16 weeks. Legal AI products with RAG pipelines and citation systems take 14-18 weeks. Complexity scales with jurisdiction coverage." },
    ],
    "agritech": [
      { question: "How does your offline-first architecture work?", answer: "All critical data is stored locally on device. Operations queue and sync when connectivity returns. Conflict resolution uses domain-specific rules (last-write-wins for reports, merge for aggregate data). The app functions fully without internet." },
      { question: "How do you handle IoT sensor data at scale?", answer: "Time-series ingestion pipelines (InfluxDB or TimescaleDB) process millions of data points daily. We aggregate at configurable intervals, alert on thresholds, and store raw data affordably in cold storage for historical analysis." },
      { question: "Can you build USSD interfaces for feature phone users?", answer: "Yes. We design USSD menu trees that deliver market prices, weather alerts, input recommendations, and payment confirmations in under 5 navigation steps. SMS fallback for asynchronous notifications. Tested on actual feature phone hardware." },
      { question: "How do you handle FSMA 204 traceability requirements?", answer: "Critical tracking events (growing, receiving, transforming, shipping) captured at lot level. Key data elements recorded per FDA specifications. The system produces records that satisfy recall investigations within the required timeframes." },
      { question: "How long does an agritech platform take to build?", answer: "A farm management web dashboard takes 8-10 weeks. Adding offline mobile apps adds 6-8 weeks. IoT sensor integration depends on hardware selection and protocol (MQTT, LoRaWAN): typically 4-8 weeks. USSD systems take 4-6 weeks." },
    ],
    "logistics-tech": [
      { question: "How many vehicles can your tracking system handle?", answer: "Our architecture handles 5,000+ vehicles with sub-second location updates. That means 300,000+ GPS points per minute processed, stored, and displayed on live maps without lag. We have load-tested this at scale." },
      { question: "How fast is your route optimization?", answer: "Under 2 seconds for a typical delivery route (20-40 stops) with time windows, capacity constraints, and driver break requirements. For larger fleets, we use parallel processing to optimize multiple routes simultaneously." },
      { question: "How do your driver apps work offline?", answer: "Delivery queues, turn-by-turn directions, and proof-of-delivery capture all function without connectivity. Data syncs automatically when the device reconnects. The driver never notices the transition between online and offline states." },
      { question: "Can you integrate with existing TMS or WMS systems?", answer: "Yes. We build integration layers for SAP TM, Oracle TMS, Manhattan WMS, and custom warehouse systems. Our approach: adapter pattern that isolates your new system from the legacy API quirks." },
      { question: "How long does a logistics platform take to build?", answer: "Fleet tracking with basic dispatch takes 8-10 weeks. Adding route optimization adds 4-6 weeks. Driver apps with offline capability add 6-8 weeks. Full platform (tracking, optimization, driver apps, customer notifications) takes 14-18 weeks." },
    ],
    "ecommerce": [
      { question: "When should we move from Shopify to headless commerce?", answer: "When your business logic cannot fit in Shopify: custom pricing rules (B2B tiers, volume discounts), multi-warehouse fulfillment logic, or checkout customization beyond what apps allow. Also when page speed is directly costing you conversions." },
      { question: "What conversion improvement can we expect?", answer: "Typical results: 15-30% improvement in checkout completion from UX optimization, 7-12% revenue lift from page speed improvements, and 20-40% reduction in cart abandonment. We measure before and after with statistical significance." },
      { question: "How do you handle inventory sync across channels?", answer: "Real-time inventory events propagate to all channels (website, Amazon, retail POS) within seconds. Safety stock buffers prevent overselling during sync delays. Reconciliation runs automatically and alerts on discrepancies." },
      { question: "Can you migrate us from Shopify without downtime?", answer: "Yes. We migrate incrementally: product data first, then individual pages, then checkout. Traffic routes to the new platform page-by-page. Revenue keeps flowing throughout. Full migration typically takes 2-4 weeks of parallel running." },
      { question: "How long does a headless commerce build take?", answer: "A basic storefront (catalog, cart, checkout) on headless architecture takes 8-10 weeks. Adding custom business logic (B2B pricing, subscriptions, multi-warehouse) adds 4-8 weeks. Migration from Shopify adds 2-4 weeks of parallel running." },
    ],
    "b2b-saas": [
      { question: "What multi-tenancy model do you recommend?", answer: "It depends on your security requirements and scale. Row-level isolation (cheapest, shared database) works for most startups. Schema-level for regulated industries. Database-level for enterprise customers who demand it. We help you choose and migrate later if needed." },
      { question: "How long does it take to add SSO to an existing product?", answer: "Typically 2-4 weeks for SAML 2.0 and OIDC support with the top providers (Okta, Azure AD, OneLogin, Google Workspace). Add 1-2 weeks for SCIM provisioning. The hard part is not the protocol, it is handling edge cases across IdPs." },
      { question: "How do you implement usage-based billing?", answer: "Event-based metering captures usage in real-time. Aggregation produces invoice-ready totals. We integrate with Stripe Billing, Chargebee, or build custom metering. The key is accuracy (customers will dispute errors) and latency (dashboards must reflect current usage)." },
      { question: "Can you help us pass enterprise security reviews?", answer: "Yes. We implement the technical controls that questionnaires ask about (encryption, access logging, MFA enforcement, vulnerability scanning), then prepare response documents. Most enterprise security reviews pass in 1-2 weeks with our documentation." },
      { question: "How long does a B2B SaaS platform take to build?", answer: "A core platform with multi-tenancy and basic admin takes 10-14 weeks. Adding enterprise features (SSO, SCIM, audit logs, usage billing) adds 6-10 weeks. We often build the core first, then add enterprise features as you close larger deals." },
    ],
    "consumer-apps": [
      { question: "What Day-7 retention should we target?", answer: "Depends on category. Social apps: 25-40%. Productivity: 15-25%. Gaming: 10-20%. We benchmark against your category, instrument from day one, and optimize the activation flow that drives retention. Our best consumer client hit 42% Day-7." },
      { question: "How do you handle push notification strategy?", answer: "Frequency capping (max 1-2/day), preference management (users choose categories), send-time optimization (ML-driven per-user timing), and rich notifications that provide value without requiring app opens. We measure re-engagement rate against uninstall rate." },
      { question: "How do you handle app store rejections?", answer: "We know the common rejection reasons and design around them. Metadata compliance, privacy nutrition labels, in-app purchase requirements, and content guidelines are handled before first submission. Average time from submission to approval: 3-5 days." },
      { question: "Can you build for both iOS and Android?", answer: "Yes. React Native for most consumer apps (shared codebase, native performance). Swift/Kotlin for apps where platform-specific features (AR, HealthKit, specific hardware) justify separate codebases. We recommend honestly based on your feature set." },
      { question: "How long does a consumer app take to build?", answer: "A core experience (onboarding, main feature, notifications) takes 8-12 weeks. Adding social features (feeds, messaging, profiles) adds 6-8 weeks. The first app store approval adds 1-2 weeks. Plan for 2-3 iteration cycles post-launch to optimize retention." },
    ],
  };

  if (verticalFaqs[id]) return verticalFaqs[id];

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
  const verticalHelped: Record<string, string[]> = {
    "fintech": ["Payment platform startups processing multi-currency transactions", "Lending companies building credit decisioning engines", "Neobanks launching card programs and checking accounts", "Crypto companies bridging fiat and digital asset rails"],
    "healthtech": ["Telehealth platforms connecting patients and providers remotely", "Digital therapeutics companies delivering FDA-regulated interventions", "EHR interoperability startups bridging hospital systems", "Mental health platforms scaling access to therapy"],
    "edtech": ["Online course platforms serving 100K+ learners", "K-12 assessment tools used by school districts", "Corporate training platforms reducing onboarding time", "Language learning apps with adaptive curricula"],
    "proptech": ["Property search platforms aggregating multi-MLS data", "Digital closing platforms for residential transactions", "Property management tools for portfolio landlords", "Commercial real estate analytics platforms"],
    "legaltech": ["Contract lifecycle management platforms for enterprise legal teams", "AI-powered legal research tools for solo practitioners", "Case management systems for mid-size litigation firms", "Compliance automation platforms for regulated industries"],
    "agritech": ["Precision agriculture platforms serving commercial farms", "Supply chain traceability systems for food manufacturers", "Smallholder advisory services reaching farmers via USSD", "IoT-powered irrigation management for water-scarce regions"],
    "logistics-tech": ["Last-mile delivery platforms managing 500+ drivers daily", "Fleet management companies tracking cross-country routes", "Cold chain logistics startups monitoring temperature-sensitive cargo", "Warehouse automation platforms optimizing pick-and-pack"],
    "ecommerce": ["DTC brands migrating from Shopify to headless architecture", "B2B wholesale platforms with custom pricing and quoting", "Subscription box companies optimizing fulfillment costs", "Multi-brand retailers unifying inventory across 50+ stores"],
    "b2b-saas": ["Vertical SaaS companies adding enterprise features to move upmarket", "Horizontal tools implementing usage-based pricing at scale", "Compliance platforms selling to regulated industries", "Developer tools building self-serve onboarding for PLG growth"],
    "consumer-apps": ["Social apps that achieved 35%+ Day-7 retention post-optimization", "Fitness platforms building daily habit engagement", "Dating apps scaling matching algorithms for 1M+ profiles", "Creator economy platforms enabling fan monetization"],
  };

  if (verticalHelped[id]) return verticalHelped[id];

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
  const verticalReviews: Record<string, StartupClientReview[]> = {
    "fintech": [
      { text: "We passed PCI-DSS on our first audit. Our QSA said the architecture was the cleanest he had seen from a startup. That is what happens when compliance is designed in, not patched on.", name: "James W.", role: "CTO, Payments Startup" },
      { text: "Our Plaid integration handles 50,000 account connections without a single data loss incident. CiroStack knew every edge case before we hit it.", name: "Rachel M.", role: "Founder, Personal Finance App" },
    ],
    "healthtech": [
      { text: "Finding engineers who understand both HIPAA compliance and startup speed was impossible until we found CiroStack. We launched our telehealth platform in 12 weeks with zero compliance gaps.", name: "Dr. Elena R.", role: "Founder, Telehealth Startup" },
      { text: "Our Epic FHIR integration works flawlessly across 3 hospital systems. Most teams spend 6 months fighting EHR APIs. CiroStack had ours production-ready in 8 weeks.", name: "Priya S.", role: "CTO, Digital Health Company" },
    ],
    "edtech": [
      { text: "Enrollment day hit 300,000 concurrent users. Not a single error page. CiroStack's architecture handled 5x our projections without breaking a sweat.", name: "Michael K.", role: "CTO, Online Learning Platform" },
      { text: "Our video streaming costs dropped 55% after CiroStack re-architected our delivery pipeline. Same quality, same reach, half the infrastructure bill.", name: "Aisha L.", role: "Founder, K-12 EdTech Startup" },
    ],
    "proptech": [
      { text: "Property search returns in 180ms across 4 million listings. Our users compare us to Zillow and we hold up. That is entirely due to CiroStack's geospatial architecture.", name: "Daniel F.", role: "Founder, Real Estate Search Platform" },
      { text: "We coordinate closings across 8 parties and 3 time zones. CiroStack built a transaction engine that keeps everyone in sync without a single missed deadline in 14 months.", name: "Amanda C.", role: "CEO, Digital Closing Startup" },
    ],
    "legaltech": [
      { text: "Our document automation generates 200-page agreements with jurisdiction-specific language in under 10 seconds. Attorneys who used to spend 4 hours on the same documents now spend 15 minutes reviewing.", name: "Nathan B.", role: "Founder, Contract Automation Platform" },
      { text: "CiroStack built our legal AI with citation accuracy above 98%. That is the threshold where attorneys trust it enough to use it daily. Below that, they ignore it. CiroStack understood that from day one.", name: "Sarah T.", role: "CTO, Legal Research Startup" },
    ],
    "agritech": [
      { text: "Our field agents collect data in areas with zero connectivity and everything syncs perfectly when they reach town. Not a single record lost in 18 months of operation across 3 countries.", name: "Joseph M.", role: "Founder, Smallholder Advisory Platform" },
      { text: "USSD menus serving 40,000 farmers daily. Market prices, weather alerts, input recommendations. CiroStack built something that works on a $15 phone in rural Kenya. That is the engineering challenge they solved.", name: "Grace A.", role: "CEO, AgriTech Social Enterprise" },
    ],
    "logistics-tech": [
      { text: "We track 2,500 vehicles in real-time and our dispatchers trust the data completely. GPS updates render on the map in under 500ms. CiroStack delivered the performance our operations team demanded.", name: "Robert T.", role: "CTO, Fleet Management Startup" },
      { text: "Route optimization saves our drivers 35 minutes per shift. At 800 drivers, that is 466 hours per day of recovered delivery capacity. CiroStack's algorithm paid for itself in the first month.", name: "Chen W.", role: "Founder, Last-Mile Delivery Platform" },
    ],
    "ecommerce": [
      { text: "Page loads dropped from 4.2 seconds to 1.3 seconds. Conversion rate jumped 22% in the first month. CiroStack's headless migration paid for itself in 6 weeks of additional revenue.", name: "Maria G.", role: "Founder, DTC Fashion Brand" },
      { text: "Black Friday hit 47x normal traffic. Zero downtime, zero slow checkouts, zero lost orders. CiroStack built infrastructure that handles our worst-case scenario without breaking a sweat.", name: "Jason L.", role: "CTO, Multi-Brand Retailer" },
    ],
    "b2b-saas": [
      { text: "Adding SSO unblocked three enterprise deals worth $450K combined ARR. CiroStack shipped it in 3 weeks. Best ROI of any engineering investment we have made.", name: "Kevin H.", role: "CEO, Vertical SaaS Company" },
      { text: "Zero data isolation incidents across 2,000+ tenants over two years. When enterprise customers ask about our security architecture, we hand them CiroStack's documentation and they sign.", name: "Lisa P.", role: "Founder, B2B Analytics Platform" },
    ],
    "consumer-apps": [
      { text: "Day-7 retention went from 18% to 37% after CiroStack rebuilt our onboarding. Same product, same marketing. The difference was getting users to value faster.", name: "Alex K.", role: "Founder, Fitness App" },
      { text: "Our push notification re-engagement rate is 12% with an uninstall rate under 0.3%. Most apps get one or the other right. CiroStack built a system that nails both.", name: "Sophie R.", role: "CEO, Social Discovery App" },
    ],
  };

  if (verticalReviews[id]) return verticalReviews[id];

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
