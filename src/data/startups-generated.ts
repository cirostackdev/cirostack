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
    // BY PRODUCT TYPE
    "web-app": [
      "Real-time collaboration features (live cursors, shared editing, presence indicators) add exponential complexity to state management.",
      "Multi-tenant data models require careful isolation decisions upfront that are extremely expensive to change later.",
      "Browser compatibility, responsive layouts, and accessibility compliance triple the testing surface of any web application.",
      "Authentication flows (SSO, MFA, magic links, OAuth) feel simple until you handle session management, token refresh, and account linking edge cases.",
    ],
    "mobile-app": [
      "Cross-platform vs. native is a $100,000 decision: choose wrong and you rebuild in 12 months or accept permanent UX compromises.",
      "App store review adds 2-7 days to every release and rejects builds for reasons not documented in their guidelines.",
      "Offline-first data sync with conflict resolution is table-stakes for mobile but complex enough that most teams get it wrong.",
      "Push notifications require separate infrastructure for APNS and FCM, with delivery tracking that neither platform provides natively.",
    ],
    "ai-product": [
      "LLMs hallucinate in production with real users. The demo works perfectly. The edge cases destroy trust.",
      "RAG pipeline quality depends entirely on chunking strategy, embedding model choice, and retrieval ranking, none of which have obvious right answers.",
      "Latency expectations conflict with quality: streaming responses feel faster but complicate error handling and output validation.",
      "Eval infrastructure (measuring AI quality systematically) is as complex as the AI feature itself but most teams skip it entirely.",
    ],
    "saas-platform": [
      "Multi-tenancy is the most consequential Day 1 decision. Row-level, schema-level, or database-level isolation each have tradeoffs you cannot reverse cheaply.",
      "Subscription billing seems simple until you handle plan changes mid-cycle, prorations, dunning, and usage overages correctly.",
      "Self-serve onboarding must get users to value in under 3 minutes or trial-to-paid conversion collapses below viable levels.",
      "Feature flagging for per-plan access control interacts with every part of the codebase and compounds in complexity with each new tier.",
    ],
    "marketplace": [
      "The cold-start problem kills most marketplaces: you need supply to attract demand and demand to attract supply. Neither will wait.",
      "Payment flows between multiple parties (buyer, seller, platform fee) require Stripe Connect or equivalent and the edge cases are brutal.",
      "Trust and safety (fraud detection, content moderation, dispute resolution) are table-stakes, not nice-to-have features.",
      "Matching algorithms must balance relevance, freshness, and fairness while handling inventory that changes by the second.",
    ],
    "api-product": [
      "Developer experience is your sales channel. Bad docs, confusing auth, or inconsistent error responses kill adoption before features matter.",
      "Rate limiting must protect your infrastructure without breaking legitimate power users. Getting the threshold wrong costs you either money or customers.",
      "Versioning strategy (URL path, header, or query param) is a permanent decision that affects every future API consumer.",
      "Usage metering for billing must be both precise enough for invoices and fast enough to not add latency to every API call.",
    ],
    "data-platform": [
      "Data quality problems at ingestion compound into analytical errors at query time. Bad data in means wrong decisions out.",
      "ELT pipeline failures at 3am go unnoticed until a dashboard shows wrong numbers to a VP who makes a decision based on them.",
      "Semantic layer inconsistency means two analysts asking the same question get different answers and nobody knows which is right.",
      "Storage costs grow silently: raw data ingestion without lifecycle policies creates six-figure cloud bills within 18 months.",
    ],
    "iot": [
      "Device provisioning at scale (10,000+ units) requires automated enrollment, certificate management, and firmware verification that manual processes cannot handle.",
      "OTA firmware updates can brick devices permanently if they fail midway. Rollback mechanisms are not optional, they are existential.",
      "MQTT broker performance degrades unpredictably at 10,000+ concurrent connections. Load testing with real device patterns is the only way to know your limits.",
      "Time-series telemetry volumes grow geometrically with device count. Storage architecture decisions made at 100 devices collapse at 10,000.",
    ],
    "internal-tools": [
      "Retool and low-code tools get you to 80% fast, then trap you there for months trying to implement the last 20% of custom logic.",
      "Internal tools built as side projects by engineers accumulate undocumented business rules that only one person understands.",
      "Permission models for internal tools are deceptively complex: who can view, edit, approve, and override differs by team, role, and specific workflow.",
      "Internal tool adoption fails when the UX is worse than the spreadsheet it replaces. Operations teams will not use bad software voluntarily.",
    ],
    "embedded": [
      "Memory management bugs in embedded systems only manifest under specific load patterns that unit tests cannot replicate.",
      "OTA update mechanisms must handle interrupted updates, corrupted downloads, and rollback to a known-good state without bricking hardware in the field.",
      "Hardware debugging requires physical devices and cannot be fully replicated in CI. Shipping firmware with undiscovered bugs means physical recalls.",
      "Power consumption optimization requires measurement with real hardware under real workloads. Simulation underestimates real-world drain by 30-50%.",
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
    // BY PRODUCT TYPE
    "web-app": [
      { title: "Full-Stack Architecture", description: "React/Next.js frontend, Node.js or Python backend, PostgreSQL data layer. Chosen for your specific needs, not our default preferences." },
      { title: "Real-Time Capabilities", description: "WebSocket infrastructure for live collaboration, presence indicators, and instant updates without polling. Scales to thousands of concurrent users." },
      { title: "Auth & Permissions", description: "SSO integration, role-based access, API key management, and session handling built correctly from day one so you never retrofit security." },
      { title: "Production-Ready DevOps", description: "CI/CD pipelines, staging environments, database migrations, and monitoring dashboards. Your web app deploys on every merge with zero-downtime." },
    ],
    "mobile-app": [
      { title: "Platform Strategy", description: "Honest recommendation between React Native (shared code, faster delivery) and native Swift/Kotlin (platform-specific features). Based on your actual needs, not our billing preferences." },
      { title: "Offline-First Architecture", description: "Local data storage, background sync, conflict resolution, and graceful degradation. The app works without connectivity and syncs when it returns." },
      { title: "Native-Feel Performance", description: "60fps animations, efficient list rendering, lazy image loading, and memory management that passes both app stores' performance requirements." },
      { title: "Store Submission Mastery", description: "Metadata compliance, privacy labels, in-app purchase configuration, and the review-response process that gets builds approved on first submission." },
    ],
    "ai-product": [
      { title: "RAG Pipeline Engineering", description: "Document chunking, embedding generation, vector search, and retrieval ranking optimized for your specific content type and user queries." },
      { title: "Streaming Response Infrastructure", description: "Token-by-token output, graceful error recovery mid-stream, and the UI patterns that make 3-second generation times feel instant." },
      { title: "Eval & Quality Pipeline", description: "Automated evaluation suites that catch quality regressions before production. Golden dataset testing, A/B comparison, and regression alerts." },
      { title: "Hallucination Mitigation", description: "Source grounding, confidence scoring, citation generation, and output validation that prevents your AI from confidently stating nonsense." },
    ],
    "saas-platform": [
      { title: "Multi-Tenant Architecture", description: "Data isolation that matches your security requirements. Row-level for cost efficiency, schema-level for compliance, database-level for enterprise clients who demand it." },
      { title: "Subscription Billing Engine", description: "Stripe or Chargebee integration with plan changes, prorations, dunning, usage overages, and the edge cases that billing libraries do not handle." },
      { title: "Self-Serve Onboarding", description: "Signup to value in under 3 minutes. Product tours, sample data, and progressive feature disclosure that converts free trials into paid accounts." },
      { title: "Admin & Analytics", description: "Tenant management console, usage dashboards, feature flags per plan, and the internal tooling your operations team needs to support customers." },
    ],
    "marketplace": [
      { title: "Cold-Start Playbook", description: "Supply seeding strategies, single-player mode features, and the growth mechanics that solve the chicken-and-egg problem for new marketplaces." },
      { title: "Multi-Party Payments", description: "Stripe Connect integration with split payments, escrow holds, platform fees, seller payouts, and the dispute resolution flows that prevent chargebacks." },
      { title: "Trust & Safety System", description: "User verification, content moderation (automated + manual review queues), fraud detection, and dispute resolution workflows that maintain platform quality." },
      { title: "Matching & Ranking", description: "Relevance algorithms that balance quality, freshness, geographic proximity, and seller fairness while handling inventory that changes in real-time." },
    ],
    "api-product": [
      { title: "Developer Experience Design", description: "OpenAPI specification, interactive documentation, code samples in 4+ languages, and the onboarding flow that gets developers to their first successful API call in minutes." },
      { title: "SDK Generation", description: "Idiomatic client libraries for Python, JavaScript, Go, and Ruby. Auto-generated from your spec, manually polished for developer ergonomics." },
      { title: "Rate Limiting & Throttling", description: "Per-key limits, burst allowances, and graceful degradation that protects your infrastructure without breaking legitimate high-volume integrators." },
      { title: "Usage Metering & Billing", description: "Request counting, bandwidth tracking, or custom metric metering that integrates with Stripe for accurate usage-based invoicing." },
    ],
    "data-platform": [
      { title: "ELT Pipeline Architecture", description: "Extraction from any source (APIs, databases, files, streams), transformation with dbt, and loading into your warehouse with idempotent, recoverable runs." },
      { title: "Data Quality Framework", description: "Schema validation, freshness checks, volume anomaly detection, and the alerting that catches bad data before it reaches dashboards." },
      { title: "Semantic Layer", description: "Centralized metric definitions so every analyst, dashboard, and report works from the same definition of 'active user' or 'revenue'." },
      { title: "Cost-Optimized Storage", description: "Hot/warm/cold tiering, partition strategies, and lifecycle policies that keep your warehouse bill predictable as data volumes grow." },
    ],
    "iot": [
      { title: "Device Provisioning at Scale", description: "Automated enrollment, certificate rotation, fleet segmentation, and the zero-touch setup that makes deploying 10,000 devices operationally feasible." },
      { title: "Safe OTA Updates", description: "Differential firmware delivery, integrity verification, staged rollouts, automatic rollback on failure, and the monitoring that proves updates succeeded." },
      { title: "Telemetry Pipeline", description: "MQTT ingestion, time-series storage, real-time alerting, and historical analytics. Built to handle millions of data points daily at IoT-budget costs." },
      { title: "Edge Computing", description: "Local processing on device for latency-critical decisions, with cloud sync for analytics and fleet-wide intelligence that improves over time." },
    ],
    "internal-tools": [
      { title: "Custom Business Logic", description: "The exact workflows, validation rules, and approval chains your operations team needs. No compromise with low-code limitations or per-seat licensing." },
      { title: "Permission System", description: "Role-based access that matches your org chart: who can view, edit, approve, and override differs by team, seniority, and specific workflow stage." },
      { title: "System Integration", description: "Connectors to your existing tools (Salesforce, ERP, databases, APIs) that pull and push data in real-time without manual export/import cycles." },
      { title: "Ops-Friendly UX", description: "Interfaces designed for the people who use them 8 hours a day: keyboard shortcuts, bulk actions, saved filters, and the speed that spreadsheets cannot match." },
    ],
    "embedded": [
      { title: "Firmware Architecture", description: "Clean separation between hardware abstraction, application logic, and communication layers. Code that survives hardware revisions without full rewrites." },
      { title: "Safe OTA Mechanism", description: "A/B partition updates, integrity verification, automatic rollback, and the boot-loop detection that prevents field-bricking even when updates fail." },
      { title: "Power Optimization", description: "Sleep mode management, peripheral duty cycling, and transmission scheduling that extends battery life from weeks to months based on real-world usage patterns." },
      { title: "Cloud Connectivity", description: "MQTT or CoAP protocols, connection resilience, and the buffering strategies that handle intermittent connectivity without data loss." },
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
    // BY PRODUCT TYPE
    "web-app": [
      { title: "Architecture That Scales", description: "Decisions made for 10x growth without requiring a rewrite. Monolith-first when it makes sense, services when they earn their complexity." },
      { title: "Real-Time by Default", description: "WebSocket infrastructure, optimistic updates, and live collaboration features built into the foundation, not bolted on later." },
      { title: "Accessible & Responsive", description: "WCAG AA compliance, responsive layouts, and keyboard navigation as structural requirements, not last-sprint checkboxes." },
      { title: "Deploy with Confidence", description: "CI/CD, staging environments, feature flags, and rollback capability. Every merge ships safely. Fridays included." },
    ],
    "mobile-app": [
      { title: "Honest Platform Advice", description: "React Native when code sharing saves money. Swift/Kotlin when native performance is non-negotiable. We tell you which and why." },
      { title: "Works Offline", description: "Local storage, background sync, and conflict resolution. Your app functions fully without connectivity and recovers gracefully." },
      { title: "Store Approval Expertise", description: "Metadata, privacy policies, in-app purchase rules, and review guidelines handled. First-submission approval is our standard." },
      { title: "Native Performance", description: "60fps animations, efficient memory use, and the performance profiling that passes both Apple and Google's review criteria." },
    ],
    "ai-product": [
      { title: "Beyond the API Key", description: "RAG pipelines, eval infrastructure, streaming UI, and quality monitoring. The 90% of AI product engineering that is not the model call." },
      { title: "Hallucination Control", description: "Source grounding, confidence scoring, and citation generation. Your AI admits uncertainty instead of fabricating answers." },
      { title: "Production-Grade Latency", description: "Streaming responses, caching strategies, and UI patterns that make 2-4 second generation times feel responsive to end users." },
      { title: "Measurable Quality", description: "Eval pipelines that score output quality continuously. You know when quality degrades before users complain." },
    ],
    "saas-platform": [
      { title: "Multi-Tenancy Done Right", description: "Data isolation that matches your market. Shared infrastructure for efficiency, isolated when enterprise customers demand it." },
      { title: "Billing That Works", description: "Subscription management, usage metering, prorations, and dunning integrated correctly. No revenue leakage from edge cases." },
      { title: "Self-Serve Growth", description: "Onboarding that converts trials to paid without sales intervention. Product-led growth built into the architecture." },
      { title: "Enterprise-Ready", description: "SSO, SCIM, audit logs, and RBAC ready when your first enterprise prospect asks. Not 6 months of scrambling." },
    ],
    "marketplace": [
      { title: "Cold-Start Solved", description: "Supply seeding, single-player mode, and growth mechanics that get both sides to critical mass without burning cash on subsidies." },
      { title: "Money Moves Safely", description: "Stripe Connect integration with escrow, splits, payouts, and dispute handling. Money never gets lost between parties." },
      { title: "Trust Built In", description: "Verification, ratings, moderation, and dispute resolution that maintain platform quality as you scale beyond manual review." },
      { title: "Fair Matching", description: "Ranking algorithms that balance relevance, freshness, and seller fairness. No one gets buried, no one gets unfair advantage." },
    ],
    "api-product": [
      { title: "Docs That Sell", description: "Interactive documentation with code samples in 4+ languages. Developers reach their first successful call in under 5 minutes." },
      { title: "Idiomatic SDKs", description: "Client libraries that feel native in Python, JavaScript, Go, and Ruby. Auto-generated from spec, manually polished for ergonomics." },
      { title: "Reliable at Scale", description: "Rate limiting, retry logic, and graceful degradation that protects your infrastructure without punishing legitimate users." },
      { title: "Metered Billing", description: "Usage tracking precise enough for invoicing and fast enough to not add latency. Developers trust their bills because the numbers are right." },
    ],
    "data-platform": [
      { title: "Trustworthy Data", description: "Quality checks at ingestion that prevent bad data from reaching dashboards. Every analyst works from numbers they can trust." },
      { title: "Single Source of Truth", description: "Semantic layer with centralized metric definitions. 'Active user' means the same thing in every report, dashboard, and query." },
      { title: "Predictable Costs", description: "Storage tiering, lifecycle policies, and query optimization that keep your warehouse bill linear even as data grows exponentially." },
      { title: "Self-Healing Pipelines", description: "Idempotent runs, automatic retry, alerting on failure, and recovery without manual intervention. Pipelines fix themselves at 3am." },
    ],
    "iot": [
      { title: "Fleet-Scale Provisioning", description: "Automated enrollment, certificate management, and zero-touch setup. Deploying 10,000 devices is an afternoon, not a quarter." },
      { title: "Updates That Cannot Brick", description: "A/B partitions, integrity checks, staged rollouts, and automatic rollback. Failed firmware updates recover, they never brick." },
      { title: "Affordable Telemetry", description: "Time-series pipelines that handle millions of data points daily without enterprise-scale bills. IoT margins require IoT-budget infrastructure." },
      { title: "Edge Intelligence", description: "Local processing for latency-critical decisions. Cloud sync for fleet-wide analytics. The right computation in the right place." },
    ],
    "internal-tools": [
      { title: "No Per-Seat Tax", description: "Custom-built tools with no licensing fees. Add users freely as your operations team grows without cost scaling linearly." },
      { title: "Exact Fit Workflows", description: "The specific approval chains, validation rules, and business logic your team needs. No compromising with low-code limitations." },
      { title: "Replaces the Spreadsheet", description: "UX that operations staff actually prefer over their current Excel-and-email workflow. Adoption by choice, not mandate." },
      { title: "System Integration", description: "Real-time connectors to Salesforce, ERP, databases, and APIs. Data flows automatically without manual export/import cycles." },
    ],
    "embedded": [
      { title: "Survives Hardware Revisions", description: "Clean abstraction layers that isolate application logic from hardware specifics. Component swaps do not mean firmware rewrites." },
      { title: "Field-Safe Updates", description: "OTA mechanisms with rollback, integrity verification, and boot-loop prevention. Devices in the field never become paperweights." },
      { title: "Battery Longevity", description: "Power management optimized through measurement, not simulation. Sleep modes, duty cycling, and transmission scheduling that extend real-world battery life." },
      { title: "Production-Ready Testing", description: "Hardware-in-the-loop CI that catches bugs before they ship to devices you cannot physically recall." },
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
    // BY PRODUCT TYPE
    "web-app": [
      { value: "20+", label: "Web Apps Shipped to Production" },
      { value: "99.9%", label: "Average Uptime Across All Builds" },
      { value: "<1s", label: "Target Initial Page Load" },
      { value: "6", label: "Weeks Average Time to Launch" },
    ],
    "mobile-app": [
      { value: "15+", label: "Apps Published to Both Stores" },
      { value: "95%", label: "First-Submission Approval Rate" },
      { value: "60fps", label: "Animation Performance Target" },
      { value: "4.7+", label: "Average App Store Rating" },
    ],
    "ai-product": [
      { value: "10+", label: "AI Products Shipped to Production" },
      { value: "<2s", label: "Average Time to First Token" },
      { value: "98%+", label: "Citation Accuracy (Best Client)" },
      { value: "0", label: "Hallucination Incidents Post-Launch" },
    ],
    "saas-platform": [
      { value: "15+", label: "SaaS Platforms Built" },
      { value: "100%", label: "Tenant Data Isolation" },
      { value: "<3min", label: "Signup to Value Target" },
      { value: "5x", label: "Faster Enterprise Deal Closure" },
    ],
    "marketplace": [
      { value: "8+", label: "Marketplaces Launched" },
      { value: "10K+", label: "Daily Transactions (Top Client)" },
      { value: "99.99%", label: "Payment Processing Uptime" },
      { value: "<0.1%", label: "Fraud Rate Post-Launch" },
    ],
    "api-product": [
      { value: "6+", label: "API Products Shipped" },
      { value: "99.99%", label: "API Uptime (Top Client)" },
      { value: "<5min", label: "Time to First API Call (Onboarding)" },
      { value: "4", label: "SDK Languages Supported" },
    ],
    "data-platform": [
      { value: "5+", label: "Data Platforms Built" },
      { value: "99.5%", label: "Pipeline Reliability (No Manual Fix)" },
      { value: "50%", label: "Average Query Cost Reduction" },
      { value: "<15min", label: "Data Freshness SLA" },
    ],
    "iot": [
      { value: "10K+", label: "Devices Managed (Top Client)" },
      { value: "0", label: "Devices Bricked by OTA Updates" },
      { value: "5M+", label: "Telemetry Points Processed Daily" },
      { value: "99.8%", label: "OTA Update Success Rate" },
    ],
    "internal-tools": [
      { value: "12+", label: "Internal Tools Delivered" },
      { value: "80%", label: "Average Process Time Reduction" },
      { value: "0", label: "Per-Seat Licensing Fees" },
      { value: "2wk", label: "Average Adoption Time" },
    ],
    "embedded": [
      { value: "8+", label: "Firmware Projects Shipped" },
      { value: "0", label: "Field-Bricked Devices" },
      { value: "3x", label: "Average Battery Life Improvement" },
      { value: "99.8%", label: "OTA Update Success Rate" },
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
    // BY PRODUCT TYPE
    "web-app": [
      { serviceName: "Full-Stack Development", slug: "websites", description: "React/Next.js frontend with Node.js or Python backend", applicationDetail: "Complete web application architecture: server-side rendering, API layer, database design, and real-time features built with modern frameworks that your future team can maintain." },
      { serviceName: "Real-Time Features", slug: "apps", description: "WebSocket and collaboration infrastructure", applicationDetail: "Live cursors, shared editing, presence indicators, and instant notifications built on WebSocket infrastructure that scales to thousands of concurrent users." },
      { serviceName: "Application UX Design", slug: "ux-ui-design", description: "Dashboard and workflow interface design", applicationDetail: "Complex application interfaces (dashboards, settings, multi-step workflows) designed for daily use: fast, accessible, and efficient for power users." },
      { serviceName: "Cloud Infrastructure", slug: "devops", description: "Deployment, scaling, and monitoring", applicationDetail: "AWS or Vercel deployment, auto-scaling configuration, database management, and the monitoring stack that alerts before users notice problems." },
    ],
    "mobile-app": [
      { serviceName: "Cross-Platform Development", slug: "websites", description: "React Native for iOS and Android", applicationDetail: "Single codebase serving both platforms with 90%+ code sharing while maintaining native-feel performance, platform-specific UI patterns, and smooth animations." },
      { serviceName: "Native Development", slug: "apps", description: "Swift (iOS) and Kotlin (Android)", applicationDetail: "Platform-specific development when your app requires: AR features, HealthKit/Google Fit, advanced camera, or the absolute peak performance native delivers." },
      { serviceName: "Mobile UX Design", slug: "ux-ui-design", description: "Touch-first interface and interaction design", applicationDetail: "Gesture-driven navigation, thumb-zone-aware layouts, micro-interactions, and the platform-specific patterns (iOS vs Android) that users expect without thinking." },
      { serviceName: "Mobile DevOps", slug: "devops", description: "CI/CD, testing, and store submission", applicationDetail: "Fastlane pipelines, TestFlight distribution, automated screenshot generation, and the release management that handles app store review processes smoothly." },
    ],
    "ai-product": [
      { serviceName: "AI Backend Development", slug: "websites", description: "RAG pipelines and inference infrastructure", applicationDetail: "Vector databases, embedding pipelines, retrieval ranking, and the orchestration layer that coordinates context, prompts, and model calls into reliable outputs." },
      { serviceName: "AI-Native UX", slug: "apps", description: "Conversational and generative interfaces", applicationDetail: "Streaming response UI, confidence indicators, source citations, feedback mechanisms, and the interaction patterns that make AI features feel helpful rather than unreliable." },
      { serviceName: "AI Product Design", slug: "ux-ui-design", description: "Human-AI interaction design", applicationDetail: "Designing the boundary between AI and human: when to show confidence scores, how to present sources, where to offer corrections, and how to make latency feel acceptable." },
      { serviceName: "ML Infrastructure", slug: "devops", description: "Model serving, evaluation, and monitoring", applicationDetail: "Model deployment pipelines, A/B testing infrastructure, quality monitoring dashboards, and the eval suites that catch degradation before users do." },
    ],
    "saas-platform": [
      { serviceName: "Platform Development", slug: "websites", description: "Multi-tenant application core", applicationDetail: "Tenant isolation, admin consoles, user management, and the subscription enforcement layer that gates features by plan level across your entire application." },
      { serviceName: "Billing Integration", slug: "apps", description: "Subscription and usage-based billing", applicationDetail: "Stripe or Chargebee integration with plan management, usage metering, invoice generation, dunning sequences, and the webhook handling that keeps state consistent." },
      { serviceName: "SaaS UX Design", slug: "ux-ui-design", description: "Product and admin interface design", applicationDetail: "Application dashboards, onboarding flows, settings panels, and the empty states and upgrade prompts that convert free users to paid without feeling pushy." },
      { serviceName: "SaaS Infrastructure", slug: "devops", description: "Multi-tenant hosting and tenant operations", applicationDetail: "Tenant-aware deployments, per-tenant resource isolation when required, feature flags per plan, and the operational tooling that makes managing 1,000 tenants manageable." },
    ],
    "marketplace": [
      { serviceName: "Marketplace Platform", slug: "websites", description: "Two-sided marketplace core", applicationDetail: "Separate buyer and seller experiences, listing management, search and discovery, and the matching logic that connects supply with demand effectively." },
      { serviceName: "Payment Infrastructure", slug: "apps", description: "Multi-party financial flows", applicationDetail: "Stripe Connect integration with escrow, split payments, seller payouts, refund flows, and the accounting reconciliation that keeps money traceable." },
      { serviceName: "Marketplace UX Design", slug: "ux-ui-design", description: "Buyer and seller experience design", applicationDetail: "Search result layouts, listing creation flows, transaction progress indicators, and the review/rating systems that build trust between strangers." },
      { serviceName: "Trust & Safety Infrastructure", slug: "devops", description: "Fraud detection and content moderation", applicationDetail: "Automated fraud scoring, content moderation queues, user verification workflows, and the dispute resolution system that scales beyond manual review." },
    ],
    "api-product": [
      { serviceName: "API Development", slug: "websites", description: "RESTful or GraphQL API architecture", applicationDetail: "Endpoint design, authentication (API keys, OAuth), pagination, filtering, and the consistent error handling that makes your API predictable for developers." },
      { serviceName: "Developer Portal", slug: "apps", description: "Documentation and SDK platform", applicationDetail: "Interactive API docs, code samples, sandbox environments, and the developer dashboard where users manage keys, monitor usage, and read changelogs." },
      { serviceName: "API DX Design", slug: "ux-ui-design", description: "Developer experience and onboarding", applicationDetail: "The developer journey from signup to first successful API call in under 5 minutes. Quickstart guides, interactive tutorials, and error messages that explain how to fix the problem." },
      { serviceName: "API Infrastructure", slug: "devops", description: "Gateway, scaling, and monitoring", applicationDetail: "API gateway configuration, rate limiting, request logging, uptime monitoring, and the auto-scaling that handles traffic spikes without degraded response times." },
    ],
    "data-platform": [
      { serviceName: "Pipeline Development", slug: "websites", description: "ELT pipeline architecture and implementation", applicationDetail: "Extractors for any source (APIs, databases, files, event streams), dbt transformations with proper testing, and orchestration that recovers from failures automatically." },
      { serviceName: "Analytics Layer", slug: "apps", description: "Semantic layer and BI integration", applicationDetail: "Centralized metric definitions, materialized views for dashboard performance, and integration with Metabase, Looker, or custom visualization tools." },
      { serviceName: "Data Product Design", slug: "ux-ui-design", description: "Dashboard and exploration interfaces", applicationDetail: "Self-serve analytics interfaces, data catalog UX, and the exploration tools that let non-technical stakeholders answer their own questions." },
      { serviceName: "Data Infrastructure", slug: "devops", description: "Warehouse, orchestration, and monitoring", applicationDetail: "Snowflake/BigQuery/Redshift configuration, Airflow or Dagster orchestration, and the monitoring that alerts when data is stale, missing, or anomalous." },
    ],
    "iot": [
      { serviceName: "IoT Platform Development", slug: "websites", description: "Device management and fleet operations", applicationDetail: "Fleet dashboards, device status monitoring, remote configuration, and the grouping/segmentation tools that make managing thousands of devices practical." },
      { serviceName: "Firmware Development", slug: "apps", description: "Embedded software for connected devices", applicationDetail: "Application firmware with clean hardware abstraction, power management, connectivity handling, and the OTA update mechanism that keeps devices current safely." },
      { serviceName: "IoT Dashboard Design", slug: "ux-ui-design", description: "Fleet monitoring and telemetry interfaces", applicationDetail: "Real-time device maps, telemetry visualizations, alert management screens, and the operational views that fleet managers need to make decisions quickly." },
      { serviceName: "IoT Infrastructure", slug: "devops", description: "MQTT brokers, time-series storage, and edge computing", applicationDetail: "MQTT broker clusters (EMQX, HiveMQ), TimescaleDB or InfluxDB for telemetry, and the edge computing layer that processes data locally when latency matters." },
    ],
    "internal-tools": [
      { serviceName: "Custom Tool Development", slug: "websites", description: "Bespoke operations software", applicationDetail: "Admin panels, approval workflows, data entry interfaces, and the dashboards that replace the spreadsheets your operations team is maintaining in secret." },
      { serviceName: "Workflow Automation", slug: "apps", description: "Process automation and integration", applicationDetail: "Multi-step approval chains, conditional routing, automated notifications, and the integration with external systems that eliminates manual data transfer." },
      { serviceName: "Operations UX Design", slug: "ux-ui-design", description: "High-efficiency internal interfaces", applicationDetail: "Interfaces optimized for 8-hour daily use: keyboard navigation, bulk operations, saved filters, contextual actions, and the density that power users demand." },
      { serviceName: "Integration Architecture", slug: "devops", description: "System connectors and data sync", applicationDetail: "Bidirectional connectors to Salesforce, ERPs, databases, and third-party APIs with real-time sync, error handling, and the retry logic that keeps systems consistent." },
    ],
    "embedded": [
      { serviceName: "Firmware Engineering", slug: "websites", description: "Application and system firmware", applicationDetail: "Bare-metal or RTOS-based firmware with clean architecture: HAL layer, application logic, and communication stack separated for maintainability and hardware portability." },
      { serviceName: "Cloud Backend", slug: "apps", description: "Device cloud and management platform", applicationDetail: "Web dashboards for fleet management, firmware distribution systems, telemetry collection, and the APIs that mobile companion apps use to interact with devices." },
      { serviceName: "Hardware UX Design", slug: "ux-ui-design", description: "Physical and companion app interfaces", applicationDetail: "LED patterns, button interactions, companion app flows, and the setup/pairing experience that gets devices connected without a manual or support call." },
      { serviceName: "Embedded DevOps", slug: "devops", description: "CI/CD for firmware and OTA delivery", applicationDetail: "Hardware-in-the-loop testing, automated firmware builds, OTA delivery infrastructure, and the staged rollout system that validates updates before full fleet deployment." },
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
    // BY PRODUCT TYPE
    "web-app": [
      {
        title: "Architecture Decisions That Survive the Next Two Years",
        content: [
          "Most web apps get rewritten within 18 months because of early architecture mistakes: wrong database choice, no separation between read and write paths, tightly coupled modules that make every change risky.",
          "We start with a modular monolith (not microservices) unless your traffic patterns specifically demand distribution. This gives you the deployment simplicity of one service with the code organization that supports a growing team.",
          "Authentication, authorization, and session management are handled correctly from day one. SSO integration, role-based access, API keys for integrations, and the token refresh flows that users never notice but developers always mess up.",
          "Real-time features (live updates, collaboration, presence) are architecturally expensive to add later. We build the WebSocket layer into the foundation so adding live features later is configuration, not re-architecture.",
        ],
        imagePath: `/images/startups/deep-web-app-1.jpg`,
        imageAlt: "CiroStack web application architecture planning",
      },
      {
        title: "From First Deploy to Production Confidence",
        content: [
          "Your first deployment happens in week one. CI/CD pipelines, staging environments, and automated testing are set up before feature work begins. Deploying on any day, including Friday, should be boring.",
          "We implement feature flags from the start so incomplete features deploy to production without being visible to users. This means your main branch is always deployable and releases are a toggle, not a ceremony.",
          "Monitoring is not a post-launch addition. Error tracking, performance metrics, and uptime alerts are configured during development so we catch problems before users report them.",
          "Database migrations are automated and reversible. Schema changes deploy with zero downtime using expand-contract patterns. Your data model evolves safely as your product evolves.",
        ],
        imagePath: `/images/startups/deep-web-app-2.jpg`,
        imageAlt: "Web application CI/CD and deployment infrastructure",
      },
    ],
    "mobile-app": [
      {
        title: "The Platform Decision That Saves or Costs You $100K",
        content: [
          "React Native shares 90%+ of code between iOS and Android. That saves 40-60% on development and maintenance compared to two native codebases. But it has limits: specific hardware features, complex animations, and AR require native.",
          "We assess your feature set honestly. If your app is primarily data display, forms, and navigation (most B2B and utility apps), React Native delivers faster at lower cost. If you need HealthKit, AR, or platform-specific gesture systems, we go native.",
          "The hidden cost of mobile is not development, it is maintenance. Two native codebases means two sets of bugs, two review cycles, and two engineers for every feature. React Native halves this ongoing cost.",
          "Performance is no longer a React Native weakness. With the new architecture (Fabric renderer, TurboModules), our React Native apps achieve 60fps animations and startup times indistinguishable from native.",
        ],
        imagePath: `/images/startups/deep-mobile-app-1.jpg`,
        imageAlt: "CiroStack mobile app platform strategy",
      },
      {
        title: "Surviving the App Store Review Process",
        content: [
          "App store rejections delay launches by 1-2 weeks per rejection. We build compliance into the development process: metadata guidelines, privacy nutrition labels, payment rules, and content policies checked before first submission.",
          "iOS requires specific privacy disclosures (App Tracking Transparency, nutrition labels) that change regularly. We track Apple's guidelines and update your submission metadata proactively.",
          "In-app purchase requirements are strict and expensive (30% cut). We implement the correct payment flow (IAP for digital goods, Stripe for physical goods/services) so your app does not get rejected or lose 30% of revenue unnecessarily.",
          "Our mobile CI/CD handles TestFlight and Google Play internal tracks, automated screenshot generation for all device sizes, and the metadata localization that app store SEO requires.",
        ],
        imagePath: `/images/startups/deep-mobile-app-2.jpg`,
        imageAlt: "Mobile app store submission and release management",
      },
    ],
    "ai-product": [
      {
        title: "RAG Is Not a Solved Problem. It Is an Engineering Problem.",
        content: [
          "Everyone has a RAG demo. Few have RAG in production serving real users. The difference: chunking strategy tuned to your content type, retrieval ranking calibrated to your query patterns, and eval pipelines that measure quality continuously.",
          "Chunking strategy depends on your content: legal documents need section-aware splitting, technical docs need code-block preservation, conversational content needs turn boundaries. One-size-fits-all chunking produces mediocre retrieval.",
          "Embedding model choice matters more than most teams realize. Domain-specific fine-tuned embeddings outperform general-purpose ones by 20-40% on retrieval relevance. We test multiple approaches against your actual query distribution.",
          "Retrieval is not just vector similarity. We build hybrid search (dense + sparse), re-ranking layers, metadata filtering, and the contextual retrieval that brings back the right information, not just the mathematically closest text.",
        ],
        imagePath: `/images/startups/deep-ai-product-1.jpg`,
        imageAlt: "CiroStack building production RAG pipelines",
      },
      {
        title: "Making AI Feel Fast When It Is Not",
        content: [
          "LLM inference takes 2-5 seconds for a complete response. Streaming token-by-token makes this feel instant to users. But streaming introduces complexity: error handling mid-stream, output validation on incomplete text, and progressive UI rendering.",
          "Caching strategies for AI are different than traditional APIs. Semantic caching (similar questions get cached answers) reduces costs 30-50% and improves latency. But cache invalidation requires knowing when your source data changes.",
          "We build confidence scoring into every AI output. When the model is uncertain, the UI shows it. This builds user trust over time because the system is honest about its limitations rather than confidently wrong.",
          "Eval pipelines are the difference between an AI feature that improves over time and one that silently degrades. We build automated quality scoring, regression detection, and A/B testing infrastructure that catches problems before users lose trust.",
        ],
        imagePath: `/images/startups/deep-ai-product-2.jpg`,
        imageAlt: "AI product UX patterns and evaluation infrastructure",
      },
    ],
    "saas-platform": [
      {
        title: "Multi-Tenancy: The Decision You Cannot Undo Cheaply",
        content: [
          "Every SaaS startup faces this question on day one: how do we isolate customer data? Row-level isolation (shared database, tenant_id column) is cheapest but hardest to audit. Schema isolation is moderate. Database isolation is most expensive but simplest to reason about.",
          "We help you choose based on your actual constraints: regulatory requirements, customer size distribution, and where you expect to be in 2 years. Most startups begin with row-level isolation and add dedicated databases for enterprise customers later.",
          "Tenant isolation is not just a database concern. Background jobs, file storage, caching layers, and search indexes all need tenant awareness. A single leak in any layer exposes customer data.",
          "We build automated tenant isolation testing that runs on every deployment. Cross-tenant data leakage is tested explicitly, not assumed. This is the evidence enterprise security reviews demand.",
        ],
        imagePath: `/images/startups/deep-saas-platform-1.jpg`,
        imageAlt: "CiroStack multi-tenant SaaS architecture design",
      },
      {
        title: "From Free Trial to Enterprise Contract",
        content: [
          "Self-serve onboarding converts when users reach value in under 3 minutes. We instrument the activation funnel, identify the 'aha moment', and remove every obstacle between signup and that moment.",
          "Plan management is deceptively complex: upgrades, downgrades, plan changes mid-cycle, grandfathered features, and usage-based overages all need to work correctly or you lose revenue or trust.",
          "Enterprise features (SSO, SCIM, audit logs, custom SLAs) are not technical challenges, they are sales enablers. Each one you ship unblocks a tier of customer who cannot sign without it. We build them in order of deal value.",
          "Admin tooling (tenant management, usage monitoring, support tools) is the infrastructure your team needs but customers never see. We build it alongside the product because operations without admin tools does not scale past 50 customers.",
        ],
        imagePath: `/images/startups/deep-saas-platform-2.jpg`,
        imageAlt: "SaaS onboarding and enterprise feature development",
      },
    ],
    "marketplace": [
      {
        title: "Solving the Chicken-and-Egg Problem",
        content: [
          "Every marketplace faces the same existential question: why would suppliers list if there are no buyers? Why would buyers come if there are no listings? This is not a marketing problem. It is a product architecture problem.",
          "Single-player mode gives one side of the marketplace value without the other side present. Sellers get a listing management tool. Buyers get a discovery tool. When critical mass arrives, the marketplace mechanics activate.",
          "Supply seeding (curating initial inventory yourself, importing from public sources, or offering free listings) gets the marketplace past the empty-shelf problem. We build the infrastructure for rapid content population.",
          "Geographic or category focus (launch in one city, one category) lets you achieve density faster. Our architecture supports this progressive expansion with location-aware features and configurable service areas.",
        ],
        imagePath: `/images/startups/deep-marketplace-1.jpg`,
        imageAlt: "CiroStack marketplace cold-start strategy",
      },
      {
        title: "Money Between Strangers: Trust Infrastructure",
        content: [
          "Marketplace payments are not simple e-commerce transactions. Money flows from buyer to platform to seller, with platform fees, refund holds, and delayed payouts. Stripe Connect handles the mechanics, but the business logic is custom.",
          "Dispute resolution cannot be manual past 100 transactions/day. We build automated arbitration workflows with evidence collection, time-bound response windows, and escalation paths that keep resolution fair and fast.",
          "Trust signals (verified identity, ratings, response time, cancellation rate) compound over time. We build reputation systems that reward reliable participants and surface risk indicators before transactions happen.",
          "Fraud on marketplaces is creative: fake listings, payment interception, review manipulation, and account takeover. We implement detection layers that catch patterns humans miss while minimizing false positives on legitimate users.",
        ],
        imagePath: `/images/startups/deep-marketplace-2.jpg`,
        imageAlt: "Marketplace payment infrastructure and trust systems",
      },
    ],
    "api-product": [
      {
        title: "Developer Experience Is Your Growth Engine",
        content: [
          "Developers evaluate API products in under 10 minutes. If they cannot authenticate, make a successful call, and understand the response in that window, they move on. Your onboarding must be frictionless.",
          "Interactive documentation (try-it-now buttons, pre-filled examples, live response previews) converts browsers into users. Static docs get bookmarked and forgotten. We build docs that are tools, not reference manuals.",
          "Error messages are developer UX. A 400 response that says 'Bad Request' is useless. A 400 that says 'The date field must be ISO 8601 format (e.g., 2024-01-15T09:00:00Z)' is helpful. We design every error response to explain the fix.",
          "SDKs in multiple languages are table-stakes for developer adoption. We auto-generate from your OpenAPI spec, then manually polish for idiomatic usage patterns in each language. Generated code that feels hand-written.",
        ],
        imagePath: `/images/startups/deep-api-product-1.jpg`,
        imageAlt: "CiroStack building developer-friendly API products",
      },
      {
        title: "Scaling Without Surprises",
        content: [
          "Rate limiting is the tension between protecting your infrastructure and not frustrating power users. We implement tiered limits (per key, per endpoint, per time window) with clear headers that tell developers exactly how much capacity remains.",
          "Usage metering for billing must be both accurate (customers will dispute errors) and performant (metering cannot add latency to every request). We build async metering with reconciliation checks.",
          "Versioning your API is a permanent decision. We typically recommend URL-path versioning (/v1/, /v2/) for its clarity, with a deprecation policy that gives developers migration time and tooling.",
          "Uptime matters more for API products than any other product type. Your customers' products break when your API breaks. We build redundancy, health checks, and the status page infrastructure that maintains developer trust.",
        ],
        imagePath: `/images/startups/deep-api-product-2.jpg`,
        imageAlt: "API product scaling and reliability infrastructure",
      },
    ],
    "data-platform": [
      {
        title: "Pipelines That Fix Themselves at 3am",
        content: [
          "Pipeline failures are inevitable. Source APIs change schemas, rate limits tighten, networks blip. The difference between a good data platform and a bad one is not preventing failures, it is recovering from them automatically.",
          "We build idempotent pipelines: re-running a failed job produces the correct result without duplicates or missing data. This means failures at 3am fix themselves on retry without waking an engineer.",
          "Data quality checks run at every stage: schema validation at ingestion, freshness and volume checks after transformation, and anomaly detection before data reaches dashboards. Bad data never makes it to decisions.",
          "Orchestration (Airflow, Dagster, or Prefect) manages dependencies between pipeline stages, handles retries with backoff, and alerts only when automatic recovery fails. Your team gets notified of problems, not symptoms.",
        ],
        imagePath: `/images/startups/deep-data-platform-1.jpg`,
        imageAlt: "CiroStack building self-healing data pipelines",
      },
      {
        title: "One Definition of Truth",
        content: [
          "The most expensive data problem is not technical, it is semantic: two analysts asking 'how many active users do we have' get different answers because they define 'active' differently.",
          "We implement a semantic layer (dbt metrics, Cube, or custom) that defines every business metric once. Revenue, churn, activation, retention. Every dashboard, report, and ad-hoc query uses the same definition.",
          "Self-serve analytics means stakeholders can answer their own questions without filing tickets. We build exploration interfaces with guardrails: pre-defined dimensions, curated datasets, and row-level security that prevents accidental exposure.",
          "Storage costs grow silently. Raw data ingestion without lifecycle policies creates six-figure bills within 18 months. We implement tiering (hot/warm/cold), partition pruning, and retention policies that keep costs predictable.",
        ],
        imagePath: `/images/startups/deep-data-platform-2.jpg`,
        imageAlt: "Data platform semantic layer and cost management",
      },
    ],
    "iot": [
      {
        title: "From Lab Prototype to 10,000 Devices in the Field",
        content: [
          "IoT prototypes work on a bench with perfect WiFi. Production devices operate in basements, warehouses, and rural areas with intermittent connectivity, temperature extremes, and physical abuse. We design for the production environment from day one.",
          "Device provisioning at scale requires automated enrollment: a new device powers on, authenticates itself, downloads its configuration, and starts reporting telemetry without human intervention. Manual setup does not scale past 50 units.",
          "Certificate management for device authentication is a fleet-scale problem: rotation schedules, revocation handling, and the key storage that prevents device impersonation. We build this into the provisioning pipeline.",
          "Fleet segmentation (by firmware version, location, hardware revision, customer) lets you roll out updates gradually, target specific configurations, and isolate problems without affecting the entire fleet.",
        ],
        imagePath: `/images/startups/deep-iot-1.jpg`,
        imageAlt: "CiroStack IoT device provisioning at scale",
      },
      {
        title: "OTA Updates That Never Brick Devices",
        content: [
          "A failed firmware update on a device in the field is potentially unrecoverable. We implement A/B partition schemes: the new firmware writes to the inactive partition, verification runs, and only then does the bootloader switch. Failure means the old firmware stays.",
          "Staged rollouts (1% of fleet, then 10%, then 100%) with automated health checks between stages catch firmware bugs that testing missed. A problem at 1% affects 100 devices instead of 10,000.",
          "Delta updates (sending only changed bytes) reduce bandwidth costs 60-80% and update times 70%+. For battery-powered devices on cellular connections, this is the difference between practical and impractical OTA.",
          "Telemetry from devices post-update confirms success: boot time, memory usage, connectivity stability, and application-layer health. If metrics degrade after an update, the system triggers automatic rollback before the next stage.",
        ],
        imagePath: `/images/startups/deep-iot-2.jpg`,
        imageAlt: "IoT firmware OTA update safety mechanisms",
      },
    ],
    "internal-tools": [
      {
        title: "Replacing the Secret Spreadsheet Empire",
        content: [
          "Every company has them: mission-critical spreadsheets with macros, manual data entry, and formulas that one person understands. When that person leaves or the spreadsheet breaks, operations stop.",
          "We start by observing the actual workflow, not the documented process. The real process has evolved around spreadsheet limitations, email approvals, and manual workarounds that the documented process does not mention.",
          "The replacement tool must be better than the spreadsheet on day one or nobody uses it. This means: faster data entry, less clicking, immediate visibility into queue status, and the bulk operations that spreadsheets handle natively.",
          "We build permission models that match your org chart: who can view vs. edit vs. approve vs. override. These models are deceptively complex because they encode business rules that nobody wrote down.",
        ],
        imagePath: `/images/startups/deep-internal-tools-1.jpg`,
        imageAlt: "CiroStack replacing spreadsheet-based operations",
      },
      {
        title: "Tools That Connect to Everything",
        content: [
          "Internal tools exist in a web of systems: CRM data flows in, ERP data flows out, email notifications trigger, and Slack alerts fire. Isolated tools that require manual data transfer get abandoned.",
          "We build bidirectional connectors: changes in your tool update Salesforce. Changes in Salesforce appear in your tool. No nightly CSV exports, no copy-paste between windows, no data staleness.",
          "Integration reliability matters more than speed. A failed sync between your tool and your ERP means orders get lost. We implement retry logic, dead-letter queues, and reconciliation reports that catch discrepancies.",
          "Internal tools without per-seat licensing mean your entire operations team can use them. Retool charges per user. Custom tools scale to 500 users at the same infrastructure cost as 5.",
        ],
        imagePath: `/images/startups/deep-internal-tools-2.jpg`,
        imageAlt: "Internal tool system integrations and automation",
      },
    ],
    "embedded": [
      {
        title: "Firmware That Survives Real-World Conditions",
        content: [
          "Lab conditions lie. Firmware that works perfectly on a bench fails in production: temperature cycling stresses flash memory, electrical noise corrupts I2C buses, and battery voltage sag triggers undefined behavior.",
          "We architect firmware with clean separation: hardware abstraction layer (HAL), application logic, and communication stack. When you change MCUs (and you will), only the HAL layer needs rewriting.",
          "Memory management in embedded systems does not have a garbage collector to save you. We use static allocation patterns, buffer pool management, and the analysis tools that catch leaks before they cause field failures.",
          "Watchdog timers, stack overflow detection, and fault handlers are not optional. When firmware hangs in the field, recovery mechanisms must be in place. We design for every failure mode we have seen in production.",
        ],
        imagePath: `/images/startups/deep-embedded-1.jpg`,
        imageAlt: "CiroStack embedded firmware architecture",
      },
      {
        title: "From Firmware to Cloud: The Full Stack",
        content: [
          "Connected devices need a cloud backend: telemetry collection, remote configuration, fleet management, and the dashboards that operations teams use to monitor deployed hardware.",
          "Communication protocols matter. MQTT for real-time bidirectional messaging. CoAP for constrained devices on cellular. HTTPS for devices with reliable WiFi. We choose based on your power budget and connectivity reality.",
          "Power optimization is measured, not estimated. We profile real hardware under real workloads and optimize: sleep modes, transmission scheduling, peripheral duty cycling. The difference between 2-week and 6-month battery life.",
          "Hardware-in-the-loop CI runs automated tests on real devices. This catches bugs that simulation misses: timing-dependent failures, hardware-specific edge cases, and the integration issues between firmware and PCB revisions.",
        ],
        imagePath: `/images/startups/deep-embedded-2.jpg`,
        imageAlt: "Embedded system cloud connectivity and testing",
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
    // BY PRODUCT TYPE
    "web-app": [
      "Senior full-stack engineers with React/Next.js and backend expertise",
      "Architecture review and tech stack recommendation in week one",
      "CI/CD pipeline and staging environment operational before feature work begins",
      "Real-time capability (WebSockets) architected into the foundation",
      "Automated testing on all critical user paths",
      "Performance budget defined and monitored throughout development",
    ],
    "mobile-app": [
      "Platform recommendation (React Native vs. native) with honest tradeoff analysis",
      "App store metadata and compliance handled before first submission",
      "Offline-first architecture with conflict resolution documented",
      "Performance profiling on real devices (not just simulators)",
      "Push notification infrastructure for both APNS and FCM",
      "TestFlight/Play Console internal testing from first working build",
    ],
    "ai-product": [
      "RAG pipeline architecture review before implementation begins",
      "Eval suite with golden dataset created before shipping to users",
      "Streaming response UI with error recovery tested under load",
      "Hallucination rate measurement and monitoring from launch",
      "Source citation accuracy validated against human-reviewed ground truth",
      "Cost monitoring per query with optimization recommendations",
    ],
    "saas-platform": [
      "Multi-tenancy isolation strategy documented and reviewed in week one",
      "Billing integration tested with all plan types and edge cases",
      "Self-serve onboarding funnel instrumented from first build",
      "Feature flag system for per-plan access control",
      "Admin console for tenant management built alongside product",
      "Enterprise feature roadmap prioritized by deal value unlocked",
    ],
    "marketplace": [
      "Cold-start strategy documented before development begins",
      "Stripe Connect integration with all payment flows tested end-to-end",
      "Trust and safety features (verification, moderation, disputes) in V1",
      "Supply and demand metrics instrumented from launch",
      "Matching algorithm performance benchmarked against manual matching",
      "Fraud detection rules active from first transaction",
    ],
    "api-product": [
      "OpenAPI specification written and reviewed before implementation",
      "Interactive documentation deployed alongside first endpoints",
      "SDK generation pipeline established for 4+ languages",
      "Rate limiting and usage metering tested under load",
      "Developer onboarding flow (signup to first call) measured and optimized",
      "Uptime monitoring and status page operational from launch",
    ],
    "data-platform": [
      "Source system inventory and data quality assessment in week one",
      "Pipeline idempotency verified with automated retry testing",
      "Data quality checks at ingestion, transformation, and serving layers",
      "Semantic layer with metric definitions approved by stakeholders",
      "Storage cost projections at 6-month and 12-month scale",
      "Alerting configured for freshness, volume, and schema changes",
    ],
    "iot": [
      "Device provisioning workflow automated before hardware ships",
      "OTA update mechanism tested with failure injection (power loss, network drop)",
      "Telemetry pipeline load-tested at 10x projected device count",
      "Firmware architecture review with hardware team before coding begins",
      "Fleet segmentation and staged rollout tooling operational",
      "Device health monitoring and anomaly detection from first deployment",
    ],
    "internal-tools": [
      "Current workflow observation (not just documented process) before design",
      "Permission model designed to match actual org chart and approval chains",
      "Integration connectors tested bidirectionally with source systems",
      "Adoption metrics tracked from first internal release",
      "Bulk operations and keyboard shortcuts for power user efficiency",
      "No per-seat licensing: unlimited users at flat infrastructure cost",
    ],
    "embedded": [
      "Firmware architecture review with hardware team before first line of code",
      "OTA update mechanism with rollback tested on real hardware",
      "Power consumption measured on target hardware under real workloads",
      "Hardware-in-the-loop CI for automated regression testing",
      "Communication protocol selected based on power budget and connectivity",
      "Field failure recovery mechanisms (watchdog, safe mode) tested",
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
    // BY PRODUCT TYPE
    "web-app": [
      "Production web application deployed with CI/CD pipeline",
      "Complete source code with architecture decision documentation",
      "Automated test suite covering critical user paths",
      "Staging environment mirroring production configuration",
      "Monitoring dashboard with uptime, performance, and error tracking",
      "Technical documentation for your future engineering team",
    ],
    "mobile-app": [
      "iOS and Android apps published to respective stores",
      "Complete source code with platform architecture documentation",
      "Offline sync implementation with conflict resolution documentation",
      "Push notification infrastructure (APNS + FCM) configured and tested",
      "Mobile CI/CD pipeline with TestFlight and Play Console integration",
      "App store assets, metadata, and release management documentation",
    ],
    "ai-product": [
      "Production AI feature with RAG pipeline deployed and monitored",
      "Complete source code with pipeline architecture documentation",
      "Eval suite with golden dataset and automated quality scoring",
      "Streaming response UI with error recovery and loading states",
      "Quality monitoring dashboard with hallucination rate tracking",
      "Cost-per-query analysis with optimization recommendations",
    ],
    "saas-platform": [
      "Multi-tenant platform deployed with isolation verification tests",
      "Complete source code with tenancy architecture documentation",
      "Billing integration with all plan types and edge cases documented",
      "Self-serve onboarding flow with instrumentation",
      "Admin console for tenant and subscription management",
      "Enterprise feature documentation (SSO, audit, RBAC specifications)",
    ],
    "marketplace": [
      "Two-sided marketplace platform deployed and accepting transactions",
      "Complete source code with marketplace architecture documentation",
      "Stripe Connect integration with all payment flows tested",
      "Trust and safety system (verification, moderation, disputes)",
      "Matching algorithm with performance benchmarks documented",
      "Supply/demand analytics dashboard with growth metrics",
    ],
    "api-product": [
      "Production API deployed with rate limiting and monitoring",
      "Complete source code with API design documentation",
      "Interactive API documentation with code samples in 4+ languages",
      "SDKs for Python, JavaScript, Go, and Ruby published to package managers",
      "Usage metering and billing integration tested and documented",
      "Developer portal with onboarding flow, dashboard, and changelog",
    ],
    "data-platform": [
      "ELT pipelines deployed with automated scheduling and retry",
      "Complete source code with pipeline architecture documentation",
      "Data quality framework with checks at every pipeline stage",
      "Semantic layer with stakeholder-approved metric definitions",
      "Cost management configuration (tiering, partitioning, lifecycle)",
      "Monitoring and alerting for freshness, volume, and schema changes",
    ],
    "iot": [
      "IoT platform deployed with device provisioning automation",
      "Complete firmware source with architecture documentation",
      "OTA update system with rollback mechanism tested on hardware",
      "Telemetry pipeline handling projected device scale",
      "Fleet management dashboard with device health monitoring",
      "Staged rollout tooling with automated health verification",
    ],
    "internal-tools": [
      "Custom internal tool deployed and accessible to operations team",
      "Complete source code with workflow and permission documentation",
      "Bidirectional integrations with all connected systems",
      "Permission system matching org chart and approval workflows",
      "User training documentation and admin configuration guide",
      "No licensing fees: deployed on your infrastructure at flat cost",
    ],
    "embedded": [
      "Production firmware deployed on target hardware",
      "Complete firmware source with architecture documentation",
      "OTA update mechanism with A/B partition and rollback",
      "Cloud backend for device management and telemetry",
      "Hardware-in-the-loop CI pipeline for automated testing",
      "Power consumption report with optimization recommendations",
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
    // BY PRODUCT TYPE
    "web-app": [
      { question: "What tech stack do you recommend for web apps?", answer: "Next.js (React) for the frontend in almost every case. Backend depends on your needs: Node.js for real-time features, Python for data-heavy apps, Go for high-throughput APIs. PostgreSQL unless you have a specific reason not to. We choose what fits, not what is trendy." },
      { question: "How do you handle real-time features?", answer: "WebSocket infrastructure built into the foundation. We use Socket.io or native WebSockets depending on complexity, with Redis Pub/Sub for horizontal scaling. Live updates, presence indicators, and collaboration features without polling." },
      { question: "What about SEO and performance?", answer: "Next.js gives you server-side rendering for SEO out of the box. We set performance budgets (LCP under 2.5s, FID under 100ms) and monitor throughout development. Core Web Vitals are a deployment gate, not a post-launch fix." },
      { question: "How do you handle authentication?", answer: "NextAuth or custom auth depending on complexity. We implement SSO (Google, Microsoft, SAML), MFA, magic links, and session management correctly from day one. Auth is never a bolt-on; it is a foundation." },
      { question: "How long does a web app take to build?", answer: "A core application (auth, main features, admin panel) takes 6-10 weeks. Adding real-time collaboration adds 3-4 weeks. Complex dashboards with data visualization add 2-4 weeks. We scope precisely before quoting." },
    ],
    "mobile-app": [
      { question: "Should we use React Native or go native?", answer: "React Native for 80% of apps: data-driven interfaces, standard navigation, offline capability. Native Swift/Kotlin when you need: ARKit, HealthKit integration, complex custom animations, or Bluetooth hardware interaction. We assess your feature list and recommend honestly." },
      { question: "How do you handle offline functionality?", answer: "Local SQLite or Realm database for offline data, operation queuing for actions taken offline, and conflict resolution when sync happens. The app works fully without connectivity and syncs transparently when it returns." },
      { question: "What about app store approval?", answer: "We handle metadata compliance, privacy policy, App Tracking Transparency, in-app purchase rules, and content guidelines before first submission. Our first-submission approval rate is 95%. Rejections (when they happen) are resolved in 2-3 days." },
      { question: "How do push notifications work across platforms?", answer: "Unified backend that dispatches to both APNS (iOS) and FCM (Android) with delivery tracking. Rich notifications with images, action buttons, and deep links. Backend handles token management, delivery receipts, and the retry logic for failed deliveries." },
      { question: "How long does a mobile app take to build?", answer: "A core app (auth, main feature, offline support, notifications) takes 8-12 weeks with React Native. Native development for both platforms takes 12-16 weeks. Add 1-2 weeks for first store submission and approval process." },
    ],
    "ai-product": [
      { question: "We already have an API key. What else do we need?", answer: "An API key gives you a model call. A production AI product needs: retrieval infrastructure (RAG), quality evaluation pipelines, streaming UI, error handling, cost management, and monitoring. The model call is 10% of the engineering work." },
      { question: "How do you prevent hallucination?", answer: "Source grounding (RAG retrieves from your verified data), confidence scoring (uncertain outputs are flagged), citation generation (every claim links to a source), and eval pipelines that measure hallucination rate continuously in production." },
      { question: "What about latency? LLMs are slow.", answer: "Streaming token-by-token makes 3-second generation feel instant. Semantic caching returns instant results for similar queries (30-50% cache hit rate typical). Pre-computation for predictable queries. The UI patterns matter as much as the infrastructure." },
      { question: "How do you measure AI quality?", answer: "Automated eval suites with golden datasets (human-verified correct answers). We measure: accuracy, relevance, citation correctness, and hallucination rate. Regression alerts fire when quality drops. A/B testing for model or prompt changes." },
      { question: "How long does an AI product take to build?", answer: "A basic AI feature (chat, summarization) takes 6-8 weeks. RAG with domain-specific content takes 10-14 weeks (chunking and retrieval tuning is iterative). Products with eval infrastructure and quality monitoring take 12-16 weeks." },
    ],
    "saas-platform": [
      { question: "What multi-tenancy model do you recommend?", answer: "Row-level isolation (shared database, tenant_id on every table) for most startups. It is cheapest to operate and simplest to build. Schema isolation for regulated industries. Database-per-tenant for enterprise customers who contractually require it. We help you choose and plan for migration later." },
      { question: "How do you handle billing complexity?", answer: "Stripe Billing or Chargebee with custom logic for: plan changes mid-cycle (prorations), usage overages, dunning (failed payment retries), and the invoice line items that enterprise customers need. We test every edge case before launch." },
      { question: "When should we add enterprise features like SSO?", answer: "When your first enterprise prospect asks for it and the deal is large enough to justify 2-4 weeks of engineering. Typically at $50K+ ACV. We build SSO (SAML/OIDC), SCIM, and audit logs in order of deal value unlocked." },
      { question: "How do you handle self-serve onboarding?", answer: "We identify the activation moment (the action that correlates with conversion), then remove every obstacle between signup and that moment. Instrumentation from day one, funnel analysis weekly, and iteration until signup-to-value takes under 3 minutes." },
      { question: "How long does a SaaS platform take to build?", answer: "Core platform (multi-tenancy, auth, billing, main features) takes 10-14 weeks. Adding enterprise features (SSO, SCIM, audit logs) adds 4-6 weeks. Admin tooling adds 2-4 weeks. Most clients launch core first, then add enterprise features as deals require them." },
    ],
    "marketplace": [
      { question: "How do you solve the chicken-and-egg problem?", answer: "Product-level solutions: single-player mode (value without the other side), supply seeding (curate initial inventory yourself), geographic focus (achieve density in one area first). We build the infrastructure for all three approaches and measure which works." },
      { question: "How do payments work between parties?", answer: "Stripe Connect handles the mechanics: buyer pays, platform holds funds, seller gets paid minus platform fee. We build the business logic on top: escrow holds, release conditions, refund flows, and the dispute resolution that Stripe's default flow does not cover." },
      { question: "How do you handle fraud and bad actors?", answer: "Verification at signup (identity, payment method, business validation). Transaction monitoring for suspicious patterns. Content moderation (automated + human review queue). Reputation scoring that surfaces risk before transactions happen. All in V1." },
      { question: "What about matching and search?", answer: "We build relevance ranking that balances: quality signals (ratings, response time), freshness (new listings get exposure), geographic proximity, and seller fairness (no one gets permanently buried). Search filters, saved searches, and alerts for new matches." },
      { question: "How long does a marketplace take to build?", answer: "Core marketplace (listings, search, basic payments) takes 8-12 weeks. Adding trust/safety, advanced matching, and dispute resolution adds 4-8 weeks. Full platform with analytics, admin tools, and growth mechanics takes 14-18 weeks." },
    ],
    "api-product": [
      { question: "How do you design APIs for developer adoption?", answer: "Consistent naming, predictable pagination, meaningful error messages, and idempotent operations. We follow the principle: a developer should be able to guess your API structure after learning one endpoint. OpenAPI spec first, implementation second." },
      { question: "Do you build SDKs for multiple languages?", answer: "Yes. We auto-generate from your OpenAPI spec (Python, JavaScript, Go, Ruby), then manually polish each for idiomatic usage. Auto-generated code that feels hand-written. Published to PyPI, npm, Go modules, and RubyGems." },
      { question: "How do you handle rate limiting fairly?", answer: "Tiered limits per API key (not just global). Per-endpoint limits for expensive operations. Burst allowances for legitimate spikes. Clear response headers showing remaining quota. Rate limit increases available by request (not just by upgrading plans)." },
      { question: "How do you handle API versioning?", answer: "URL-path versioning (/v1/, /v2/) for clarity. Minimum 12-month deprecation periods with migration guides. Sunset headers on deprecated versions. We design v1 to be extensible so v2 is rarely needed." },
      { question: "How long does an API product take to build?", answer: "Core API (endpoints, auth, rate limiting, docs) takes 6-10 weeks. Adding SDKs in 4 languages adds 3-4 weeks. Developer portal with dashboard, analytics, and billing adds 4-6 weeks. Full developer platform takes 12-16 weeks." },
    ],
    "data-platform": [
      { question: "What data warehouse do you recommend?", answer: "BigQuery for Google-native teams (cheapest for ad-hoc queries). Snowflake for multi-cloud or complex access controls. Redshift for AWS-heavy teams already paying for reserved capacity. The choice depends on your cloud, team skills, and query patterns." },
      { question: "How do you handle data quality?", answer: "Checks at three layers: ingestion (schema validation, type checking), transformation (dbt tests, row counts, freshness), and serving (anomaly detection on final metrics). Bad data is quarantined and alerts fire before it reaches dashboards." },
      { question: "What is a semantic layer and do we need one?", answer: "A semantic layer defines business metrics (revenue, churn, active users) once, so every query uses the same definition. You need one when two people asking the same question get different answers. That usually happens around 5 analysts or 20 dashboards." },
      { question: "How do you keep warehouse costs under control?", answer: "Partition pruning (queries scan less data), materialized views (expensive joins computed once), hot/warm/cold tiering (old data moves to cheaper storage), and lifecycle policies (data older than X months gets archived or deleted). We project costs at scale before building." },
      { question: "How long does a data platform take to build?", answer: "Basic pipeline (3-5 sources, warehouse, one dashboard) takes 6-8 weeks. Full platform with quality framework, semantic layer, and self-serve analytics takes 12-16 weeks. Ongoing maintenance is typically 2-4 hours/week once pipelines are stable." },
    ],
    "iot": [
      { question: "How do you handle OTA updates safely?", answer: "A/B partition scheme: new firmware writes to inactive partition, integrity checks verify it, bootloader switches only after verification passes. If anything fails, the device stays on the working firmware. Staged rollouts (1%, 10%, 100%) catch issues before fleet-wide deployment." },
      { question: "What protocols do you use for device communication?", answer: "MQTT for real-time bidirectional messaging (most common). CoAP for extremely constrained devices on cellular (low bandwidth). HTTPS for devices with reliable WiFi and no real-time requirements. Choice depends on your power budget and connectivity." },
      { question: "How do you handle millions of telemetry data points?", answer: "Time-series databases (InfluxDB, TimescaleDB) with configurable aggregation windows. Raw data in cold storage for historical analysis. Real-time alerting on streaming data. Total cost stays linear with device count, not exponential." },
      { question: "What about security for connected devices?", answer: "X.509 certificates for device authentication, mutual TLS for all communication, secure boot for firmware integrity, and the certificate rotation infrastructure that keeps credentials fresh without manual intervention." },
      { question: "How long does an IoT platform take to build?", answer: "Device cloud (provisioning, management, telemetry) takes 8-12 weeks. Firmware with OTA updates takes 8-12 weeks (hardware dependent). Both in parallel is possible with separate teams. Full platform (cloud + firmware + mobile companion) takes 14-20 weeks." },
    ],
    "internal-tools": [
      { question: "Why not just use Retool or similar low-code tools?", answer: "Retool works for simple CRUD interfaces. It hits limits at: complex approval workflows, custom business logic, heavy integrations, or specific UX requirements. Also, per-seat pricing ($50+/user/month) adds up fast. Custom tools cost more upfront but nothing per user." },
      { question: "How do you handle integration with our existing systems?", answer: "Bidirectional connectors with retry logic and reconciliation. Changes in your tool propagate to Salesforce/ERP/database within seconds. Changes from those systems reflect in your tool equally fast. No CSV exports, no manual sync." },
      { question: "What if our team does not adopt the new tool?", answer: "We design alongside your operations team, not in isolation. The tool must be faster than the spreadsheet on day one for the specific tasks they do most often. We measure adoption in the first two weeks and iterate on friction points immediately." },
      { question: "How do you handle permissions and approvals?", answer: "Role-based access matching your org chart: view, edit, approve, and override permissions per team, per workflow, per record type. Approval chains with delegation, escalation, and the audit trail that compliance teams require." },
      { question: "How long does an internal tool take to build?", answer: "Simple admin panel with CRUD operations takes 4-6 weeks. Complex workflow tool with integrations and approval chains takes 8-12 weeks. Enterprise-grade internal platform with multiple tool modules takes 12-16 weeks." },
    ],
    "embedded": [
      { question: "What MCUs and platforms do you work with?", answer: "ARM Cortex-M series (STM32, nRF52, ESP32) for most IoT applications. Linux-based systems (Raspberry Pi, custom boards) for compute-heavy edge applications. RTOS (FreeRTOS, Zephyr) or bare-metal depending on your timing requirements." },
      { question: "How do you handle OTA updates without bricking devices?", answer: "A/B partition scheme with integrity verification. New firmware installs to inactive partition, boots once as a test, and only commits after application-level health checks pass. Any failure at any stage reverts to the known-good partition automatically." },
      { question: "How do you optimize battery life?", answer: "Measurement-driven optimization on real hardware: sleep mode configuration, peripheral power gating, transmission scheduling (batch sends vs. real-time), and duty cycling. We profile actual current draw and optimize the highest-drain operations first." },
      { question: "Can you work with our hardware team?", answer: "Yes. We collaborate on pin assignments, peripheral selection, power budget allocation, and PCB layout review for signal integrity. Clear HAL interfaces mean hardware revisions do not require firmware rewrites." },
      { question: "How long does firmware development take?", answer: "Basic connected device firmware (sensors, connectivity, OTA) takes 8-12 weeks. Complex firmware (multiple peripherals, real-time processing, safety-critical) takes 12-20 weeks. Timeline depends heavily on hardware readiness and stability." },
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
    // BY PRODUCT TYPE
    "web-app": ["SaaS dashboards serving 10,000+ daily active users", "Collaboration tools with real-time multi-user editing", "Analytics platforms processing millions of events daily", "Admin panels replacing 15+ spreadsheets for operations teams"],
    "mobile-app": ["Consumer apps published to both App Store and Google Play", "Enterprise mobile tools used by field teams in 20+ countries", "Health and fitness apps integrating with HealthKit and Google Fit", "Offline-first apps for workers in low-connectivity environments"],
    "ai-product": ["Legal research tools with 98%+ citation accuracy", "Customer support AI handling 60% of tickets without human escalation", "Content generation platforms serving 50,000+ monthly users", "Document analysis systems processing 10,000+ files daily"],
    "saas-platform": ["Multi-tenant platforms serving 2,000+ business customers", "Usage-based billing platforms processing $5M+ monthly", "Enterprise SaaS with SOC 2 certification passed first attempt", "PLG products converting 12%+ free trials to paid subscriptions"],
    "marketplace": ["Service marketplaces processing 10,000+ monthly bookings", "B2B marketplaces connecting 500+ suppliers with enterprise buyers", "Rental marketplaces managing $2M+ monthly transaction volume", "Talent marketplaces matching 5,000+ professionals to opportunities"],
    "api-product": ["Developer tools with 99.99% uptime serving 1,000+ API consumers", "Payment APIs processing 500K+ transactions monthly", "Data APIs serving real-time feeds to 200+ enterprise customers", "Integration platforms connecting 50+ third-party services"],
    "data-platform": ["Analytics platforms processing 100M+ events daily", "Business intelligence systems serving 200+ internal analysts", "Customer data platforms unifying 15+ source systems", "ML feature stores powering real-time recommendation engines"],
    "iot": ["Smart building platforms managing 5,000+ sensors across 50 properties", "Agricultural IoT monitoring 2,000+ field sensors with offline capability", "Industrial monitoring systems with sub-second alerting on anomalies", "Consumer hardware products with 50,000+ devices in the field"],
    "internal-tools": ["Operations platforms replacing 20+ spreadsheets and saving 40 hours/week", "Approval workflow systems processing 500+ requests daily", "Inventory management tools tracking 100,000+ SKUs in real-time", "Customer support tools reducing resolution time by 60%"],
    "embedded": ["Consumer electronics products shipped to 50,000+ customers", "Industrial monitoring devices deployed in harsh environments", "Medical devices passing regulatory testing on first submission", "Agricultural sensors operating 18+ months on a single battery"],
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
    // BY PRODUCT TYPE
    "web-app": [
      { text: "15,000 daily users with zero downtime in 14 months. CiroStack's architecture handles our traffic spikes during month-end reporting without us even noticing.", name: "Mark D.", role: "CTO, Analytics Platform" },
      { text: "Real-time collaboration was supposed to be our V3 feature. CiroStack built it into the foundation and we shipped it in V1. Users mention it in every positive review.", name: "Sarah L.", role: "Founder, Project Management Tool" },
    ],
    "mobile-app": [
      { text: "Both stores approved on first submission. Our previous agency got rejected three times on iOS alone. CiroStack handled the metadata, privacy labels, and review guidelines from day one.", name: "David H.", role: "Founder, Consumer App" },
      { text: "Our field workers use the app in tunnels, basements, and rural areas. Offline mode works flawlessly and syncs the moment they get signal. Zero data loss in 8 months of production use.", name: "Jennifer M.", role: "VP Operations, Field Service Company" },
    ],
    "ai-product": [
      { text: "Our legal AI cites sources with 98.5% accuracy. Attorneys trust it because it says 'I am not sure' when it is not sure. CiroStack understood that honesty is the product feature, not just accuracy.", name: "Nathan B.", role: "Founder, Legal AI Platform" },
      { text: "The eval pipeline CiroStack built catches quality regressions before our users see them. Last month it flagged a prompt change that would have degraded 15% of responses. Caught and fixed in hours, not weeks.", name: "Lisa C.", role: "CTO, AI Writing Tool" },
    ],
    "saas-platform": [
      { text: "Zero tenant data leakage across 1,800 customers over two years. When enterprise prospects ask about our isolation architecture, I send them CiroStack's documentation and they sign within the week.", name: "Kevin H.", role: "CEO, Vertical SaaS" },
      { text: "Free trial to paid conversion jumped from 4% to 11% after CiroStack rebuilt our onboarding. They identified our activation moment (creating the first report) and removed every obstacle to reaching it.", name: "Anna P.", role: "Founder, Analytics SaaS" },
    ],
    "marketplace": [
      { text: "We solved the cold-start problem in one city in 8 weeks. CiroStack built single-player mode for our supply side and geographic expansion tools. We launched in 4 more cities within 6 months.", name: "Carlos M.", role: "Founder, Service Marketplace" },
      { text: "Stripe Connect integration handles 8,000 daily transactions with split payments, holds, and refunds. Zero accounting discrepancies in 12 months. CiroStack knew every edge case before we hit it.", name: "Emma T.", role: "CTO, B2B Marketplace" },
    ],
    "api-product": [
      { text: "Developers make their first successful API call in 3 minutes. CiroStack built onboarding that is so good we use it as a competitive advantage. Our docs literally sell for us.", name: "Alex C.", role: "CEO, Data API Platform" },
      { text: "99.99% uptime over 18 months serving 800+ developer customers. Rate limiting works so well that not a single legitimate user has complained about being throttled.", name: "Jordan W.", role: "Founder, Integration API" },
    ],
    "data-platform": [
      { text: "Pipeline failures used to wake someone up twice a week. CiroStack rebuilt our pipelines to be idempotent and self-healing. We have not had a 3am page in 6 months.", name: "Maria S.", role: "Head of Data, Series B Startup" },
      { text: "Every analyst now works from the same metric definitions. The arguments about 'whose numbers are right' disappeared the week CiroStack's semantic layer went live.", name: "David K.", role: "VP Analytics, E-commerce Company" },
    ],
    "iot": [
      { text: "12,000 devices in the field with zero bricked units from firmware updates. CiroStack's A/B partition approach gives us confidence to ship updates weekly instead of quarterly.", name: "Thomas R.", role: "CTO, Smart Building Startup" },
      { text: "Battery life went from 3 weeks to 14 months after CiroStack optimized our firmware. Same hardware. They found power drains that our internal team missed for 6 months.", name: "Rebecca L.", role: "Founder, Agricultural IoT Company" },
    ],
    "internal-tools": [
      { text: "Our operations team voluntarily abandoned their spreadsheets within 2 weeks. That never happens. CiroStack built a tool that is genuinely faster than the Excel workflow it replaced.", name: "Patricia N.", role: "COO, Logistics Company" },
      { text: "500 daily approval requests processed with full audit trail. What used to take email chains and Slack messages now takes one click. CiroStack understood our workflow better than we documented it.", name: "Robert F.", role: "VP Operations, Insurance Company" },
    ],
    "embedded": [
      { text: "50,000 units shipped with firmware CiroStack wrote. Field return rate is under 0.2%. Their testing approach catches bugs that our in-house team missed because they test on real hardware, not simulators.", name: "Steven A.", role: "VP Engineering, Consumer Electronics" },
      { text: "OTA updates deploy to our fleet every two weeks. Before CiroStack, we shipped firmware at manufacturing and never updated it. Now we fix bugs and add features to devices already in customers' hands.", name: "Angela W.", role: "CTO, Smart Home Startup" },
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
