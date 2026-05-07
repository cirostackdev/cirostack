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

  // Service applications: always prepend branding and append additional, even for overrides
  const primaryServices = o.serviceApplications ?? generateServiceApplications(id, base.parentCategory);
  const serviceApplications = ensureBrandingAndAdditional(id, base.parentCategory, primaryServices);

  return {
    ...base,
    challenges: o.challenges ?? generateChallenges(id, base.parentCategory),
    solutions: o.solutions ?? generateSolutions(id, base.parentCategory),
    valueProps: o.valueProps ?? generateValueProps(id),
    stats: o.stats ?? generateStats(id, base.parentCategory),
    serviceApplications,
    deepDive: o.deepDive ?? generateDeepDive(id, base.title),
    details: o.details ?? generateDetails(id, base.parentCategory),
    deliverables: o.deliverables ?? generateDeliverables(id, base.parentCategory),
    startingAt: o.startingAt ?? generatePricing(id, base.parentCategory),
    faqs: o.faqs ?? generateFaqs(id, base.title, base.parentCategory),
    whoWeHelped: o.whoWeHelped ?? generateWhoWeHelped(id, base.parentCategory),
    clientReviews: o.clientReviews ?? generateClientReviews(id, base.parentCategory),
  };
}

function ensureBrandingAndAdditional(id: string, category: string, primary: StartupServiceApplication[]): StartupServiceApplication[] {
  // If already processed (has branding first), return as-is
  if (primary[0]?.slug === "startup-branding") return primary;

  const title = basicData[id]?.title ?? "";
  const branding = getBrandingCard(id, title, category);
  const allSlugs = ["startup-branding", ...primary.map(s => s.slug)];
  const additional = generateAdditionalServices(id, category, allSlugs);
  return [branding, ...primary, ...additional];
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
    "ai-startup": [
      "LLMs hallucinate confidently in production, and your users will find every edge case your eval suite missed.",
      "RAG retrieval quality degrades silently as your knowledge base grows: what worked at 1,000 documents fails at 100,000.",
      "Inference costs scale linearly with users. A product that costs $0.03 per query at 100 users costs $30,000/month at 1M queries.",
      "Latency expectations from users trained on Google mean 3-second generation times feel broken without streaming and progressive UI.",
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      "You cannot evaluate whether a developer is building the right thing or just billing hours because you do not speak the language.",
      "Technical decisions made early (database, framework, hosting) lock you in for years and cost $50-200K to change if wrong.",
      "Agencies send account managers who do not build your product. The person explaining progress is not the person writing code.",
      "You have no way to know if the estimate is honest or inflated. A 12-week quote might be 6 weeks of work and 6 weeks of padding.",
    ],
    "first-time-founder": [
      "You do not know what you do not know: the unknowns that kill first-time projects are invisible until they blow the timeline.",
      "Over-scoping the MVP is the single most expensive mistake first-time founders make. Building 20 features when 3 would validate the hypothesis.",
      "Choosing a tech stack based on blog posts or friend recommendations instead of the specific constraints of your product.",
      "Confusing building for yourself with building for your users. Your assumptions about what users want are probably wrong until tested.",
    ],
    "solo-founder": [
      "You are the CEO, sales, marketing, product, and support. Managing an engineering team on top of that is unsustainable.",
      "Context switching between business development and technical oversight costs you 30-40% productivity on both fronts.",
      "Hiring your first engineer takes 3-6 months. Your product cannot wait that long. You need output now, not in Q3.",
      "Without a technical co-founder, investors question whether you can execute. You need a shipped product that answers that question.",
    ],
    "repeat-founder": [
      "Your previous agency built what you asked for, not what you needed. They never pushed back because pushback does not bill hours.",
      "Junior developers disguised as senior engineers: the code compiles but the architecture does not survive the first 1,000 users.",
      "You know what good engineering looks like, but finding a partner who matches that standard without the 6-month hiring process is hard.",
      "Speed matters more this time. You have conviction about the market and you need execution velocity that matches your pace.",
    ],
    "student-startup": [
      "Your demo day is in 10 weeks and your budget is $5,000-$15,000. Most agencies will not even take the meeting.",
      "Accelerator judges and early investors need to see a working product, not a pitch deck and a promise.",
      "You have never managed a software project and do not know what questions to ask or what realistic timelines look like.",
      "The freelancer from Upwork disappeared mid-project. Your deadline has not moved. You need reliability, not just cheap labor.",
    ],
    "corporate-innovator": [
      "Your IT security review takes 3 months and requires documentation that startups do not normally produce.",
      "Legacy system integration is mandatory: the new product must connect to SAP, Salesforce, or custom internal APIs built in 2008.",
      "Procurement requires fixed-price contracts, SOW documentation, and insurance certifications that most dev shops cannot provide.",
      "Stakeholder alignment across 5 departments means requirements change after every steering committee meeting.",
    ],
    "female-led": [
      "Being quoted prices 20-40% higher than comparable male-led projects because vendors assume less technical literacy.",
      "Engineers who explain decisions patronizingly or dismiss your technical input without evaluation.",
      "Agencies that assign junior engineers to your project while giving senior resources to projects they perceive as more technically demanding.",
      "Having to prove technical competence repeatedly before your input is taken seriously by your own development team.",
    ],
    "african-startup": [
      "M-Pesa and Paystack are not Stripe: payment integration patterns for African markets have unique reconciliation and settlement challenges.",
      "Users on 2G connections with data budgets of $2/month require fundamentally different UX assumptions than users on fiber.",
      "USSD is still the primary digital access channel for millions of users. Ignoring it means ignoring your largest addressable market.",
      "Multi-country expansion across Africa means different telecom APIs, different payment providers, and different data localization laws per country.",
    ],
    "diaspora-founder": [
      "Multi-currency pricing requires more than exchange rate conversion: different pricing psychology, payment preferences, and purchasing power in each market.",
      "Cross-border payment flows (remittance, marketplace payments, subscriptions) involve two sets of financial regulations and two sets of payment rails.",
      "Dual-jurisdiction compliance means your product must satisfy regulatory requirements in both your home market and your current one simultaneously.",
      "UX that works across cultures: right-to-left languages, date formats, name field structures, and communication preferences all differ between markets.",
    ],
    "social-enterprise": [
      "Grant funders require specific deliverable formats, milestone reporting, and impact measurement that for-profit development partners do not understand.",
      "WCAG accessibility compliance is not optional when your users include people with disabilities. Most agencies treat it as a nice-to-have.",
      "Budget constraints of $5,000-$30,000 per project mean every feature must justify its cost in measurable social impact.",
      "Technology decisions must consider users with limited connectivity, older devices, and low digital literacy. Cutting-edge is not always appropriate.",
    ],
    // BY CHALLENGE
    "fast-mvp": [
      "Your competitor launched last month. Investors want a demo next month. The market window closes in 90 days. Standard agency timelines do not work.",
      "Most agencies take 4 weeks to write a proposal. By then, your market opportunity has moved. You need a team that starts in days, not months.",
      "Speed without quality creates technical debt that costs 3-5x to fix later. You need fast AND right, not fast AND disposable.",
      "Scope creep kills speed. Every feature added mid-build pushes the launch date. You need a partner who says no to scope expansion, not yes to billing more.",
    ],
    "scaling-tech": [
      "Your database queries took 50ms at 1,000 users and now take 4 seconds at 100,000. Adding more servers is not solving the problem.",
      "Engineers are afraid to deploy on Fridays because every release introduces regressions and there is no way to catch them before production.",
      "The feature backlog keeps growing but velocity keeps collapsing. Every estimate is wrong because nobody knows what will break when they change something.",
      "On-call pages are increasing monthly. P1 incidents that used to be quarterly are now weekly. The architecture is not keeping up with growth.",
    ],
    "agency-rescue": [
      "Your previous agency left code with no tests, no documentation, and architecture decisions nobody can explain.",
      "You have spent $50-200K and have a product that barely works, crashes under load, and cannot be modified without breaking something else.",
      "The agency disappeared mid-project or delivered something so far from the spec that it is unusable. Your deadline has not changed.",
      "New developers look at the codebase and immediately estimate 3-6 months just to understand it before they can make changes safely.",
    ],
    "fundraising-ready": [
      "VCs now hire CTOs to review codebases during due diligence. Security vulnerabilities found at this stage reduce valuations or kill rounds entirely.",
      "Your architecture diagram does not exist. Your security posture is undocumented. Load testing has never been run. Investors will ask about all three.",
      "Technical debt accumulated during the 'just ship it' phase is now a liability that sophisticated investors can see in the codebase.",
      "You have 6-8 weeks before your raise. The technical cleanup that should have happened over 6 months needs to happen now, strategically.",
    ],
    "ai-integration": [
      "Everyone wants AI features but nobody has defined what the AI should actually do, how quality will be measured, or what happens when it fails.",
      "RAG pipeline performance depends on chunking strategy, embedding choice, and retrieval ranking. None of these have obvious right answers for your specific content.",
      "LLM latency (2-5 seconds per response) conflicts with user expectations of instant interaction. The UX must bridge this gap or users abandon the feature.",
      "AI output quality degrades silently. Without eval infrastructure, you discover quality problems from user complaints, not from monitoring.",
    ],
    "tech-debt": [
      "New engineers take 3 months to become productive because the codebase has no documentation, inconsistent patterns, and undocumented business rules.",
      "Every sprint estimate is wrong because hidden coupling means changes in one module break unrelated features in unpredictable ways.",
      "On-call incidents are increasing monthly. What used to be stable is now fragile because the codebase has grown beyond its original architecture.",
      "Feature velocity has collapsed to 30-40% of what it was 12 months ago. The team spends more time fixing bugs than shipping features.",
    ],
    "security-compliance": [
      "SOC 2 Type II requires 6+ months of evidence collection. If you start today, you cannot pass the audit for half a year. Every week delayed adds a week to the timeline.",
      "Enterprise customers require security questionnaires answered before signing contracts. Without proper controls in place, your answers are either dishonest or disqualifying.",
      "HIPAA, PCI-DSS, or GDPR compliance is not a policy document. It is an engineering problem: encryption, access controls, audit logging, and data handling at the infrastructure level.",
      "A security breach during due diligence does not just delay the round. It kills it. Investors will not fund a company with demonstrated security negligence.",
    ],
    "post-pivot": [
      "Half your codebase solves the wrong problem. The other half might be salvageable, but nobody knows which half is which without a thorough audit.",
      "You need to validate the new direction as fast as you validated the first one, but this time with existing code that was designed for something else.",
      "Your team is demoralized from the pivot. Building momentum requires shipping something in the new direction quickly, not a 6-month rebuild.",
      "Investors are watching. A pivot is acceptable. A pivot followed by 6 months of no visible progress is not. Speed-to-new-market matters.",
    ],
    "no-tech-team": [
      "Hiring a CTO takes 6 months in a good market. Your product needs to exist before your next fundraise, which is in 4 months.",
      "You do not know how to evaluate developers, manage an engineering process, or make technology decisions. You need someone who handles all of it.",
      "Freelancers disappear. Offshore teams need management you cannot provide. You need a reliable, senior, self-managing engineering partner.",
      "Without a shipped product, investors question your ability to execute. You need proof of execution capability, not just a pitch deck.",
    ],
    "africa-launch": [
      "Your product was built for US/European users on broadband with credit cards. African users have 2G connections and mobile money. Everything breaks.",
      "Payment infrastructure (M-Pesa, Paystack, Flutterwave) has different integration patterns, settlement timelines, and failure modes than Stripe.",
      "Data localization requirements in specific African countries mean you cannot just serve the continent from a single US/EU data center.",
      "User devices, connectivity patterns, and digital literacy levels are fundamentally different. A responsive website is not a market-entry strategy.",
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      "Hourly billing agencies have the opposite incentive to yours: the longer the project takes, the more they make. Think about that alignment.",
      "Scope creep is the number one budget killer. Without a locked scope, every 'quick addition' adds a week and $5,000 to your bill.",
      "You cannot budget for a variable cost. Unknown final price means you cannot plan your runway, your fundraise, or your next hire.",
      "Most agencies give estimates, not commitments. An estimate is a guess. A fixed price is a contract. The difference is who absorbs the risk.",
    ],
    "dedicated-team": [
      "Hiring 3-5 senior engineers takes 6-9 months. Your product roadmap cannot wait that long.",
      "New hires need 2-3 months to understand your codebase. Engineers who have been in your code for 6 months are 3x more productive.",
      "Scaling a team up for a push and down after is impossible with full-time hires. Severance, morale damage, and hiring costs make it impractical.",
      "Vendor relationships feel transactional. What you need is a team that attends your standups, knows your codebase, and cares about your product.",
    ],
    "tech-cofounder": [
      "Investors keep asking who your CTO is. Every pitch deck has a 'team' slide and yours has a gap that gets noticed.",
      "Architecture decisions made today cost $50-200K to undo in 18 months. You are making these decisions without the experience to evaluate them.",
      "You need someone who can interview engineering candidates, evaluate technical vendors, and represent technology to your board. Not just code.",
      "Giving equity to a technical co-founder means permanent dilution. Getting CTO-level leadership on contract means flexibility.",
    ],
    "cto-as-a-service": [
      "Your engineers build features but nobody is deciding what the architecture looks like in 2 years. Strategy and execution are different skills.",
      "A full-time CTO costs $250-400K in salary alone. You do not need 40 hours/week of strategy. You need 8-10 hours of the right strategy.",
      "Board meetings require technical updates that your engineers cannot produce. Someone needs to translate engineering progress into business language.",
      "Vendor selection, build-vs-buy decisions, and hiring strategy require CTO-level judgment that individual contributors cannot provide.",
    ],
    "design-sprint": [
      "You are about to commit $50-150K to build something based on assumptions nobody has tested with real users.",
      "Internal debates about product direction consume months. Everyone has an opinion. Nobody has data.",
      "Building the wrong product is the most expensive mistake a startup can make. A week of validation prevents months of waste.",
      "Stakeholders cannot align on product direction through meetings and documents. They need to see and test a tangible prototype.",
    ],
    "code-audit": [
      "Someone told you the architecture is wrong but nobody can tell you specifically what is wrong, how bad it is, or what to fix first.",
      "You are acquiring a company and need to know what the technology is actually worth. Not what the founders say it is worth.",
      "Investors want a technical review before funding. You need an honest assessment from someone with no incentive to soften the findings.",
      "Your engineering team says everything is fine. Your metrics say otherwise. You need an independent evaluation.",
    ],
    "staff-augmentation": [
      "Your backend engineer is on parental leave for 4 months. That work still needs to happen.",
      "You need a DevOps specialist for a 3-month migration but cannot justify a full-time hire for a temporary need.",
      "Your team has the capacity but not the specific skill for one technical challenge. Hiring full-time for a 6-week need is wasteful.",
      "Agency teams do not integrate. They build in isolation and hand over code your team cannot maintain. You need engineers who join your process.",
    ],
    "retainer": [
      "Feature backlogs are too variable for fixed-scope projects. Some months need 80 hours of work. Some need 20. You cannot predict it.",
      "Losing your development partner between projects means they lose context. Re-onboarding takes weeks every time you start a new engagement.",
      "Production bugs and urgent fixes cannot wait for a new SOW to be negotiated and signed. You need reserved capacity that responds immediately.",
      "Budget unpredictability makes quarterly planning impossible. You need a consistent, known engineering cost you can plan around.",
    ],
    "nearshore": [
      "Offshore teams in 8-12 hour timezone gaps mean async-only communication. By the time they answer your question, you have lost a full day.",
      "Communication overhead from cultural and language differences silently reduces effective velocity by 30-40%, negating cost savings.",
      "Nearshore skeptics assume lower cost means lower quality. That is true for body shops. It is not true for senior engineers in nearby markets.",
      "Your engineers need to pair-program, attend standups, and have real-time conversations. That requires timezone overlap, not just Slack.",
    ],
    "outsourcing": [
      "You have a defined project with clear requirements but zero internal bandwidth to build it.",
      "Managing an external team adds overhead you cannot afford. You need a partner who owns the entire delivery without your daily involvement.",
      "Quality risk is the main concern: outsourced code often arrives undocumented, untested, and unmaintainable by your future team.",
      "Handoff failures are common. Projects get delivered and nobody on your side can maintain, deploy, or extend them without calling the vendor back.",
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
    "ai-startup": [
      { title: "Production RAG Pipelines", description: "Document chunking strategies, embedding model selection, hybrid search (vector + keyword), and retrieval ranking tuned to your specific content and query patterns." },
      { title: "Eval and Quality Infrastructure", description: "Automated evaluation suites that test output quality on every deployment. Golden datasets, regression detection, and quality dashboards your team checks daily." },
      { title: "Cost-Optimized Inference", description: "Model routing, response caching, prompt compression, and tiered model selection that keeps per-query costs sustainable as you scale to millions of requests." },
      { title: "Streaming UX and Latency Design", description: "Token-by-token streaming, progressive rendering, speculative generation, and the UI patterns that make 2-4 second response times feel instant to end users." },
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { title: "Plain-English Communication", description: "Every technical decision explained in business terms: what it costs, what it enables, and what happens if you choose differently. No jargon, no hand-waving." },
      { title: "Direct Engineer Access", description: "You talk to the person building your product. No account manager layer, no game of telephone. Questions get answered by the person who knows the code." },
      { title: "Fixed Price, Written Scope", description: "Agreed scope and price before work begins. You know exactly what you are paying and exactly what you are getting. Changes require mutual agreement." },
      { title: "Technology Decisions Owned", description: "We make the technical decisions and explain why. You make business decisions. Nobody asks you to choose between frameworks you have never heard of." },
    ],
    "first-time-founder": [
      { title: "Scope Ruthlessly", description: "We cut your feature list by 60-70% and ship the 3-4 features that actually validate your hypothesis. Everything else waits until users ask for it." },
      { title: "Pattern Recognition", description: "We have built 50+ products. We know which mistakes are coming because we have seen them before. We tell you before they happen, not after." },
      { title: "Honest Pushback", description: "When your idea has a flaw, we say so. When your timeline is unrealistic, we say so. You are paying for experience, not agreement." },
      { title: "Learning-Optimized MVP", description: "Your first product exists to learn, not to be perfect. We build the minimum that produces maximum signal about what users actually want." },
    ],
    "solo-founder": [
      { title: "Autonomous Operation", description: "We run independently: architecture decisions, daily execution, infrastructure management. You approve direction in weekly check-ins. Your time stays on customers and growth." },
      { title: "Full Department Coverage", description: "Frontend, backend, DevOps, QA, and technical planning. One engagement replaces the 3-5 hires you would need to build an engineering team." },
      { title: "Async-First Communication", description: "Loom updates, Slack messages, documented decisions. No mandatory meetings that break your sales calls or customer conversations." },
      { title: "Hiring Bridge", description: "When you are ready to hire full-time, we write the job descriptions, review candidates, and onboard your first engineer into a codebase they can actually work in." },
    ],
    "repeat-founder": [
      { title: "Senior Engineers Only", description: "The team you meet is the team that builds. No juniors, no handoffs after the proposal is signed. Code quality you can read and review personally." },
      { title: "Direct Communication", description: "No account manager layer. You talk to engineers directly. Decisions are made in real-time, not filtered through a non-technical intermediary." },
      { title: "Honest Pushback", description: "We challenge scope, question assumptions, and push back when something is heading in the wrong direction. You are not paying for 'yes'." },
      { title: "Execution Velocity", description: "We match your pace. Daily commits, fast iteration, and the shipping speed that comes from engineers who do not need hand-holding or ramp-up time." },
    ],
    "student-startup": [
      { title: "Demo Day Aligned", description: "We scope to your deadline. If demo day is in 10 weeks, we deliver in 9. The timeline drives the scope, not the other way around." },
      { title: "Student-Friendly Pricing", description: "Fixed price that fits accelerator budgets ($5K-$15K typical). We work within your constraints because we know what runway looks like at this stage." },
      { title: "Investor-Ready Output", description: "Code that impresses technical evaluators, architecture you can explain to investors, and a working product that proves you can execute." },
      { title: "Education Included", description: "We explain every technical decision so you understand your own product. When you pitch to investors, you can answer technical questions confidently." },
    ],
    "corporate-innovator": [
      { title: "Enterprise Documentation", description: "SOWs, security questionnaires, insurance certificates, and the project documentation that your procurement and InfoSec teams require." },
      { title: "Legacy Integration", description: "Connectors to SAP, Salesforce, Oracle, and custom internal APIs. We work with systems built in 2008 without requiring you to modernize them first." },
      { title: "Startup Speed, Enterprise Compliance", description: "Agile delivery within governance frameworks. Sprint demos for stakeholders, change request processes for scope, and the audit trail that procurement needs." },
      { title: "Stakeholder Management", description: "We produce the progress reports, technical summaries, and steering committee materials that keep 5 departments aligned without slowing down delivery." },
    ],
    "female-led": [
      { title: "Transparent, Consistent Pricing", description: "Our rates are published. Your quote is the same quote anyone else gets for the same scope. No negotiation tax, no markup based on assumptions." },
      { title: "Peer-to-Peer Communication", description: "Engineers who treat your technical input as valid, your questions as reasonable, and your decisions as final. No explaining-down. No second-guessing." },
      { title: "Senior Resources Guaranteed", description: "The engineers assigned to your project are the same caliber assigned to every project. No juniors because someone assumed the work is simpler." },
      { title: "Accountability Built In", description: "If something in our communication or delivery is not meeting the standard, we want to know immediately. Feedback is acted on, not dismissed." },
    ],
    "african-startup": [
      { title: "African Payment Rails", description: "M-Pesa, Paystack, Flutterwave, and Chipper integration with the reconciliation, settlement, and webhook handling that each requires." },
      { title: "Low-Bandwidth UX", description: "Applications optimized for 2G connections: compressed assets, progressive loading, and offline capability that work on $50 Android devices." },
      { title: "USSD & SMS Channels", description: "Menu-driven USSD interfaces and SMS interactions that reach users on feature phones without smartphones or data plans." },
      { title: "Multi-Country Architecture", description: "Infrastructure that supports expansion across African markets with different telecom APIs, payment providers, and data localization requirements per country." },
    ],
    "diaspora-founder": [
      { title: "Multi-Currency Infrastructure", description: "Pricing, payment collection, and settlement in multiple currencies with exchange rate handling, conversion fees, and the UX that makes multi-market pricing clear." },
      { title: "Cross-Border Payment Flows", description: "Remittance, split payments, and subscription billing across jurisdictions with the compliance controls that both sets of regulators require." },
      { title: "Dual-Market UX", description: "Interfaces that work across cultures: language, date formats, name structures, right-to-left support, and the communication patterns each market expects." },
      { title: "Dual-Jurisdiction Compliance", description: "Architecture that satisfies regulatory requirements in both markets simultaneously without duplicating the entire backend for each jurisdiction." },
    ],
    "social-enterprise": [
      { title: "Impact-First Prioritization", description: "Features ranked by social outcome per dollar spent on development. Nothing built until it justifies its cost in measurable impact." },
      { title: "WCAG Accessibility", description: "AA compliance built in from the first wireframe. Screen readers, keyboard navigation, color contrast, and the testing that proves compliance." },
      { title: "Grant-Compatible Delivery", description: "Milestone reports, deliverable documentation, and budget breakdowns formatted for the specific requirements your funders demand." },
      { title: "Appropriate Technology", description: "Solutions designed for your actual users: low connectivity, older devices, limited digital literacy. Simple and functional beats clever and inaccessible." },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { title: "48-Hour Proposal", description: "Scope meeting on day one. Written proposal with fixed price delivered within 48 hours. Development starts the day you approve. No 4-week discovery phase." },
      { title: "Ruthless Scoping", description: "We cut features until only the core hypothesis remains. Three to five features, not fifteen. Ship in 4-6 weeks, learn, then decide what is next." },
      { title: "Production from Day One", description: "No throwaway prototype. The MVP is built with clean architecture, automated tests on critical paths, and deployment pipelines. What you ship becomes what you scale." },
      { title: "Fixed Price, Fixed Timeline", description: "You know the cost and the date before we start. No scope creep, no surprise invoices, no 'we need two more weeks.' We hit the deadline." },
    ],
    "scaling-tech": [
      { title: "Performance Audit", description: "Full-stack profiling that identifies the actual bottlenecks, not the assumed ones. Database queries, API response times, frontend rendering, and infrastructure utilization measured and ranked." },
      { title: "Targeted Fix, Not Rewrite", description: "We fix the 3-5 things causing 80% of your performance problems. No big-bang rewrite. No 6-month project. Targeted interventions that show measurable improvement in 2-4 weeks." },
      { title: "Deployment Confidence", description: "CI/CD pipelines, staging environments, automated testing, and feature flags that make deployments safe again. Ship on any day without fear." },
      { title: "Architecture Evolution", description: "Incremental re-architecture using strangler fig patterns. New services replace bottlenecked components one at a time while existing features continue working." },
    ],
    "agency-rescue": [
      { title: "Honest Assessment", description: "We read the entire codebase before we say anything. Then we give you a straight answer: what is worth keeping, what must be replaced, and what it costs to fix." },
      { title: "Triage and Stabilize", description: "Critical bugs fixed first. Security vulnerabilities patched immediately. Production stability restored before any new development begins." },
      { title: "Pragmatic Recovery", description: "We do not rewrite from scratch unless it is genuinely cheaper. We identify the salvageable pieces and build forward from them." },
      { title: "Documentation Recovery", description: "We document the system as we learn it: architecture diagrams, data flows, deployment procedures. The knowledge that your previous team never wrote down." },
    ],
    "fundraising-ready": [
      { title: "Security Hardening", description: "Vulnerability scanning, dependency updates, encryption verification, access control audit, and the fixes that prevent embarrassing findings during technical due diligence." },
      { title: "Architecture Documentation", description: "System diagrams, data flow maps, technology rationale, and scaling strategy documented for the CTO that investors will hire to review your code." },
      { title: "Load Testing", description: "Simulated traffic at 10x your current load to identify breaking points before investors ask. A load test report proves your architecture can handle the growth you are projecting." },
      { title: "Technical Roadmap", description: "A credible 12-18 month engineering plan that shows investors you know what to build next and how much it will cost. Aligns with your fundraising narrative." },
    ],
    "ai-integration": [
      { title: "Use Case Definition", description: "Before any code: which user interaction benefits from AI, what quality means for that interaction, and how you will measure whether the AI is helping or hurting." },
      { title: "RAG Pipeline Engineering", description: "Content chunking, embedding generation, retrieval ranking, and context assembly tailored to your specific content type and user query patterns." },
      { title: "Quality Infrastructure", description: "Eval suites with golden datasets, automated quality scoring on every deployment, and the regression alerts that catch degradation before users notice." },
      { title: "Production UX Patterns", description: "Streaming responses, confidence indicators, source citations, and the error handling that makes 3-second latency feel acceptable and failures feel graceful." },
    ],
    "tech-debt": [
      { title: "Debt Inventory", description: "Codebase audit that scores every piece of technical debt by its impact on velocity and reliability. Not all debt is equal. We find the debt that hurts most." },
      { title: "Strangler Fig Approach", description: "New, clean implementations replace problematic modules one at a time. Feature development continues alongside debt reduction. No velocity freeze." },
      { title: "Testing Foundation", description: "Automated tests on the critical paths that break most often. Each test written prevents a class of future regressions. Coverage grows with every sprint." },
      { title: "Velocity Recovery", description: "Measurable improvement in sprint velocity within 6-8 weeks. Engineers estimate accurately again. Features ship without unexpected breakage. On-call pages decrease." },
    ],
    "security-compliance": [
      { title: "Controls as Code", description: "Security controls implemented at the infrastructure level: encryption enforcement, access logging, MFA requirements, network segmentation. Automated, not manual." },
      { title: "Evidence Automation", description: "Compliance evidence (access logs, encryption status, backup verification, vulnerability scans) generated automatically. Audits become paperwork collection, not engineering scrambles." },
      { title: "Gap Assessment", description: "Current security posture mapped against your target framework (SOC 2, HIPAA, PCI-DSS, GDPR). Prioritized remediation plan with effort estimates for each gap." },
      { title: "Audit Preparation", description: "We produce the documentation, run the penetration tests, configure the monitoring, and prepare the responses that make your next audit predictable and passable." },
    ],
    "post-pivot": [
      { title: "Codebase Triage", description: "We read everything. Then we tell you: this module works for the new direction, this one needs modification, and this one is dead weight. Honest assessment in 1-2 weeks." },
      { title: "Minimum Viable Rebuild", description: "The smallest set of changes that validates the new direction. Not a ground-up rewrite. Surgical modifications to existing code plus new components where needed." },
      { title: "Speed to Signal", description: "Ship the pivoted product in 6-8 weeks, not 6 months. Reuse what applies, replace what does not, and get in front of users with the new hypothesis as fast as possible." },
      { title: "Team Morale Engineering", description: "Visible progress in week one. Working software in week three. Your team sees momentum returning. Pivots are energizing when things ship fast." },
    ],
    "no-tech-team": [
      { title: "Complete Engineering Department", description: "Frontend, backend, DevOps, QA, architecture, and technical planning. One engagement replaces the 3-5 hires you cannot make yet." },
      { title: "Zero Management Overhead", description: "We run autonomously. Architecture decisions, daily execution, infrastructure management. You approve direction weekly. No engineering management required." },
      { title: "Hiring Bridge", description: "When you are ready to build internally, we write job descriptions, evaluate candidates, conduct technical interviews, and onboard your first engineers." },
      { title: "Investor-Ready Proof", description: "A shipped product proves execution capability. Investors stop asking 'can you build this?' when the answer is already live and serving users." },
    ],
    "africa-launch": [
      { title: "Infrastructure Adaptation", description: "Your product re-architected for African realities: low bandwidth, mobile money payments, offline capability, and USSD fallbacks for feature phone users." },
      { title: "Payment Rail Integration", description: "M-Pesa, Paystack, Flutterwave, and mobile money integrations that handle the settlement patterns and failure modes specific to African financial infrastructure." },
      { title: "Low-Bandwidth Optimization", description: "Asset compression, progressive loading, offline caching, and the performance engineering that makes your product usable on 2G connections and $50 Android devices." },
      { title: "Data Localization", description: "Multi-region infrastructure that satisfies in-country data residency requirements without duplicating your entire application stack for each market." },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { title: "Scope Before Price", description: "Detailed scope document with every feature, screen, and integration defined before a price is quoted. You know exactly what you are buying." },
      { title: "Price is the Price", description: "The quote does not change unless you change the scope. Complexity surprises are our problem. Budget surprises are eliminated." },
      { title: "Milestone Payments", description: "Pay in milestones tied to delivered working software. Not upfront. Not on a schedule. When features are done, you see them, then you pay." },
      { title: "Overrun Protection", description: "If we underestimated complexity, the extra cost is ours. Fixed price means the risk of estimation error sits with the team that made the estimate." },
    ],
    "dedicated-team": [
      { title: "Your Team, Your Process", description: "Engineers who attend your standups, work in your Slack, use your JIRA, and follow your coding standards. Not a vendor. An extension of your company." },
      { title: "Context That Compounds", description: "The same engineers month after month. They know your codebase, your users, your technical debt. Decisions improve as context deepens over time." },
      { title: "Scale Up and Down", description: "Start with 2 engineers. Add 2 more for a push. Drop back to 2 after launch. No severance, no hiring costs, no morale damage." },
      { title: "Full Coverage", description: "Frontend, backend, DevOps, and QA combined in one team. No coordination between vendors. No gaps between specialties." },
    ],
    "tech-cofounder": [
      { title: "CTO Without Equity", description: "Architecture ownership, team management, investor communication, and technical strategy. All the responsibilities of a CTO without permanent dilution." },
      { title: "Architecture Ownership", description: "Someone who decides what the system looks like in 2 years and makes every daily decision consistent with that direction." },
      { title: "Hiring Leadership", description: "Job descriptions, candidate evaluation, technical interviews, and onboarding. Build your engineering team with CTO-level judgment guiding every hire." },
      { title: "Board Communication", description: "Technical progress translated for board consumption. Roadmap updates, risk assessments, and the engineering narrative that gives investors confidence." },
    ],
    "cto-as-a-service": [
      { title: "Part-Time Strategy", description: "8-10 hours per week of CTO-level thinking: architecture reviews, technology decisions, vendor evaluations, and team scaling strategy." },
      { title: "Team Unlocked", description: "Your engineers build faster when someone sets technical direction, resolves architecture debates, and removes ambiguity from decisions." },
      { title: "Vendor Evaluation", description: "Build-vs-buy decisions, tool selection, and vendor negotiations guided by someone who has evaluated hundreds of technical options." },
      { title: "Hiring Support", description: "Engineering hiring strategy, job architecture, interview design, and candidate evaluation. Build the right team, not just a team." },
    ],
    "design-sprint": [
      { title: "Five Days, One Answer", description: "From problem statement to tested prototype in one week. You leave with a validated direction or a killed hypothesis. Both save money." },
      { title: "Real User Feedback", description: "Five user interviews on Day 5 with a clickable prototype. Not opinions from colleagues. Not stakeholder preferences. Actual user reactions." },
      { title: "Alignment by Artifact", description: "Stakeholders who cannot agree in meetings align when they interact with a tangible prototype. The sprint produces alignment as a byproduct." },
      { title: "Scope Definition", description: "The sprint output defines what to build. No ambiguous requirements doc. A tested prototype that shows exactly what the product should do." },
    ],
    "code-audit": [
      { title: "Honest Assessment", description: "No sugarcoating. No selling follow-on work. A straight answer about what you have: what is solid, what is risky, and what to prioritize fixing." },
      { title: "Prioritized Findings", description: "Issues ranked by severity and impact. Not a 50-page list of every imperfection. A clear 'fix these 5 things first' action plan." },
      { title: "Concrete Remediation Plan", description: "For every finding: what to fix, how long it takes, what it costs, and what happens if you do not fix it. Actionable, not academic." },
      { title: "Independent Perspective", description: "We have no incentive to soften findings or inflate problems. The audit is the deliverable. We tell you what we find, honestly." },
    ],
    "staff-augmentation": [
      { title: "Productive in Week One", description: "Senior engineers who need no hand-holding. They read your codebase, attend your standup, and contribute meaningful code within their first week." },
      { title: "Your Process, Your Tools", description: "They work in your repo, follow your code style, attend your ceremonies, and submit PRs through your review process. Indistinguishable from team members." },
      { title: "Flexible Duration", description: "3 months, 6 months, or ongoing. Scale up for a push, scale down after. No long-term contracts required unless you want them." },
      { title: "Skill-Specific Placement", description: "Need a DevOps specialist? A React expert? A Python data engineer? We place the specific skill your team is missing, not a generalist." },
    ],
    "retainer": [
      { title: "Reserved Capacity", description: "Guaranteed hours every month from engineers who know your codebase. No re-onboarding. No waiting for availability. Consistent, predictable capacity." },
      { title: "Same Engineers Monthly", description: "Context compounds over time. The same team that built your features maintains them. No knowledge loss between engagements." },
      { title: "Flex Within Budget", description: "Some months need 80 hours. Some need 20. The monthly budget stays predictable while the work allocation flexes to your actual needs." },
      { title: "Priority Response", description: "Production bugs and urgent fixes handled within SLA. No SOW negotiation, no contract amendment. Your retainer includes emergency response." },
    ],
    "nearshore": [
      { title: "Same Timezone", description: "Within 2 hours of your timezone. Real-time communication, pair programming, and standup attendance without 8-hour async delays." },
      { title: "Senior Engineers, Lower Cost", description: "40-60% cost reduction vs. equivalent local hires. Not because of lower quality. Because of different cost-of-living economics in nearby markets." },
      { title: "Fluent English", description: "No communication overhead. No lost-in-translation requirements. Engineers who express complex technical concepts clearly in your language." },
      { title: "Western Process", description: "Agile sprints, code review culture, CI/CD expectations, and the engineering discipline that Western product teams expect. No process mismatch." },
    ],
    "outsourcing": [
      { title: "Full Delivery Ownership", description: "You define requirements. We own everything else: architecture, development, testing, deployment, and documentation. One point of accountability." },
      { title: "Milestone Accountability", description: "Payment tied to working software delivery, not hours billed. If the milestone is not met, you do not pay for it." },
      { title: "Complete Handoff", description: "Documentation, architecture guides, deployment procedures, and optional training. Your future team can maintain the system without calling us back." },
      { title: "Quality Guaranteed", description: "Automated tests, code review, and architecture documentation included in every delivery. Not outsourced code. Properly engineered software." },
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
    "ai-startup": [
      { title: "Retrieval That Improves", description: "RAG pipelines with measurable precision and recall. Retrieval quality tracked per query type, with automatic alerts when accuracy drops below threshold." },
      { title: "Costs That Scale", description: "Model routing, caching, and prompt optimization that keeps inference costs linear or sub-linear as your user base grows 10x." },
      { title: "Quality You Can Prove", description: "Eval pipelines with golden datasets, automated regression testing, and quality scores your investors and enterprise customers can audit." },
      { title: "Speed Users Expect", description: "Streaming infrastructure, progressive UI, and latency budgets that make AI features feel responsive, not like waiting for a loading spinner." },
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { title: "No Jargon, No Surprises", description: "Weekly updates in language you understand. Budget impact, timeline status, and what decisions need your input. The technical details handled without your involvement." },
      { title: "Fixed Price Protection", description: "The scope is written. The price is locked. If we underestimated complexity, that is our problem, not your invoice." },
      { title: "Talk to the Builder", description: "Direct Slack access to the engineer writing your code. Questions answered in hours, not filtered through a project manager who does not know the answer." },
      { title: "Future-Proof Handoff", description: "When you hire your own CTO or engineer, they inherit clean code, full documentation, and an architecture they can understand in a week." },
    ],
    "first-time-founder": [
      { title: "Experience on Your Side", description: "50+ products shipped. We know which decisions first-time founders regret at month 18. We prevent those decisions at month 1." },
      { title: "Lean by Default", description: "We cut scope until only the learning-critical features remain. Ship in 4-6 weeks, measure, then decide what to build next based on data." },
      { title: "Honest Timeline", description: "No padding, no sandbagging. If it takes 8 weeks, we say 8 weeks. If your scope is 16 weeks of work, we tell you what to cut to hit 8." },
      { title: "Investor-Ready Quality", description: "Code, architecture, and documentation that pass technical due diligence. Not impressive demos on top of fragile foundations." },
    ],
    "solo-founder": [
      { title: "Zero Management Overhead", description: "We run autonomously. You approve direction weekly. Your time stays on customers, sales, and fundraising where it belongs." },
      { title: "Complete Coverage", description: "Frontend, backend, infrastructure, testing, deployment. One engagement replaces 3-5 hires without the recruiting, management, or overhead cost." },
      { title: "Async by Default", description: "Loom updates, written decisions, Slack access. No mandatory daily standups that break your calendar." },
      { title: "Graceful Transition", description: "When you are ready to build an in-house team, we help hire, onboard, and hand off a codebase your new engineer can maintain alone." },
    ],
    "repeat-founder": [
      { title: "Matches Your Standards", description: "You know what good code looks like. We write code you can personally review and approve. No shortcuts dressed up as velocity." },
      { title: "No Account Manager Layer", description: "Engineer-to-founder communication. Decisions made in real-time. No telephone game through non-technical intermediaries." },
      { title: "Speed Without Mess", description: "Daily commits, fast iteration, and shipping velocity that comes from senior engineers who do not need guidance or ramp-up time." },
      { title: "Honest Disagreement", description: "We push back when scope is wrong, when a feature is premature, or when your assumption needs testing first. You hired judgment, not compliance." },
    ],
    "student-startup": [
      { title: "Deadline-Driven Scope", description: "Demo day is the constraint. We scope backward from your deadline and deliver what is possible within your timeline and budget." },
      { title: "Accelerator-Friendly Budget", description: "Fixed price within student budgets. Real engineering quality at a scope that fits $5K-$15K, not toy prototypes." },
      { title: "Learn While You Ship", description: "Every technical decision explained so you understand your own product. You leave the engagement technically literate, not dependent." },
      { title: "Investor-Ready Demo", description: "A working product that proves execution capability. Not mockups. Not slide decks. Software that runs and impresses." },
    ],
    "corporate-innovator": [
      { title: "Procurement-Ready", description: "Fixed-price SOWs, professional liability insurance, NDA compliance, and the vendor documentation your procurement team requires." },
      { title: "Security-Review Ready", description: "Architecture documentation, data flow diagrams, encryption specifications, and penetration test results that pass InfoSec review." },
      { title: "Legacy Compatible", description: "Integration with existing enterprise systems (SAP, Salesforce, Oracle) without requiring modernization of those systems first." },
      { title: "Governance-Friendly Delivery", description: "Sprint demos, change management processes, steering committee updates, and the audit trail that enterprise project governance demands." },
    ],
    "female-led": [
      { title: "Published Pricing", description: "Same rate card for everyone. No negotiation markup. Your project costs what any equivalent project costs. Transparent by default." },
      { title: "Respect as Standard", description: "Engineers who listen, respond to technical input with technical discussion, and treat your expertise as relevant. Not an aspiration, a hiring filter." },
      { title: "Equal Resourcing", description: "Senior engineers assigned based on project complexity, not founder assumptions. Every project gets the caliber of team it deserves." },
      { title: "Active Accountability", description: "Monthly engagement surveys. Direct escalation paths. Problems addressed in days, not tolerated. The bar stays high because we measure it." },
    ],
    "african-startup": [
      { title: "Built for the Real Market", description: "M-Pesa, not Stripe. 2G connections, not fiber. Feature phones, not iPhones. We build for how your market actually works." },
      { title: "Offline-First Always", description: "Apps that function fully without internet and sync when connectivity returns. Your users' reality, not Silicon Valley's assumptions." },
      { title: "Low-Cost Infrastructure", description: "Architecture optimized for African market economics: minimal bandwidth, compressed assets, and hosting that scales without Western-tier cloud bills." },
      { title: "Pan-African Expansion", description: "Multi-country architecture from day one. Different payment providers, different telecoms, different regulations per country handled in configuration, not code rewrites." },
    ],
    "diaspora-founder": [
      { title: "Two Markets, One Product", description: "Architecture that serves users in both your home market and your current market without maintaining separate codebases." },
      { title: "Cross-Border Money", description: "Multi-currency payments, remittance flows, and settlement in different financial systems handled correctly from the start." },
      { title: "Cultural UX", description: "Interfaces that adapt to language, date formats, communication patterns, and user expectations across your target cultures." },
      { title: "Dual Compliance", description: "One system satisfying two sets of regulators. Data residency, privacy laws, and financial regulations for both jurisdictions." },
    ],
    "social-enterprise": [
      { title: "Impact Per Dollar", description: "Every feature justified by measurable social outcome. Nothing built because it is technically interesting. Everything built because it moves the needle." },
      { title: "Accessible by Default", description: "WCAG AA from wireframe to deployment. Screen readers, keyboard navigation, high contrast, and the testing that proves it works." },
      { title: "Grant-Ready Reporting", description: "Deliverable formats, milestone documentation, and impact metrics structured for the specific reporting your funders require." },
      { title: "Appropriate Tech", description: "Solutions for your actual users: low bandwidth, older devices, limited literacy. Technology that includes rather than excludes." },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { title: "Proposal in 48 Hours", description: "Scope, price, and timeline delivered within 2 days of first conversation. Development starts the day after approval." },
      { title: "Ship in 4-6 Weeks", description: "Most MVPs launch within 6 weeks. We scope to the deadline and cut until it fits without compromising quality on what ships." },
      { title: "Production Quality", description: "No throwaway prototype. Clean code, automated tests, deployment pipelines. What you ship to users is what you scale." },
      { title: "Fixed Price", description: "The quote is the price. Overruns are our problem. You know what you are paying before a line of code is written." },
    ],
    "scaling-tech": [
      { title: "Find the Real Problem", description: "Full-stack profiling that identifies actual bottlenecks. Assumed causes are usually wrong. We measure before we fix." },
      { title: "Fix Without Rewriting", description: "Targeted interventions on the 3-5 issues causing 80% of pain. No 6-month rewrite proposals. Measurable improvement in weeks." },
      { title: "Deploy Without Fear", description: "CI/CD, staging environments, and automated testing restored. Deployments become boring again. Fridays included." },
      { title: "Grow Without Breaking", description: "Architecture evolved incrementally. Bottlenecks replaced one at a time. Feature work continues throughout." },
    ],
    "agency-rescue": [
      { title: "Honest Assessment First", description: "We read the code before we say anything. No prescriptions without diagnosis. You get the truth about what you have." },
      { title: "Stabilize Before Building", description: "Critical bugs and security issues fixed first. Production stops crashing. Then we move forward on new work." },
      { title: "Keep What Works", description: "Not everything is bad. We identify salvageable code and build from it. Rewrites happen only when repair costs more." },
      { title: "No Blame, Just Solutions", description: "We do not bill you to undo what someone else did wrong. We bill you to move forward from where you are." },
    ],
    "fundraising-ready": [
      { title: "Due Diligence Ready", description: "Security posture, architecture documentation, and code quality that survive the CTO review your investors will commission." },
      { title: "Load Test Proof", description: "Performance under 10x load documented and presented. Investors see evidence that your architecture supports the growth you project." },
      { title: "Security Hardened", description: "Vulnerabilities patched, dependencies updated, encryption verified, access controls audited. No embarrassing findings during review." },
      { title: "Technical Roadmap", description: "A credible 12-18 month plan that answers: what gets built next, how much it costs, and what team you need." },
    ],
    "ai-integration": [
      { title: "Define Before Building", description: "Use case, quality metrics, and success criteria established before any AI code is written. The hardest part is knowing what to build." },
      { title: "Production-Grade RAG", description: "Retrieval pipelines tuned to your content. Not a demo. Not a proof of concept. AI that works when real users find the edges." },
      { title: "Quality You Can Measure", description: "Eval infrastructure that scores output continuously. You know when quality degrades before users complain." },
      { title: "UX That Handles Latency", description: "Streaming, caching, and loading patterns that make 3-second AI responses feel responsive to end users." },
    ],
    "tech-debt": [
      { title: "Prioritized Debt Map", description: "Not all debt matters equally. We score by impact on velocity and reliability. The debt crushing your team gets fixed first." },
      { title: "No Velocity Freeze", description: "Features keep shipping while debt reduces. Strangler fig approach: new replaces old incrementally, never all at once." },
      { title: "Measurable Recovery", description: "Sprint velocity improvement visible within 6-8 weeks. Estimates become accurate. On-call pages decrease. Engineers regain confidence." },
      { title: "Prevention Built In", description: "CI/CD, code review standards, and automated testing that prevent new debt from accumulating at the old rate." },
    ],
    "security-compliance": [
      { title: "Controls, Not Checklists", description: "Security implemented at the infrastructure level. Encryption, logging, access control enforced by code, not by policy documents." },
      { title: "Evidence on Autopilot", description: "Compliance proof generated automatically. Audits become documentation collection, not 3-month engineering projects." },
      { title: "Framework-Specific", description: "SOC 2, HIPAA, PCI-DSS, or GDPR. We know your specific framework and implement the controls it requires." },
      { title: "Audit-Ready", description: "Penetration tests run, documentation prepared, monitoring configured. Your next audit is predictable and passable." },
    ],
    "post-pivot": [
      { title: "Know What to Keep", description: "Honest triage of your existing code. What serves the new direction stays. What does not gets removed. Assessment in 1-2 weeks." },
      { title: "Ship Fast Again", description: "Pivoted product in front of users in 6-8 weeks. Speed-to-signal matters more than perfection after a direction change." },
      { title: "Minimum Rebuild", description: "Not a rewrite. Surgical changes to existing code plus new components. Maximum reuse of what still applies." },
      { title: "Momentum Restored", description: "Visible progress in week one. Pivot energy channeled into shipping, not planning. The team sees things moving again." },
    ],
    "no-tech-team": [
      { title: "Full Department, Day One", description: "Frontend, backend, DevOps, QA, architecture. One engagement, complete coverage. No hiring delay." },
      { title: "Self-Managing", description: "We run without daily direction. Architecture decisions, execution, infrastructure. You steer weekly." },
      { title: "Hire When Ready", description: "We help you build the internal team when the time is right: job descriptions, interviews, onboarding." },
      { title: "Prove Execution", description: "A live product in users' hands. The best answer to investors asking whether you can execute." },
    ],
    "africa-launch": [
      { title: "Built for 2G", description: "Your product adapted for low-bandwidth realities. Compressed assets, offline capability, and page weights that load on African mobile networks." },
      { title: "African Payment Rails", description: "M-Pesa, Paystack, Flutterwave integration. Not Stripe with a wrapper. Actual African payment infrastructure." },
      { title: "Feature Phone Reach", description: "USSD and SMS interfaces that reach users without smartphones or data plans. Your market is larger than you think." },
      { title: "In-Country Compliance", description: "Data localization, local hosting, and the regulatory requirements specific to each African market you enter." },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { title: "Budget Certainty", description: "The price is locked before work begins. No hourly surprises. No scope creep charges. Plan your runway with a known engineering cost." },
      { title: "Aligned Incentives", description: "We make money by finishing on time, not by dragging projects out. Our incentive is speed and quality, not billable hours." },
      { title: "Milestone Visibility", description: "Pay as working software delivers. See progress before paying. No large upfront deposits. No paying for invisible work." },
      { title: "Risk Where It Belongs", description: "Estimation risk sits with the team that made the estimate. If complexity surprises us, that cost is ours, not yours." },
    ],
    "dedicated-team": [
      { title: "Deep Context", description: "Same engineers, month after month. They know your system, your users, and your debt. Decisions get better as familiarity deepens." },
      { title: "True Integration", description: "Your standups, your Slack, your JIRA, your code style. Not a vendor delivering in isolation. An extension of your company." },
      { title: "Elastic Scaling", description: "Add engineers for a push. Remove after launch. No hiring process, no severance, no morale impact. Just capacity that matches your needs." },
      { title: "Full Ownership", description: "Your dedicated team owns outcomes, not just tasks. They care about the product because they live in it daily." },
    ],
    "tech-cofounder": [
      { title: "Leadership Without Dilution", description: "CTO-level ownership of technology decisions without giving away equity. Full commitment on contract, not permanent cap table impact." },
      { title: "Investor Confidence", description: "A named technical leader who presents to your board, answers investor questions, and represents engineering credibility." },
      { title: "Team Building", description: "Engineering hires evaluated, interviewed, and onboarded by someone with CTO-level judgment. Build the right team from the start." },
      { title: "Architecture Ownership", description: "Long-term technical direction owned by one person who makes daily decisions consistent with the 2-year vision." },
    ],
    "cto-as-a-service": [
      { title: "Strategy at Part-Time Cost", description: "8-10 hours/week of CTO thinking at a fraction of a $300K+ full-time salary. The strategy you need without the cost you cannot afford." },
      { title: "Decision Velocity", description: "Architecture debates resolved in hours, not weeks. Your team stops debating and starts building because someone owns the direction." },
      { title: "Board-Ready Updates", description: "Technical progress translated into business language for investors, advisors, and board members who need confidence, not code details." },
      { title: "Hiring Architecture", description: "Who to hire, when, at what level, and how to evaluate them. Engineering team scaling guided by experience, not guesswork." },
    ],
    "design-sprint": [
      { title: "One Week, One Answer", description: "Five days from problem to tested prototype. Faster than any other method of validating product direction. Cheaper than building wrong." },
      { title: "User-Tested Output", description: "Real users interact with your prototype on Day 5. Not colleague opinions. Not stakeholder preferences. Actual market signal." },
      { title: "Kill Bad Ideas Cheap", description: "A killed hypothesis in a sprint saves $50-150K of building the wrong thing. The best outcome is sometimes 'do not build this.'" },
      { title: "Team Alignment", description: "Stakeholders who disagree in meetings agree when they test a prototype together. Alignment is a sprint byproduct." },
    ],
    "code-audit": [
      { title: "Truth, Not Sales", description: "We have no incentive to find problems that do not exist or inflate severity. The audit is the deliverable. Honesty is the product." },
      { title: "Actionable, Not Academic", description: "Every finding comes with: severity, impact, fix approach, effort estimate, and risk of inaction. A plan, not a report." },
      { title: "Prioritized Focus", description: "The 5 things to fix first, clearly identified. Not 50 pages of every imperfection. Focus on what matters most." },
      { title: "Independent Voice", description: "No relationship with your current team or vendors. No politics. No protecting feelings. Just what the code says." },
    ],
    "staff-augmentation": [
      { title: "Day-One Productivity", description: "Senior engineers who read your codebase and contribute in their first week. No 3-month onboarding period. No hand-holding required." },
      { title: "Your Team, Expanded", description: "They follow your process, your code style, your review standards. Indistinguishable from full-time team members in daily work." },
      { title: "Exact Skill Match", description: "Need DevOps? React? Python ML? We place the specific skill gap, not a generalist who might figure it out." },
      { title: "No Long-Term Lock-In", description: "3 months minimum, then flexible. Scale up, scale down, or end when the need passes. No penalty." },
    ],
    "retainer": [
      { title: "Predictable Cost", description: "One monthly invoice. Same amount. Budget it quarterly without wondering what engineering will cost next month." },
      { title: "Zero Re-Onboarding", description: "Same engineers every month. No context loss between projects. No 2-week ramp-up every time work resumes." },
      { title: "Flex Allocation", description: "Features one month. Bug fixes the next. Performance work the month after. The budget is fixed. The work is flexible." },
      { title: "Emergency Response", description: "Production issues handled within SLA without negotiating a new contract. Your retainer includes priority incident response." },
    ],
    "nearshore": [
      { title: "Real-Time Collaboration", description: "Same timezone means pair programming, instant Slack responses, and standup attendance. No async lag eating your velocity." },
      { title: "40-60% Cost Savings", description: "Senior engineers at significantly lower rates than equivalent local hires. Cost-of-living economics, not quality compromise." },
      { title: "No Communication Tax", description: "Fluent English, Western agile processes, and the cultural alignment that prevents miscommunication from silently reducing output." },
      { title: "Quality Parity", description: "Same code standards, same review process, same engineering discipline. The only difference is the invoice amount." },
    ],
    "outsourcing": [
      { title: "One Throat to Choke", description: "Single point of accountability for the entire delivery. No coordination between vendors. No finger-pointing between teams." },
      { title: "Pay for Output", description: "Milestone payments on working software. Not hours logged. Not effort estimated. Working features, deployed and verified." },
      { title: "Walk Away Clean", description: "Complete documentation and handoff. Your future team maintains the system independently. No vendor dependency, no callback tax." },
      { title: "Engineered, Not Just Coded", description: "Tests, documentation, architecture guides, and deployment automation. Outsourced does not mean outsourced quality." },
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
    "ai-startup": [
      { value: "12+", label: "AI Products Shipped to Production" },
      { value: "<1%", label: "Hallucination Rate (Best Deployments)" },
      { value: "70%", label: "Average Inference Cost Reduction" },
      { value: "<800ms", label: "Time to First Token (Median)" },
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { value: "20+", label: "Non-Technical Founders Served" },
      { value: "0", label: "Account Manager Layers" },
      { value: "100%", label: "Decisions Explained in Plain English" },
      { value: "Fixed", label: "Price on Every Project" },
    ],
    "first-time-founder": [
      { value: "50+", label: "First Products Shipped" },
      { value: "60-70%", label: "Features Cut Before Build" },
      { value: "4-6wk", label: "Average First MVP Delivery" },
      { value: "0", label: "Founders Surprised by the Bill" },
    ],
    "solo-founder": [
      { value: "15+", label: "Solo Founders Partnered With" },
      { value: "1hr/wk", label: "Your Time Required" },
      { value: "3-5", label: "Hires Replaced by One Engagement" },
      { value: "100%", label: "Async Communication" },
    ],
    "repeat-founder": [
      { value: "0", label: "Junior Engineers on Your Project" },
      { value: "0", label: "Account Manager Layers" },
      { value: "Daily", label: "Commit Frequency" },
      { value: "100%", label: "Code You Can Personally Review" },
    ],
    "student-startup": [
      { value: "12+", label: "Student Projects Delivered" },
      { value: "$5-15K", label: "Typical Project Budget" },
      { value: "10wk", label: "Average Demo Day Deadline" },
      { value: "100%", label: "Delivered Before Deadline" },
    ],
    "corporate-innovator": [
      { value: "8+", label: "Corporate Innovation Projects" },
      { value: "100%", label: "Security Reviews Passed" },
      { value: "5+", label: "Legacy Systems Integrated" },
      { value: "Fixed", label: "Price SOW for Procurement" },
    ],
    "female-led": [
      { value: "0", label: "Pricing Variance by Founder Gender" },
      { value: "100%", label: "Senior Engineers Assigned" },
      { value: "Published", label: "Rate Card (Same for Everyone)" },
      { value: "Monthly", label: "Engagement Quality Surveys" },
    ],
    "african-startup": [
      { value: "10+", label: "African Market Products Shipped" },
      { value: "6", label: "African Countries Served" },
      { value: "4", label: "Mobile Money Integrations" },
      { value: "100%", label: "Offline-First Architecture" },
    ],
    "diaspora-founder": [
      { value: "8+", label: "Multi-Market Products Built" },
      { value: "12+", label: "Currencies Supported" },
      { value: "2", label: "Jurisdictions Per Product (Avg)" },
      { value: "5", label: "Cross-Border Payment Flows Built" },
    ],
    "social-enterprise": [
      { value: "6+", label: "Social Enterprises Served" },
      { value: "WCAG AA", label: "Accessibility Standard Met" },
      { value: "100%", label: "Grant-Compatible Reporting" },
      { value: "3x", label: "Impact Measurement Improvement" },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { value: "48h", label: "Proposal Turnaround" },
      { value: "4-6wk", label: "Average MVP Delivery" },
      { value: "100%", label: "Deadline Hit Rate" },
      { value: "0", label: "Surprise Invoices" },
    ],
    "scaling-tech": [
      { value: "10x", label: "Performance Improvement (Avg)" },
      { value: "2-4wk", label: "Time to Measurable Improvement" },
      { value: "80%", label: "Of Problems from 20% of Code" },
      { value: "0", label: "Big-Bang Rewrites Recommended" },
    ],
    "agency-rescue": [
      { value: "15+", label: "Projects Rescued" },
      { value: "1-2wk", label: "Assessment Turnaround" },
      { value: "60%", label: "Average Code Reused (Not Rewritten)" },
      { value: "100%", label: "Honest Assessments (Even When Ugly)" },
    ],
    "fundraising-ready": [
      { value: "6-8wk", label: "Typical Preparation Timeline" },
      { value: "100%", label: "Due Diligence Passed" },
      { value: "10x", label: "Load Test Coverage" },
      { value: "$0", label: "Valuation Lost to Tech Issues" },
    ],
    "ai-integration": [
      { value: "10+", label: "AI Features Shipped to Production" },
      { value: "<2s", label: "Time to First Token (Streaming)" },
      { value: "98%+", label: "Best Client Citation Accuracy" },
      { value: "0", label: "Launched Without Eval Pipeline" },
    ],
    "tech-debt": [
      { value: "6-8wk", label: "Time to Velocity Recovery" },
      { value: "2-3x", label: "Sprint Velocity Improvement" },
      { value: "70%", label: "On-Call Page Reduction (Avg)" },
      { value: "0", label: "Feature Freezes Required" },
    ],
    "security-compliance": [
      { value: "100%", label: "First-Attempt Audit Pass Rate" },
      { value: "8-12wk", label: "SOC 2 Type I Preparation" },
      { value: "Automated", label: "Evidence Collection" },
      { value: "0", label: "Post-Audit Remediation Items" },
    ],
    "post-pivot": [
      { value: "1-2wk", label: "Codebase Assessment Time" },
      { value: "6-8wk", label: "Pivoted Product Delivery" },
      { value: "40-60%", label: "Existing Code Typically Reused" },
      { value: "0", label: "Ground-Up Rewrites (When Avoidable)" },
    ],
    "no-tech-team": [
      { value: "3-5", label: "Roles Replaced by One Engagement" },
      { value: "1hr/wk", label: "Your Management Time Required" },
      { value: "6-10wk", label: "From Zero to Shipped Product" },
      { value: "100%", label: "Hiring Support Included" },
    ],
    "africa-launch": [
      { value: "6", label: "African Countries Launched In" },
      { value: "4", label: "Mobile Money Integrations" },
      { value: "100%", label: "Offline-First Architecture" },
      { value: "<500KB", label: "Target Page Weight (2G Optimized)" },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { value: "100%", label: "Projects Delivered at Quoted Price" },
      { value: "0", label: "Surprise Invoices Sent" },
      { value: "4-8wk", label: "Average Delivery Timeline" },
      { value: "Fixed", label: "Every Single Quote" },
    ],
    "dedicated-team": [
      { value: "18mo", label: "Longest Client Relationship" },
      { value: "2-8", label: "Engineers Per Team" },
      { value: "95%", label: "Engineer Retention on Projects" },
      { value: "1wk", label: "Onboarding to Contribution" },
    ],
    "tech-cofounder": [
      { value: "0%", label: "Equity Required" },
      { value: "8+", label: "Startups Served as Technical Lead" },
      { value: "3", label: "Teams Built from Zero" },
      { value: "$2M+", label: "Raised with Our Technical Leadership" },
    ],
    "cto-as-a-service": [
      { value: "8-10h", label: "Weekly Strategic Hours" },
      { value: "70%", label: "Cost Savings vs Full-Time CTO" },
      { value: "5+", label: "Fractional CTO Engagements" },
      { value: "12+", label: "Board Presentations Delivered" },
    ],
    "design-sprint": [
      { value: "5", label: "Days from Problem to Tested Prototype" },
      { value: "5", label: "User Interviews Per Sprint" },
      { value: "40%", label: "Of Sprints Kill the Hypothesis (Saving $$$)" },
      { value: "$50K+", label: "Average Savings When Hypothesis Killed" },
    ],
    "code-audit": [
      { value: "1-2wk", label: "Assessment Turnaround" },
      { value: "100%", label: "Honest Findings (No Sugarcoating)" },
      { value: "5", label: "Avg. Priority Findings Per Audit" },
      { value: "0", label: "Audits Where We Sold Follow-On Work" },
    ],
    "staff-augmentation": [
      { value: "1wk", label: "Time to First Contribution" },
      { value: "7+yr", label: "Average Engineer Experience" },
      { value: "3-12mo", label: "Typical Engagement Duration" },
      { value: "0", label: "Hand-Holding Required" },
    ],
    "retainer": [
      { value: "1", label: "Invoice Per Month (Predictable)" },
      { value: "0", label: "Re-Onboarding Between Projects" },
      { value: "4h", label: "Emergency Response SLA" },
      { value: "95%", label: "Same-Engineer Continuity Rate" },
    ],
    "nearshore": [
      { value: "±2h", label: "Timezone Difference (Max)" },
      { value: "40-60%", label: "Cost Savings vs Local Hires" },
      { value: "C1+", label: "English Fluency Level" },
      { value: "0", label: "Async-Only Communication Days" },
    ],
    "outsourcing": [
      { value: "100%", label: "Milestone-Based Payment" },
      { value: "100%", label: "Complete Documentation Included" },
      { value: "0", label: "Vendor Lock-In (Full Handoff)" },
      { value: "1", label: "Single Point of Accountability" },
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
    "ai-startup": [
      { serviceName: "AI Backend Development", slug: "ai", description: "RAG pipelines, model orchestration, and inference APIs", applicationDetail: "Vector databases, embedding pipelines, retrieval ranking, prompt management, and the orchestration layer that coordinates context and model calls into reliable, measurable outputs." },
      { serviceName: "AI-Native Product Development", slug: "ai-ml", description: "Conversational, generative, and agentic interfaces", applicationDetail: "Streaming response UIs, confidence indicators, source citations, feedback collection, and the interaction patterns that make AI features feel helpful rather than unreliable." },
      { serviceName: "AI Product Design", slug: "ux-ui-design", description: "Human-AI interaction and trust patterns", applicationDetail: "Designing the boundary between AI and human: when to show confidence scores, how to present sources, where to offer corrections, and how to make latency feel acceptable." },
      { serviceName: "ML Infrastructure & Ops", slug: "devops", description: "Model serving, evaluation pipelines, and cost monitoring", applicationDetail: "Model deployment pipelines, A/B testing infrastructure, cost dashboards, quality monitoring, and the eval suites that catch degradation before users notice." },
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
      { serviceName: "AI Backend Development", slug: "ai", description: "RAG pipelines and inference infrastructure", applicationDetail: "Vector databases, embedding pipelines, retrieval ranking, and the orchestration layer that coordinates context, prompts, and model calls into reliable outputs." },
      { serviceName: "AI-Native UX", slug: "ai-ml", description: "Conversational and generative interfaces", applicationDetail: "Streaming response UI, confidence indicators, source citations, feedback mechanisms, and the interaction patterns that make AI features feel helpful rather than unreliable." },
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
      { serviceName: "Trust & Safety Infrastructure", slug: "iam", description: "Fraud detection and content moderation", applicationDetail: "Automated fraud scoring, content moderation queues, user verification workflows, and the dispute resolution system that scales beyond manual review." },
    ],
    "api-product": [
      { serviceName: "API Development", slug: "websites", description: "RESTful or GraphQL API architecture", applicationDetail: "Endpoint design, authentication (API keys, OAuth), pagination, filtering, and the consistent error handling that makes your API predictable for developers." },
      { serviceName: "Developer Portal", slug: "apps", description: "Documentation and SDK platform", applicationDetail: "Interactive API docs, code samples, sandbox environments, and the developer dashboard where users manage keys, monitor usage, and read changelogs." },
      { serviceName: "API DX Design", slug: "ux-ui-design", description: "Developer experience and onboarding", applicationDetail: "The developer journey from signup to first successful API call in under 5 minutes. Quickstart guides, interactive tutorials, and error messages that explain how to fix the problem." },
      { serviceName: "API Infrastructure", slug: "devops", description: "Gateway, scaling, and monitoring", applicationDetail: "API gateway configuration, rate limiting, request logging, uptime monitoring, and the auto-scaling that handles traffic spikes without degraded response times." },
    ],
    "data-platform": [
      { serviceName: "Pipeline Development", slug: "data-engineering", description: "ELT pipeline architecture and implementation", applicationDetail: "Extractors for any source (APIs, databases, files, event streams), dbt transformations with proper testing, and orchestration that recovers from failures automatically." },
      { serviceName: "Analytics Layer", slug: "ai-ml", description: "Semantic layer and BI integration", applicationDetail: "Centralized metric definitions, materialized views for dashboard performance, and integration with Metabase, Looker, or custom visualization tools." },
      { serviceName: "Data Product Design", slug: "ux-ui-design", description: "Dashboard and exploration interfaces", applicationDetail: "Self-serve analytics interfaces, data catalog UX, and the exploration tools that let non-technical stakeholders answer their own questions." },
      { serviceName: "Data Infrastructure", slug: "cloud-engineering", description: "Warehouse, orchestration, and monitoring", applicationDetail: "Snowflake/BigQuery/Redshift configuration, Airflow or Dagster orchestration, and the monitoring that alerts when data is stale, missing, or anomalous." },
    ],
    "iot": [
      { serviceName: "IoT Platform Development", slug: "websites", description: "Device management and fleet operations", applicationDetail: "Fleet dashboards, device status monitoring, remote configuration, and the grouping/segmentation tools that make managing thousands of devices practical." },
      { serviceName: "Firmware Development", slug: "embedded-software", description: "Embedded software for connected devices", applicationDetail: "Application firmware with clean hardware abstraction, power management, connectivity handling, and the OTA update mechanism that keeps devices current safely." },
      { serviceName: "IoT Dashboard Design", slug: "ux-ui-design", description: "Fleet monitoring and telemetry interfaces", applicationDetail: "Real-time device maps, telemetry visualizations, alert management screens, and the operational views that fleet managers need to make decisions quickly." },
      { serviceName: "IoT Infrastructure", slug: "cloud-engineering", description: "MQTT brokers, time-series storage, and edge computing", applicationDetail: "MQTT broker clusters (EMQX, HiveMQ), TimescaleDB or InfluxDB for telemetry, and the edge computing layer that processes data locally when latency matters." },
    ],
    "internal-tools": [
      { serviceName: "Custom Tool Development", slug: "websites", description: "Bespoke operations software", applicationDetail: "Admin panels, approval workflows, data entry interfaces, and the dashboards that replace the spreadsheets your operations team is maintaining in secret." },
      { serviceName: "Workflow Automation", slug: "apps", description: "Process automation and integration", applicationDetail: "Multi-step approval chains, conditional routing, automated notifications, and the integration with external systems that eliminates manual data transfer." },
      { serviceName: "Operations UX Design", slug: "ux-ui-design", description: "High-efficiency internal interfaces", applicationDetail: "Interfaces optimized for 8-hour daily use: keyboard navigation, bulk operations, saved filters, contextual actions, and the density that power users demand." },
      { serviceName: "Integration Architecture", slug: "devops", description: "System connectors and data sync", applicationDetail: "Bidirectional connectors to Salesforce, ERPs, databases, and third-party APIs with real-time sync, error handling, and the retry logic that keeps systems consistent." },
    ],
    "embedded": [
      { serviceName: "Firmware Engineering", slug: "embedded-software", description: "Application and system firmware", applicationDetail: "Bare-metal or RTOS-based firmware with clean architecture: HAL layer, application logic, and communication stack separated for maintainability and hardware portability." },
      { serviceName: "Cloud Backend", slug: "cloud-engineering", description: "Device cloud and management platform", applicationDetail: "Web dashboards for fleet management, firmware distribution systems, telemetry collection, and the APIs that mobile companion apps use to interact with devices." },
      { serviceName: "Hardware UX Design", slug: "ux-ui-design", description: "Physical and companion app interfaces", applicationDetail: "LED patterns, button interactions, companion app flows, and the setup/pairing experience that gets devices connected without a manual or support call." },
      { serviceName: "Embedded DevOps", slug: "automation-testing", description: "CI/CD for firmware and OTA delivery", applicationDetail: "Hardware-in-the-loop testing, automated firmware builds, OTA delivery infrastructure, and the staged rollout system that validates updates before full fleet deployment." },
    ],
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { serviceName: "Full Product Development", slug: "websites", description: "End-to-end product build with all decisions owned", applicationDetail: "We handle architecture, framework selection, database design, and infrastructure. You handle business decisions. Weekly updates explain what was built and why." },
      { serviceName: "Product Strategy", slug: "apps", description: "Feature prioritization and scope management", applicationDetail: "We cut scope to what validates your hypothesis fastest, explain every tradeoff in business terms, and push back when features do not serve your users." },
      { serviceName: "UX & UI Design", slug: "ux-ui-design", description: "User-tested interface design", applicationDetail: "We design and test with real users before building. You see clickable prototypes before any code is written. No guessing what works." },
      { serviceName: "Infrastructure & Launch", slug: "devops", description: "Deployment, hosting, and monitoring", applicationDetail: "We set up hosting, deployment pipelines, and monitoring so your product runs reliably. You never need to touch a server or understand cloud configuration." },
    ],
    "first-time-founder": [
      { serviceName: "MVP Development", slug: "websites", description: "Lean first product with maximum learning", applicationDetail: "The minimum set of features that tests your core hypothesis. Built to production quality so what you ship to users becomes what you scale." },
      { serviceName: "Technical Advisory", slug: "apps", description: "Guidance on decisions you have not faced before", applicationDetail: "Stack selection, architecture decisions, hiring advice, and the pattern recognition from 50+ builds applied to your specific situation." },
      { serviceName: "Product Design", slug: "ux-ui-design", description: "User-centered design for first products", applicationDetail: "We test assumptions with prototypes before building features. User interviews, usability testing, and the data that tells you what to build next." },
      { serviceName: "Launch Infrastructure", slug: "devops", description: "Production-ready deployment from day one", applicationDetail: "CI/CD, monitoring, error tracking, and the infrastructure that lets you ship updates daily without fear. Deployments are boring from the start." },
    ],
    "solo-founder": [
      { serviceName: "Autonomous Development", slug: "websites", description: "Full engineering department as a service", applicationDetail: "Frontend, backend, database, and infrastructure handled independently. You approve direction weekly. No daily management required." },
      { serviceName: "Technical Leadership", slug: "apps", description: "Architecture and strategy decisions", applicationDetail: "We make the decisions a CTO would make: technology selection, architecture design, build-vs-buy choices, and the technical roadmap that aligns with your business goals." },
      { serviceName: "Product Design", slug: "ux-ui-design", description: "Design without requiring your daily input", applicationDetail: "We research your users, design interfaces, test prototypes, and present recommendations. You give direction, not pixel-level feedback." },
      { serviceName: "Full Operations", slug: "devops", description: "Infrastructure, monitoring, and maintenance", applicationDetail: "Hosting, deployments, security patches, uptime monitoring, and incident response. Your product runs reliably without you thinking about servers." },
    ],
    "repeat-founder": [
      { serviceName: "Senior Engineering", slug: "websites", description: "Code quality matching your standards", applicationDetail: "Clean architecture, proper testing, meaningful code review. Engineers who write code you would be proud to show during technical due diligence." },
      { serviceName: "Rapid Execution", slug: "apps", description: "Speed without sacrificing quality", applicationDetail: "Daily commits, weekly milestones, fast iteration cycles. The velocity that comes from senior engineers who know what they are doing and do not need guidance." },
      { serviceName: "Architecture Review", slug: "software-auditing", description: "Validation of technical direction", applicationDetail: "Second opinions on architectural decisions, stack selection, and scaling strategy from engineers who have seen 50+ projects through to production." },
      { serviceName: "Production Excellence", slug: "devops", description: "Infrastructure done right from the start", applicationDetail: "CI/CD, monitoring, alerting, and the deployment confidence that lets you ship on any day without fear. The ops quality you expect." },
    ],
    "student-startup": [
      { serviceName: "Demo Day MVP", slug: "websites", description: "Working product scoped to your deadline", applicationDetail: "A real product (not a prototype) that demonstrates your concept, handles real users, and impresses judges and investors. Delivered before your deadline." },
      { serviceName: "Technical Education", slug: "apps", description: "Learning alongside delivery", applicationDetail: "Every decision explained. Every architecture choice documented. You finish the engagement understanding your product well enough to discuss it with investors." },
      { serviceName: "Pitch-Ready Design", slug: "ux-ui-design", description: "Polished UI that demonstrates vision", applicationDetail: "Clean, professional interface design that makes your product look like it has a full team behind it. First impressions matter at demo day." },
      { serviceName: "Budget-Optimized Infrastructure", slug: "devops", description: "Free-tier hosting that actually works", applicationDetail: "Vercel, Railway, or AWS free tier configured properly. Production-quality hosting that costs $0-20/month until you have revenue or funding." },
    ],
    "corporate-innovator": [
      { serviceName: "Enterprise-Grade Development", slug: "websites", description: "Startup product meeting corporate standards", applicationDetail: "Agile delivery with the documentation, security controls, and audit trail that enterprise governance requires. Speed without compliance shortcuts." },
      { serviceName: "Legacy Integration", slug: "apps", description: "Connecting new products to existing systems", applicationDetail: "SAP, Salesforce, Oracle, and custom internal API integrations. We work with your existing technology landscape, not against it." },
      { serviceName: "Enterprise UX Design", slug: "ux-ui-design", description: "Innovation within corporate design systems", applicationDetail: "Fresh product design that aligns with corporate brand guidelines, accessibility standards, and the internal design system your company maintains." },
      { serviceName: "Compliant Infrastructure", slug: "devops", description: "Hosting that passes security review", applicationDetail: "Infrastructure architecture designed to pass your InfoSec team's review: encryption, access controls, network segmentation, and the documentation they require." },
    ],
    "female-led": [
      { serviceName: "Full Product Development", slug: "websites", description: "Engineering partnership on equal terms", applicationDetail: "Complete product development with transparent pricing, senior engineers, and communication that respects your expertise and time." },
      { serviceName: "Technical Strategy", slug: "apps", description: "Honest technical guidance", applicationDetail: "Architecture decisions, stack recommendations, and scaling strategy delivered as peer-to-peer discussion, not explained-down lectures." },
      { serviceName: "Collaborative Design", slug: "ux-ui-design", description: "Design process that values your input", applicationDetail: "Your product vision and user knowledge inform every design decision. We bring UX expertise. You bring domain expertise. Both are equally weighted." },
      { serviceName: "Reliable Operations", slug: "devops", description: "Infrastructure with full transparency", applicationDetail: "Hosting, deployment, and monitoring with clear documentation. No black boxes, no vendor lock-in, no dependency on us for ongoing access." },
    ],
    "african-startup": [
      { serviceName: "African Market Development", slug: "websites", description: "Products built for real African infrastructure", applicationDetail: "Web and mobile applications optimized for low bandwidth, intermittent connectivity, and the device landscape your actual users have." },
      { serviceName: "Mobile Money Integration", slug: "apps", description: "M-Pesa, Paystack, Flutterwave connectors", applicationDetail: "Payment integrations for the rails your users actually use: mobile money, bank transfer, USSD payment, and the reconciliation each requires." },
      { serviceName: "Low-Bandwidth UX Design", slug: "ux-ui-design", description: "Design for constrained environments", applicationDetail: "Interfaces that load on 2G, work on $50 devices, and communicate effectively with users who have limited digital literacy." },
      { serviceName: "Cost-Effective Infrastructure", slug: "devops", description: "Hosting optimized for African market economics", applicationDetail: "Infrastructure that serves users affordably: edge caching near African users, compressed assets, and hosting costs aligned to your market's revenue potential." },
    ],
    "diaspora-founder": [
      { serviceName: "Multi-Market Platform", slug: "websites", description: "One product serving multiple countries", applicationDetail: "Architecture that handles multi-currency, multi-language, and multi-regulation requirements without maintaining separate codebases for each market." },
      { serviceName: "Cross-Border Payments", slug: "apps", description: "Remittance and multi-currency flows", applicationDetail: "Payment infrastructure that moves money across borders: currency conversion, settlement, regulatory reporting, and the UX that makes international transactions feel local." },
      { serviceName: "Cross-Cultural UX Design", slug: "ux-ui-design", description: "Interfaces for multiple markets", applicationDetail: "Design that adapts to cultural context: language, layout direction, color meaning, communication style, and the user expectations that differ between your target markets." },
      { serviceName: "Multi-Region Infrastructure", slug: "devops", description: "Hosting that serves both markets fast", applicationDetail: "CDN configuration, data residency compliance, and the multi-region deployment that gives users in both markets fast, compliant experiences." },
    ],
    "social-enterprise": [
      { serviceName: "Impact-Focused Development", slug: "websites", description: "Technology that maximizes social outcome", applicationDetail: "Features prioritized by impact per development dollar. Nothing built because it is technically interesting. Everything built because it moves your mission forward." },
      { serviceName: "Accessible Design & Dev", slug: "apps", description: "WCAG AA compliant applications", applicationDetail: "Screen reader compatible, keyboard navigable, proper contrast ratios, and alt text on every element. Tested with assistive technology, not just visual inspection." },
      { serviceName: "Inclusive UX Design", slug: "ux-ui-design", description: "Design for all users regardless of ability", applicationDetail: "User research that includes people with disabilities, older adults, and users with limited digital literacy. Design validated with the actual people you serve." },
      { serviceName: "Grant-Budget Infrastructure", slug: "devops", description: "Hosting that fits nonprofit budgets", applicationDetail: "AWS Activate credits, Google for Nonprofits, or Vercel's open-source tier. Production-quality hosting at costs that fit grant budgets and donor expectations." },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { serviceName: "Rapid Product Development", slug: "websites", description: "MVP shipped in 4-6 weeks", applicationDetail: "Full-stack development at startup speed: scope on Monday, build Tuesday through Friday, ship working software every two weeks until the product is complete." },
      { serviceName: "Scope Definition", slug: "apps", description: "Feature set reduced to essentials", applicationDetail: "Structured scoping that identifies the 3-5 features validating your core hypothesis and cuts everything else. What remains ships fast and learns fast." },
      { serviceName: "Speed-Optimized Design", slug: "ux-ui-design", description: "UI that looks great without slowing delivery", applicationDetail: "Design system selection (not custom design), proven UX patterns, and the minimal interface work that makes your MVP look professional without adding weeks." },
      { serviceName: "Instant Infrastructure", slug: "devops", description: "Deploy pipeline operational in day one", applicationDetail: "Vercel or AWS with CI/CD configured before feature work begins. Every commit deploys to staging. Production ships with a button click." },
    ],
    "scaling-tech": [
      { serviceName: "Performance Audit", slug: "software-auditing", description: "Full-stack bottleneck identification", applicationDetail: "Database query profiling, API response time analysis, frontend rendering measurement, and infrastructure utilization tracking. Find the real problem before fixing anything." },
      { serviceName: "Architecture Remediation", slug: "cloud-engineering", description: "Targeted fixes for scaling bottlenecks", applicationDetail: "Database indexing, query optimization, caching layers, connection pooling, and the targeted interventions that resolve 80% of performance issues without rewriting." },
      { serviceName: "System Design Review", slug: "software-auditing", description: "Architecture evolution planning", applicationDetail: "Assessment of current architecture against growth projections. Identification of which components need evolution and in what order for maximum impact." },
      { serviceName: "Deployment Modernization", slug: "devops", description: "CI/CD and deployment confidence", applicationDetail: "Automated testing, staging environments, feature flags, and rollback capability. Deploy on any day without fear. Monitor without manual checking." },
    ],
    "agency-rescue": [
      { serviceName: "Codebase Assessment", slug: "websites", description: "Honest evaluation of what you have", applicationDetail: "Complete codebase review: security vulnerabilities, architecture quality, test coverage, documentation state. Written report with salvage-vs-replace recommendations." },
      { serviceName: "Stabilization Sprint", slug: "apps", description: "Critical fixes and production stability", applicationDetail: "Security patches, crash-causing bugs, and data-loss risks addressed immediately. Production stabilized before any forward development begins." },
      { serviceName: "Architecture Recovery", slug: "software-auditing", description: "System documentation and understanding", applicationDetail: "Architecture diagrams, data flow documentation, and deployment procedures written from code analysis. The knowledge your previous team never documented." },
      { serviceName: "Recovery Development", slug: "devops", description: "Forward progress from current state", applicationDetail: "Pragmatic recovery plan executed: keep what works, replace what does not, add testing, and restore development velocity without a ground-up rewrite." },
    ],
    "fundraising-ready": [
      { serviceName: "Security Hardening", slug: "websites", description: "Vulnerability remediation and hardening", applicationDetail: "Dependency updates, vulnerability patches, encryption verification, access control audit, and the security posture that survives investor-commissioned CTO review." },
      { serviceName: "Technical Documentation", slug: "software-auditing", description: "Architecture and strategy documentation", applicationDetail: "System diagrams, technology rationale, scaling strategy, and technical roadmap prepared for the audience that will review them: experienced CTOs and technical investors." },
      { serviceName: "Load Testing", slug: "automation-testing", description: "Performance under growth projections", applicationDetail: "Simulated traffic at 10x current load. Breaking points identified and documented. Report proves architecture handles the growth narrative in your pitch." },
      { serviceName: "Due Diligence Infrastructure", slug: "devops", description: "Monitoring, logging, and evidence", applicationDetail: "Uptime monitoring, error tracking, security scanning, and the observability infrastructure that demonstrates operational maturity to technical reviewers." },
    ],
    "ai-integration": [
      { serviceName: "AI Feature Development", slug: "ai", description: "RAG pipelines and AI-native features", applicationDetail: "Complete AI feature implementation: retrieval infrastructure, model orchestration, streaming responses, and the production UX that makes AI feel reliable." },
      { serviceName: "Eval Infrastructure", slug: "ai-ml", description: "Quality measurement and monitoring", applicationDetail: "Golden dataset creation, automated quality scoring, regression detection, and the A/B testing infrastructure that measures whether AI changes help or hurt." },
      { serviceName: "AI UX Design", slug: "ux-ui-design", description: "Human-AI interaction patterns", applicationDetail: "Confidence indicators, source citations, loading states, error messages, and the interaction design that sets correct user expectations for AI capabilities." },
      { serviceName: "AI Infrastructure", slug: "devops", description: "Model serving and cost management", applicationDetail: "Vector database hosting, model API management, caching layers, and the cost monitoring that keeps per-query expenses predictable as usage scales." },
    ],
    "tech-debt": [
      { serviceName: "Debt Audit", slug: "websites", description: "Codebase analysis and prioritization", applicationDetail: "Every piece of technical debt scored by velocity impact and reliability risk. Prioritized remediation plan that fixes the highest-impact debt first." },
      { serviceName: "Incremental Modernization", slug: "digital-transformation", description: "Strangler fig refactoring", applicationDetail: "Problematic modules replaced one at a time with clean implementations. Feature development continues in parallel. No velocity freeze required." },
      { serviceName: "Testing Implementation", slug: "automation-testing", description: "Automated test coverage on critical paths", applicationDetail: "Integration and unit tests added to the code paths that break most often. Each test prevents a category of future regressions." },
      { serviceName: "DevOps Remediation", slug: "devops", description: "Deployment and monitoring restoration", applicationDetail: "CI/CD pipelines, automated quality gates, staging environments, and the monitoring that catches problems before users report them." },
    ],
    "security-compliance": [
      { serviceName: "Security Engineering", slug: "security-audit", description: "Controls implementation as code", applicationDetail: "Encryption enforcement, access logging, MFA requirements, and network segmentation implemented at the infrastructure level. Automated, auditable, continuous." },
      { serviceName: "Compliance Automation", slug: "apps", description: "Evidence generation and monitoring", applicationDetail: "Automated compliance evidence collection: access logs, encryption status, backup verification, vulnerability scans. Audit preparation becomes a documentation exercise." },
      { serviceName: "Gap Assessment", slug: "security-audit", description: "Framework-specific posture analysis", applicationDetail: "Current state mapped against SOC 2, HIPAA, PCI-DSS, or GDPR requirements. Gap list with prioritized remediation plan and effort estimates per item." },
      { serviceName: "Audit Preparation", slug: "security-audit", description: "Penetration testing and documentation", applicationDetail: "Penetration tests executed, remediation completed, documentation packaged, and questionnaire responses prepared. Your auditor receives a complete, organized evidence package." },
    ],
    "post-pivot": [
      { serviceName: "Codebase Triage", slug: "websites", description: "Salvage-vs-replace assessment", applicationDetail: "Every module evaluated for applicability to the new direction. Honest assessment: keep, modify, or discard. Delivered in 1-2 weeks with cost estimates for each path." },
      { serviceName: "Rapid Rebuild", slug: "apps", description: "Minimum viable pivot execution", applicationDetail: "Surgical modifications to existing code plus new components for the pivoted direction. Maximum reuse, minimum waste. Ship in 6-8 weeks." },
      { serviceName: "Pivot UX Design", slug: "ux-ui-design", description: "New direction interface design", applicationDetail: "Interface design for the pivoted product direction. Fast iteration on new user flows while reusing visual design systems from the previous version." },
      { serviceName: "Migration Infrastructure", slug: "devops", description: "Data migration and deployment", applicationDetail: "User data preserved across the pivot. Existing accounts migrated to new features. Deployment pipeline adapted for the new architecture." },
    ],
    "no-tech-team": [
      { serviceName: "Full-Stack Development", slug: "websites", description: "Complete engineering as a service", applicationDetail: "Frontend, backend, database, API design, and infrastructure. Every engineering role covered by one engagement. No gaps, no coordination between vendors." },
      { serviceName: "Technical Leadership", slug: "apps", description: "Architecture and strategy decisions", applicationDetail: "Technology selection, architecture design, build-vs-buy decisions, and the technical roadmap that aligns with your business goals. CTO-level thinking without the CTO hire." },
      { serviceName: "Product Design", slug: "ux-ui-design", description: "UX/UI without requiring your daily input", applicationDetail: "User research, interface design, prototype testing, and design system creation. Delivered autonomously with your approval at key milestones." },
      { serviceName: "Complete Operations", slug: "devops", description: "Infrastructure and ongoing maintenance", applicationDetail: "Hosting, deployment, monitoring, security patches, and incident response. Your product runs reliably without you understanding or managing the infrastructure." },
    ],
    "africa-launch": [
      { serviceName: "Market Adaptation", slug: "websites", description: "Product re-architecture for African markets", applicationDetail: "Your existing product adapted for low bandwidth, mobile money, offline capability, and the device landscape of your target African markets." },
      { serviceName: "Payment Integration", slug: "apps", description: "African payment rail connectors", applicationDetail: "M-Pesa, Paystack, Flutterwave, and mobile money integrations with proper reconciliation, settlement handling, and failure recovery." },
      { serviceName: "Low-Bandwidth UX", slug: "ux-ui-design", description: "Interface optimization for constrained networks", applicationDetail: "Asset compression, progressive loading, offline-first patterns, and the UX redesign that makes your product usable on 2G connections." },
      { serviceName: "African Infrastructure", slug: "devops", description: "Hosting and compliance for African markets", applicationDetail: "CDN endpoints near African users, data localization for countries requiring it, and hosting costs aligned to African market revenue potential." },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { serviceName: "Scoped MVP Development", slug: "websites", description: "Fixed-price product delivery", applicationDetail: "Scope defined, price locked, timeline agreed. Development proceeds with milestone payments on working software. No hourly billing, no surprise costs." },
      { serviceName: "Scope Definition", slug: "apps", description: "Pre-build specification and pricing", applicationDetail: "Detailed scope document with features, screens, integrations, and acceptance criteria. Fixed price quoted against this scope. Changes require mutual agreement." },
      { serviceName: "MVP Design", slug: "ux-ui-design", description: "Lean interface design within fixed scope", applicationDetail: "Design system selection, key screen layouts, and the minimal UX work that makes your MVP professional without adding weeks to the timeline." },
      { serviceName: "Launch Infrastructure", slug: "devops", description: "Deployment included in fixed price", applicationDetail: "CI/CD, hosting, and monitoring configured as part of the fixed-price delivery. No additional infrastructure charges. Everything needed for launch is included." },
    ],
    "dedicated-team": [
      { serviceName: "Embedded Engineering", slug: "websites", description: "Full-stack team in your workflow", applicationDetail: "2-8 engineers attending your standups, using your tools, following your standards. They know your codebase because they have been in it for months." },
      { serviceName: "Team Scaling", slug: "apps", description: "Flexible capacity adjustment", applicationDetail: "Add engineers for a sprint push. Remove after launch. Scale back up for the next milestone. No hiring cycles, no severance, no paperwork." },
      { serviceName: "Technical Leadership", slug: "dedicated-teams", description: "Architecture guidance within your team", applicationDetail: "A tech lead embedded with your dedicated team who makes architecture decisions, conducts code reviews, and ensures technical quality matches your standards." },
      { serviceName: "Team Operations", slug: "devops", description: "Process and delivery management", applicationDetail: "Sprint planning, backlog grooming, velocity tracking, and the delivery process that keeps your dedicated team productive without your daily management." },
    ],
    "tech-cofounder": [
      { serviceName: "Technical Strategy", slug: "websites", description: "CTO-level architecture and direction", applicationDetail: "Technology selection, system design, scalability planning, and the long-term technical vision that guides every daily engineering decision." },
      { serviceName: "Team Building", slug: "apps", description: "Engineering hiring and management", applicationDetail: "Job descriptions, candidate sourcing, technical interviews, offer negotiation, and onboarding. Build the engineering team with CTO-level judgment." },
      { serviceName: "Investor Relations", slug: "cloud-consulting", description: "Technical representation to board and investors", applicationDetail: "Board updates, due diligence support, technical roadmap presentations, and the credibility that comes from having a named technical leader." },
      { serviceName: "Hands-On Development", slug: "devops", description: "Architecture implementation and code", applicationDetail: "Not just strategy. Hands-on architecture implementation, critical path coding, and the technical execution that proves the vision is achievable." },
    ],
    "cto-as-a-service": [
      { serviceName: "Architecture Reviews", slug: "websites", description: "System design evaluation and direction", applicationDetail: "Weekly architecture reviews that resolve technical debates, set direction, and ensure your team builds consistently toward the 2-year technical vision." },
      { serviceName: "Technology Strategy", slug: "apps", description: "Build-vs-buy and vendor decisions", applicationDetail: "Framework evaluation, vendor selection, infrastructure decisions, and the strategic thinking that prevents expensive technology mistakes." },
      { serviceName: "Board Communication", slug: "cloud-consulting", description: "Technical updates for non-technical stakeholders", applicationDetail: "Monthly board updates, investor reports, and the translation of engineering progress into business outcomes that stakeholders understand." },
      { serviceName: "Hiring Strategy", slug: "devops", description: "Engineering team scaling guidance", applicationDetail: "When to hire, who to hire, how to evaluate, and how to structure your engineering organization as it grows from 2 to 20 engineers." },
    ],
    "design-sprint": [
      { serviceName: "Sprint Facilitation", slug: "websites", description: "Structured 5-day product validation", applicationDetail: "Monday: problem definition. Tuesday: solution sketching. Wednesday: decision and storyboarding. Thursday: prototype building. Friday: user testing." },
      { serviceName: "Rapid Prototyping", slug: "apps", description: "Clickable prototype in one day", applicationDetail: "High-fidelity prototype built on Thursday that feels real enough for users to react authentically during Friday's testing sessions." },
      { serviceName: "User Testing", slug: "ux-ui-design", description: "5 user interviews on Day 5", applicationDetail: "Recruited participants matching your target user profile. Structured interviews that test specific hypotheses. Synthesized insights delivered same day." },
      { serviceName: "Sprint Output", slug: "devops", description: "Validated direction and build spec", applicationDetail: "Sprint report with: validated/invalidated hypotheses, user quotes, prototype files, and if validated, a development specification ready for building." },
    ],
    "code-audit": [
      { serviceName: "Codebase Review", slug: "websites", description: "Architecture and code quality assessment", applicationDetail: "Complete review of code structure, patterns, test coverage, dependency health, and architecture sustainability. Findings scored by severity and impact." },
      { serviceName: "Security Assessment", slug: "apps", description: "Vulnerability identification and severity rating", applicationDetail: "Dependency vulnerability scan, authentication review, data exposure analysis, and the security findings that matter most for your risk profile." },
      { serviceName: "Architecture Evaluation", slug: "software-auditing", description: "Scalability and maintainability assessment", applicationDetail: "Can this architecture handle 10x growth? Can new engineers understand it? Where are the coupling problems? Assessment against your growth plans." },
      { serviceName: "Remediation Planning", slug: "devops", description: "Prioritized fix plan with effort estimates", applicationDetail: "Every finding paired with: recommended fix approach, effort estimate, priority level, and risk of inaction. A roadmap, not just a report." },
    ],
    "staff-augmentation": [
      { serviceName: "Senior Engineer Placement", slug: "websites", description: "Individual contributors joining your team", applicationDetail: "1-3 senior engineers integrated into your existing workflow. They attend your standups, follow your process, and contribute code through your review system." },
      { serviceName: "Skill-Specific Experts", slug: "apps", description: "Targeted expertise for specific needs", applicationDetail: "DevOps specialist for a migration. React expert for a frontend rebuild. Python ML engineer for a data project. Exact skill match for your specific need." },
      { serviceName: "Team Integration", slug: "dedicated-teams", description: "Seamless workflow alignment", applicationDetail: "Engineers who adopt your code style, your PR process, your documentation standards, and your communication patterns within their first week." },
      { serviceName: "Flexible Duration", slug: "devops", description: "Scale to your timeline", applicationDetail: "3-month minimum, then month-to-month. Extend when the work continues. End when the need passes. No long-term contract required." },
    ],
    "retainer": [
      { serviceName: "Ongoing Development", slug: "websites", description: "Continuous feature delivery", applicationDetail: "Monthly capacity for feature development, improvements, and iterations. Same engineers every month who know your codebase and can estimate accurately." },
      { serviceName: "Maintenance & Support", slug: "apps", description: "Bug fixes and production stability", applicationDetail: "Priority response for production issues. Bug fixes within SLA. Dependency updates and security patches handled without a separate contract." },
      { serviceName: "Technical Advisory", slug: "cloud-consulting", description: "Ongoing architecture guidance", applicationDetail: "Technology decisions, architecture reviews, and scaling guidance as your product evolves. Consistent technical leadership month to month." },
      { serviceName: "Infrastructure Management", slug: "devops", description: "Hosting, monitoring, and operations", applicationDetail: "Server management, cost optimization, uptime monitoring, and the operational work that keeps your product running without dedicated DevOps staff." },
    ],
    "nearshore": [
      { serviceName: "Nearshore Engineering", slug: "websites", description: "Senior engineers in your timezone", applicationDetail: "Full-stack engineers within 2 hours of your timezone. Real-time collaboration, pair programming capability, and zero async-only communication days." },
      { serviceName: "Team Extension", slug: "apps", description: "Integrated nearshore capacity", applicationDetail: "Nearshore engineers embedded in your team process. Same standup, same Slack, same code reviews. The only difference from local hires is the invoice amount." },
      { serviceName: "Process Alignment", slug: "nearshore", description: "Western agile methodology", applicationDetail: "Sprint planning, retrospectives, code review culture, and CI/CD expectations. No process mismatch. No cultural translation needed." },
      { serviceName: "Quality Assurance", slug: "devops", description: "Code standards and review", applicationDetail: "Same code quality standards as local teams. Automated testing, peer review, and the engineering discipline that produces maintainable software." },
    ],
    "outsourcing": [
      { serviceName: "Project Delivery", slug: "websites", description: "End-to-end product development", applicationDetail: "Requirements in, working software out. We own architecture, development, testing, deployment, and documentation. One contract, one deliverable." },
      { serviceName: "Milestone Management", slug: "apps", description: "Progress-based delivery tracking", applicationDetail: "Clear milestones with acceptance criteria. Payment on delivery of working software. Visibility into progress without daily management overhead." },
      { serviceName: "Documentation & Handoff", slug: "outsourcing", description: "Complete knowledge transfer", applicationDetail: "Architecture guides, deployment procedures, code documentation, and optional training. Your future team maintains the system without us." },
      { serviceName: "Quality & Testing", slug: "devops", description: "Production-ready delivery standard", applicationDetail: "Automated test suites, CI/CD pipelines, and the quality assurance that means 'delivered' equals 'production-ready,' not 'it compiles.'" },
    ],
  };

  return verticalServices[id] ?? [
    { serviceName: "Custom Software Development", slug: "websites", description: "Full-stack web application development", applicationDetail: "We build your core product using modern frameworks (React, Next.js, Node.js) with clean architecture that scales." },
    { serviceName: "Mobile Apps Development", slug: "apps", description: "iOS and Android application development", applicationDetail: "Cross-platform mobile apps in React Native that share 90% of code between platforms while feeling native." },
    { serviceName: "UX & UI Design", slug: "ux-ui-design", description: "User experience and interface design", applicationDetail: "Research-driven design that converts users, with prototypes tested before a line of production code is written." },
    { serviceName: "DevOps Consulting", slug: "devops", description: "Infrastructure and deployment automation", applicationDetail: "CI/CD pipelines, infrastructure-as-code, and monitoring that makes deployments boring and reliable." },
  ];
}

function getBrandingCard(id: string, title: string, category: string): StartupServiceApplication {
  // Per-startup branding cards with contextual names
  const perStartup: Record<string, StartupServiceApplication> = {
    // BY STAGE
    "pre-idea": { serviceName: "Discovery-Stage Brand Identity", slug: "startup-branding", description: "Visual credibility before you have a product", applicationDetail: "Logo, color system, and pitch deck design that makes investors take your concept seriously before a line of code exists." },
    "validation": { serviceName: "Validation-Ready Brand Design", slug: "startup-branding", description: "Professional presence for user testing", applicationDetail: "Brand identity polished enough that test users engage with your product as real, not as a student project. First impressions drive honest feedback." },
    "mvp": { serviceName: "MVP Brand & Visual Identity", slug: "startup-branding", description: "Ship with a brand that matches your product quality", applicationDetail: "Logo, color system, and UI brand tokens designed alongside your MVP so the product looks intentional from launch day. Not an afterthought." },
    "early-traction": { serviceName: "Growth-Stage Brand Refinement", slug: "startup-branding", description: "Brand that scales with your traction", applicationDetail: "Refine the brand you launched with into a system that works across marketing, product, and investor materials as your audience grows." },
    "seed-stage": { serviceName: "Seed-Stage Brand Identity", slug: "startup-branding", description: "Investor-grade visual presence", applicationDetail: "Logo, brand guidelines, and pitch deck design that signals professionalism to seed investors. Fixed price, delivered before your next meeting." },
    "series-a": { serviceName: "Series A Brand Upgrade", slug: "startup-branding", description: "Brand that matches enterprise ambitions", applicationDetail: "Evolve your scrappy startup brand into one that enterprise prospects and Series A investors take seriously. Design system included." },
    "series-b-plus": { serviceName: "Enterprise Brand System", slug: "startup-branding", description: "Scalable brand architecture", applicationDetail: "Multi-product brand system, sub-brand guidelines, and the design infrastructure that keeps 50+ people producing consistent materials." },
    "bootstrapped": { serviceName: "Budget-Smart Brand Design", slug: "startup-branding", description: "Professional identity at bootstrapped prices", applicationDetail: "Clean logo, tight color palette, and brand guidelines that punch above your budget. No agency markup, no 8-week timeline. Two weeks, fixed price." },
    "growth": { serviceName: "Growth-Phase Brand System", slug: "startup-branding", description: "Brand system that scales with your team", applicationDetail: "Design tokens, component guidelines, and brand documentation that keeps your product visually consistent as your engineering team grows." },
    "scale-up": { serviceName: "Scale-Up Brand Architecture", slug: "startup-branding", description: "Multi-team brand consistency", applicationDetail: "Brand governance for companies where 5+ teams ship independently. Design system, usage guidelines, and approval workflows that maintain coherence." },
    // BY VERTICAL
    "fintech": { serviceName: "Fintech Brand & Trust Design", slug: "startup-branding", description: "Visual identity that signals financial trustworthiness", applicationDetail: "Brand system designed to make users comfortable giving you their money. Trust signals, professional typography, and the visual restraint fintech demands." },
    "healthtech": { serviceName: "Healthtech Brand Identity", slug: "startup-branding", description: "Clinical credibility through design", applicationDetail: "Brand that communicates medical seriousness without feeling cold. Accessibility-first color choices, WCAG-compliant palettes, and the trust healthcare requires." },
    "edtech": { serviceName: "EdTech Brand & Learning Identity", slug: "startup-branding", description: "Engaging brand for educators and learners", applicationDetail: "Visual identity that feels credible to administrators buying it and engaging to students using it. Two audiences, one cohesive brand." },
    "proptech": { serviceName: "PropTech Brand Identity", slug: "startup-branding", description: "Premium brand for property technology", applicationDetail: "Brand system that conveys the professionalism real estate expects. Clean, premium, trustworthy, designed to work on listing pages and investor decks alike." },
    "legaltech": { serviceName: "LegalTech Professional Identity", slug: "startup-branding", description: "Brand that law firms take seriously", applicationDetail: "Visual identity designed for an audience that bills in 6-minute increments. Professional, restrained, and credible enough for enterprise legal procurement." },
    "ai-startup": { serviceName: "AI Brand & Product Identity", slug: "startup-branding", description: "Brand that differentiates in a crowded AI market", applicationDetail: "When every competitor looks the same (purple gradients, robot icons), a distinctive brand is your first competitive advantage. Stand out before they try the product." },
    "logistics-tech": { serviceName: "Logistics Brand Identity", slug: "startup-branding", description: "Operational brand for fleet and supply chain", applicationDetail: "Brand that works on driver apps, dispatch screens, and enterprise sales decks simultaneously. Functional, clear, and recognizable at a glance." },
    "ecommerce": { serviceName: "E-commerce Brand & Storefront Design", slug: "startup-branding", description: "Conversion-optimized brand identity", applicationDetail: "Brand system designed for product pages, checkout flows, and marketing emails. Every visual choice measured by its impact on purchase confidence." },
    "b2b-saas": { serviceName: "B2B SaaS Brand System", slug: "startup-branding", description: "Enterprise-ready visual identity", applicationDetail: "Brand that passes the 'would I put this in a board presentation' test. Clean, professional, scalable across product, marketing, and sales materials." },
    "consumer-apps": { serviceName: "Consumer App Brand Identity", slug: "startup-branding", description: "Memorable brand for app store competition", applicationDetail: "App icon, brand palette, and visual system designed to stand out in crowded app stores and be instantly recognizable on a home screen." },
    // BY PRODUCT TYPE
    "web-app": { serviceName: "Web App Brand & Design System", slug: "startup-branding", description: "Visual foundation for your application", applicationDetail: "Brand tokens, color scales, and typography choices that translate directly into your component library. Design and development aligned from the start." },
    "mobile-app": { serviceName: "Mobile App Brand Identity", slug: "startup-branding", description: "App icon and visual system for both stores", applicationDetail: "Brand identity optimized for mobile: app icon, splash screen, notification branding, and the visual system that makes your app recognizable everywhere." },
    "ai-product": { serviceName: "AI Product Brand Identity", slug: "startup-branding", description: "Brand that communicates intelligence without hype", applicationDetail: "Visual identity that signals sophistication without the cliched robot/brain imagery. Stand apart from the AI crowd with a brand that feels trustworthy." },
    "saas-platform": { serviceName: "SaaS Platform Brand System", slug: "startup-branding", description: "Scalable brand for product-led growth", applicationDetail: "Brand system that works across your marketing site, product UI, documentation, and email sequences. Consistent from first visit to power user." },
    "marketplace": { serviceName: "Marketplace Brand Identity", slug: "startup-branding", description: "Brand that both sides of your marketplace trust", applicationDetail: "Visual identity credible to sellers listing inventory and appealing to buyers browsing it. Neutrality and trustworthiness as design principles." },
    "api-product": { serviceName: "Developer-Facing Brand Identity", slug: "startup-branding", description: "Brand developers respect", applicationDetail: "Visual identity for docs, dashboards, and dev portals. Clean, technical, no-nonsense. The visual equivalent of good developer experience." },
    "data-platform": { serviceName: "Data Product Brand System", slug: "startup-branding", description: "Brand for technical and business audiences", applicationDetail: "Visual identity that works on analyst dashboards and executive presentations equally. Data visualization palette and clear information hierarchy included." },
    "iot": { serviceName: "IoT Product Brand Identity", slug: "startup-branding", description: "Brand that bridges hardware and software", applicationDetail: "Visual identity that works on device packaging, companion apps, and fleet dashboards. Consistent brand across physical and digital touchpoints." },
    "internal-tools": { serviceName: "Internal Tool Brand & UX Kit", slug: "startup-branding", description: "Professional identity for ops software", applicationDetail: "Even internal tools benefit from cohesive branding. Component library, color system, and visual guidelines that make your internal software feel intentional." },
    "embedded": { serviceName: "Hardware Brand & Packaging Design", slug: "startup-branding", description: "Brand that works on devices and screens", applicationDetail: "Visual identity for product packaging, device interfaces (LED colors, screen UI), companion apps, and marketing materials. One brand, every surface." },
    // BY FOUNDER TYPE
    "non-technical-founder": { serviceName: "Founder Brand & Pitch Identity", slug: "startup-branding", description: "Visual credibility for investor conversations", applicationDetail: "Logo, brand guidelines, and pitch deck template that make your startup look like it has a team of 20 behind it. First impressions close rounds." },
    "first-time-founder": { serviceName: "First Product Brand Identity", slug: "startup-branding", description: "Professional brand without the learning curve", applicationDetail: "We handle logo, colors, typography, and guidelines. You get a brand system that looks like you spent $50K at an agency. Fixed price, 2 weeks." },
    "solo-founder": { serviceName: "Solo Founder Brand Package", slug: "startup-branding", description: "Complete brand without managing a designer", applicationDetail: "Logo, brand guidelines, social media templates, and pitch deck design delivered autonomously. You approve direction once, we deliver everything." },
    "repeat-founder": { serviceName: "Premium Brand Execution", slug: "startup-branding", description: "Brand quality matching your standards", applicationDetail: "You know what good branding looks like. We deliver at that level: strategic positioning, distinctive visual identity, and a system that scales." },
    "student-startup": { serviceName: "Demo Day Brand Kit", slug: "startup-branding", description: "Polished brand for accelerator presentations", applicationDetail: "Logo, pitch deck template, and product screenshots that make judges take you seriously. Delivered before your demo day deadline." },
    "corporate-innovator": { serviceName: "Innovation Lab Brand Identity", slug: "startup-branding", description: "Brand that fits corporate governance", applicationDetail: "Visual identity for your internal venture that aligns with corporate brand guidelines while feeling distinctly new. Both compliant and differentiated." },
    "female-led": { serviceName: "Founder-Led Brand Identity", slug: "startup-branding", description: "Brand that reflects your vision accurately", applicationDetail: "Collaborative brand development that centers your creative vision. We execute, you direct. No unsolicited 'suggestions' about making it more feminine." },
    "african-startup": { serviceName: "Pan-African Brand Identity", slug: "startup-branding", description: "Brand that works across African markets", applicationDetail: "Visual identity designed for diverse African markets: works on feature phone screens, low-bandwidth connections, and premium app stores equally." },
    "diaspora-founder": { serviceName: "Cross-Market Brand System", slug: "startup-branding", description: "One brand that works in multiple cultures", applicationDetail: "Visual identity that resonates in both your home market and your current market. Color, typography, and imagery choices that cross cultural boundaries." },
    "social-enterprise": { serviceName: "Impact-Driven Brand Identity", slug: "startup-branding", description: "Brand that communicates mission and credibility", applicationDetail: "Visual identity that signals both social purpose and operational competence. Works on grant applications, donor reports, and user-facing products." },
    // BY CHALLENGE
    "fast-mvp": { serviceName: "Launch-Ready Brand Kit", slug: "startup-branding", description: "Brand shipped alongside your MVP", applicationDetail: "Logo, color palette, and UI brand tokens delivered in week 1 so your product launches with visual coherence, not a placeholder logo." },
    "scaling-tech": { serviceName: "Brand System for Scale", slug: "startup-branding", description: "Design system that scales with your engineering team", applicationDetail: "Formalize your brand into tokens and components that 10+ engineers can use consistently without a designer reviewing every PR." },
    "agency-rescue": { serviceName: "Brand Recovery & Cleanup", slug: "startup-branding", description: "Fix the inconsistent brand your agency left", applicationDetail: "Audit what exists, decide what to keep, and produce a clean brand system from the fragments. No more 5 different button colors." },
    "fundraising-ready": { serviceName: "Investor-Grade Brand Polish", slug: "startup-branding", description: "Brand that survives due diligence optics", applicationDetail: "Visual identity refined to the quality investors expect. Pitch deck design, product screenshots, and brand consistency that signals operational maturity." },
    "ai-integration": { serviceName: "AI Feature Brand Integration", slug: "startup-branding", description: "Visual language for AI-powered features", applicationDetail: "How AI features look and feel within your existing brand: loading states, confidence indicators, and UI patterns that feel native, not bolted on." },
    "tech-debt": { serviceName: "Design System Modernization", slug: "startup-branding", description: "Brand cleanup as part of debt reduction", applicationDetail: "Consolidate inconsistent UI patterns into a proper design system. Fewer colors, fewer fonts, fewer component variants. Visual debt paid alongside technical debt." },
    "security-compliance": { serviceName: "Trust-Forward Brand Identity", slug: "startup-branding", description: "Brand that communicates security competence", applicationDetail: "Visual identity that makes compliance-conscious buyers comfortable. Professional, restrained, and subtly communicating 'we take this seriously.'" },
    "post-pivot": { serviceName: "Post-Pivot Brand Refresh", slug: "startup-branding", description: "New brand for your new direction", applicationDetail: "Your old brand represents your old product. New direction, new identity. Delivered in 2 weeks so you can relaunch without carrying old baggage." },
    "no-tech-team": { serviceName: "Complete Brand & Identity", slug: "startup-branding", description: "Brand design without needing a creative team", applicationDetail: "Logo, brand guidelines, pitch deck, and social media templates. Everything you need to look established, delivered without you hiring a designer." },
    "africa-launch": { serviceName: "African Market Brand Adaptation", slug: "startup-branding", description: "Brand localized for African audiences", applicationDetail: "Adapt your existing brand for African markets: color meanings, imagery preferences, and visual patterns that resonate locally without a full rebrand." },
    // BY ENGAGEMENT
    "fixed-price-mvp": { serviceName: "MVP Brand Kit (Included)", slug: "startup-branding", description: "Brand identity bundled with your build", applicationDetail: "Logo, color palette, and product brand tokens included in your fixed-price MVP. Ship with a cohesive brand, not placeholder assets." },
    "dedicated-team": { serviceName: "Brand & Design System Support", slug: "startup-branding", description: "Ongoing brand evolution with your team", applicationDetail: "Your dedicated team maintains and evolves your brand system alongside product development. Design and engineering always aligned." },
    "tech-cofounder": { serviceName: "Founder Brand & Positioning", slug: "startup-branding", description: "Brand strategy as part of technical leadership", applicationDetail: "As your technical co-founder, we ensure brand decisions align with product strategy. Visual identity that supports the technical story you tell investors." },
    "cto-as-a-service": { serviceName: "Strategic Brand Direction", slug: "startup-branding", description: "Brand oversight within technical leadership", applicationDetail: "Brand consistency maintained as part of fractional CTO engagement. Design reviews, system governance, and visual quality standards." },
    "design-sprint": { serviceName: "Sprint Brand Exploration", slug: "startup-branding", description: "Brand direction tested in 5 days", applicationDetail: "Day 2 of your design sprint includes brand positioning. By Friday, you know what visual direction resonates with users, not just what looks good." },
    "code-audit": { serviceName: "Brand & Design Audit", slug: "startup-branding", description: "Visual consistency assessment", applicationDetail: "Alongside your code audit, we assess brand implementation: inconsistent colors, orphaned components, and the visual debt hiding in your UI." },
    "staff-augmentation": { serviceName: "Design Engineer Placement", slug: "startup-branding", description: "Brand-aware engineer for your team", applicationDetail: "Engineers who understand and respect your design system. They implement brand consistently without needing designer review on every component." },
    "retainer": { serviceName: "Ongoing Brand Maintenance", slug: "startup-branding", description: "Brand evolution as part of your retainer", applicationDetail: "Monthly brand updates, new asset creation, and design system expansion included in your retainer. Brand grows with your product." },
    "nearshore": { serviceName: "Brand-Aligned Nearshore Team", slug: "startup-branding", description: "Engineers who ship brand-consistent UI", applicationDetail: "Our nearshore engineers work from your design system and brand guidelines. Output matches your visual standards without timezone-gap quality drift." },
    "outsourcing": { serviceName: "Brand & Product Delivery", slug: "startup-branding", description: "Brand identity included in outsourced builds", applicationDetail: "Brand development included in our delivery scope. You receive both a working product and the visual identity system, not one without the other." },
  };

  if (perStartup[id]) return perStartup[id];

  // Category-level fallbacks
  const fallbackByCategory: Record<string, StartupServiceApplication> = {
    "By Stage": { serviceName: "Stage-Appropriate Brand Identity", slug: "startup-branding", description: "Brand that matches where you are now", applicationDetail: "Professional visual identity sized to your current stage. Not over-designed for where you are, not under-designed for where you are going." },
    "By Vertical": { serviceName: "Industry-Specific Brand Identity", slug: "startup-branding", description: "Visual identity built for your market", applicationDetail: "Logo, color system, typography, and brand guidelines designed for the specific trust signals and visual expectations of your industry." },
    "By Product Type": { serviceName: "Product Brand & Design System", slug: "startup-branding", description: "Visual foundation for your product", applicationDetail: "Brand identity that translates directly into your product UI. Design tokens, component styles, and guidelines your engineering team can implement." },
    "By Founder Type": { serviceName: "Founder-Ready Brand Identity", slug: "startup-branding", description: "Professional brand without the agency overhead", applicationDetail: "Logo, color palette, typography, and brand guidelines that make your startup look established. Fixed price, delivered in 2 weeks, yours forever." },
    "By Challenge": { serviceName: "Brand Identity & Refresh", slug: "startup-branding", description: "Visual identity that supports your goals", applicationDetail: "Brand system designed for the specific milestone or challenge you face. Whether launching, pivoting, or scaling, your brand should match." },
    "By Engagement": { serviceName: "Brand Identity (Bundled)", slug: "startup-branding", description: "Brand design included with your engagement", applicationDetail: "Add branding to any engagement: logo, design system, and brand guidelines delivered alongside your product build. One vendor, one timeline." },
  };
  return fallbackByCategory[category] || fallbackByCategory["By Vertical"];
}

function generateAdditionalServices(_id: string, category: string, existingSlugs: string[]): StartupServiceApplication[] {
  // Pool of additional service cards by category (branding excluded, it's always first)
  const additionalByCategory: Record<string, StartupServiceApplication[]> = {
    "By Vertical": [
      { serviceName: "Cloud Infrastructure Setup", slug: "cloud-engineering", description: "Production-grade hosting and scaling", applicationDetail: "AWS, GCP, or Azure architecture designed for your traffic patterns. Auto-scaling, multi-region deployment, and the infrastructure that grows with your user base." },
      { serviceName: "Automated Testing", slug: "automation-testing", description: "Quality assurance at speed", applicationDetail: "End-to-end test suites, integration testing, and CI pipelines that catch regressions before they reach production. Ship daily without manual QA bottlenecks." },
      { serviceName: "Security Posture Review", slug: "security-audit", description: "Proactive security assessment", applicationDetail: "Vulnerability scanning, dependency auditing, and penetration testing that identifies risks before attackers do. Compliance-ready documentation included." },
      { serviceName: "Dedicated Engineering Team", slug: "dedicated-teams", description: "Embedded engineers for ongoing work", applicationDetail: "2-8 senior engineers who know your codebase, attend your standups, and ship features continuously. No onboarding lag after the first week." },
    ],
    "By Product Type": [
      { serviceName: "Cloud Infrastructure", slug: "cloud-engineering", description: "Hosting and deployment architecture", applicationDetail: "Infrastructure designed for your product's specific requirements: compute-heavy workloads, data-intensive pipelines, or globally distributed users." },
      { serviceName: "Test Automation", slug: "automation-testing", description: "Regression prevention at scale", applicationDetail: "Automated test suites covering critical paths, integration points, and edge cases. Confidence to ship frequently without fear of breaking existing features." },
      { serviceName: "Dedicated Development Team", slug: "dedicated-teams", description: "Ongoing capacity for product iteration", applicationDetail: "Engineers dedicated to your product roadmap. They understand your architecture because they built it. Velocity increases month over month." },
      { serviceName: "Software Development Outsourcing", slug: "outsourcing", description: "Full delivery ownership", applicationDetail: "End-to-end project delivery with milestone accountability. We own architecture through deployment. You review working software, not status reports." },
    ],
    "By Stage": [
      { serviceName: "Cloud Strategy", slug: "cloud-consulting", description: "Infrastructure planning for your stage", applicationDetail: "Right-sized cloud architecture for your current scale with a clear path to grow. No over-engineering, no premature optimization, no surprise bills." },
      { serviceName: "Nearshore Engineers", slug: "nearshore", description: "Senior engineers in your timezone", applicationDetail: "Full-stack engineers within 2 hours of your timezone at 40-60% of local rates. Real-time collaboration without the communication overhead of offshore." },
      { serviceName: "Dedicated Team", slug: "dedicated-teams", description: "Consistent engineering capacity", applicationDetail: "Same engineers month to month who understand your product deeply. Velocity compounds because context never leaves the team." },
      { serviceName: "Security Audit", slug: "security-audit", description: "Security posture for your growth stage", applicationDetail: "Appropriate security measures for where you are now. Seed stage needs different controls than Series B. We right-size security to your risk profile." },
    ],
    "By Founder Type": [
      { serviceName: "Cloud Consulting", slug: "cloud-consulting", description: "Technical strategy and advisory", applicationDetail: "Architecture decisions, vendor selection, and technology roadmap guidance from engineers who have made these choices 50+ times before." },
      { serviceName: "Nearshore Partnership", slug: "nearshore", description: "Senior engineers at startup-friendly rates", applicationDetail: "Engineers in your timezone who communicate fluently, follow your process, and cost 40-60% less than equivalent local hires. Quality without the premium." },
      { serviceName: "Outsourced Delivery", slug: "outsourcing", description: "Full project ownership without daily management", applicationDetail: "We own delivery from requirements to deployment. You review milestones. No hiring, no management overhead, no gaps between roles." },
      { serviceName: "Software Audit", slug: "software-auditing", description: "Honest assessment of what you have", applicationDetail: "Complete codebase review with findings scored by severity. Know exactly what shape your technology is in before making investment decisions." },
    ],
    "By Challenge": [
      { serviceName: "Cloud Engineering", slug: "cloud-engineering", description: "Infrastructure that matches your challenge", applicationDetail: "Whether scaling, migrating, or rebuilding: cloud architecture designed for the specific technical challenge you face today." },
      { serviceName: "Dedicated Team", slug: "dedicated-teams", description: "Consistent capacity for sustained effort", applicationDetail: "Challenges that span months need consistent engineers. Our dedicated teams accumulate context that accelerates resolution week over week." },
      { serviceName: "Nearshore Engineers", slug: "nearshore", description: "Senior engineers at sustainable rates", applicationDetail: "Long-running challenges need affordable senior capacity. Nearshore engineers in your timezone at rates that fit startup budgets." },
      { serviceName: "Software Audit", slug: "software-auditing", description: "Understand the problem before solving it", applicationDetail: "Most challenges stem from decisions made months ago. We audit your codebase, identify root causes, and propose targeted fixes before writing new code." },
    ],
    "By Engagement": [
      { serviceName: "Cloud Engineering", slug: "cloud-engineering", description: "Infrastructure included in every engagement", applicationDetail: "Regardless of engagement type, your infrastructure is production-grade: CI/CD, monitoring, auto-scaling, and the operational foundation that keeps things running." },
      { serviceName: "Security & Compliance", slug: "security-audit", description: "Security built into our delivery process", applicationDetail: "Every engagement includes security best practices: dependency scanning, secret management, access controls, and vulnerability assessment as standard." },
      { serviceName: "Test Automation", slug: "automation-testing", description: "Quality assurance in every delivery", applicationDetail: "Automated tests on critical paths are standard in all our engagements. No manual QA bottleneck. Confidence to deploy on any day." },
      { serviceName: "Software Auditing", slug: "software-auditing", description: "Assessment before or after engagement", applicationDetail: "Start with an audit to scope correctly, or end with one to verify quality. Honest assessment that protects both sides." },
    ],
  };

  const pool = additionalByCategory[category] || additionalByCategory["By Vertical"];

  // Filter out any slugs already used in primary cards or branding
  const available = pool.filter(s => !existingSlugs.includes(s.slug));

  // Return first 3 additional cards
  return available.slice(0, 3);
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
    "ai-startup": [
      {
        title: "Beyond the API Call: Building AI That Works in Production",
        content: [
          "Wrapping an LLM API in a chat interface is a weekend project. Shipping an AI product that works reliably for 10,000 users requires retrieval infrastructure, quality monitoring, cost management, and the engineering discipline to measure everything.",
          "RAG pipeline quality depends on chunking strategy, embedding model choice, retrieval method (vector, keyword, or hybrid), and re-ranking. We tune each component to your specific content type and query patterns, then measure precision and recall continuously.",
          "Hallucination is not a bug you fix once. It is a surface area you manage. We build source grounding, confidence scoring, citation generation, and output validation layers that prevent your AI from confidently stating nonsense.",
          "Eval infrastructure is the difference between an AI demo and an AI product. We build golden datasets, automated quality scoring, regression detection, and the dashboards that tell you exactly when output quality changes.",
        ],
        imagePath: `/images/startups/deep-${id}-1.jpg`,
        imageAlt: "CiroStack building production AI infrastructure",
      },
      {
        title: "Scaling AI Without Scaling Costs",
        content: [
          "Inference costs are the gross margin killer for AI startups. At $0.03 per query, 1M monthly queries costs $30,000. We build model routing (use GPT-4 only when needed, route simple queries to cheaper models), response caching, and prompt compression that cut costs 50-70%.",
          "Latency optimization is UX optimization. Streaming token-by-token output, speculative pre-generation, and progressive rendering transform a 4-second wait into a perceived-instant response. Users stay engaged instead of bouncing.",
          "Fine-tuning smaller models on your specific domain data often outperforms prompting larger models at 10x lower cost and 5x lower latency. We help you decide when fine-tuning earns its training investment and when prompting is enough.",
          "AI products that scale need observability: token usage per feature, cost per user segment, latency percentiles, and quality scores by query type. We build the dashboards that let you make informed model and architecture decisions.",
        ],
        imagePath: `/images/startups/deep-${id}-2.jpg`,
        imageAlt: "AI cost optimization and scaling infrastructure",
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      {
        title: "How We Work When You Do Not Code",
        content: [
          "You do not need to understand technology to build a technology company. You need a partner who understands technology and explains decisions in terms that matter to you: cost, timeline, and risk.",
          "Every week, you receive a plain-English update: what was built, what it means for the product, what decisions are coming next, and what your options are. Technical jargon is translated into business impact.",
          "You have direct Slack access to the engineer building your product. No account manager buffer. When you have a question, the person who knows the answer responds. Usually within hours.",
          "At the end of the engagement, you own a product you can explain to investors, a codebase your future CTO can maintain, and enough technical literacy to evaluate candidates when you hire.",
        ],
        imagePath: `/images/startups/deep-non-technical-founder-1.jpg`,
        imageAlt: "CiroStack working with non-technical founders",
      },
      {
        title: "Protecting You from Decisions You Cannot Evaluate",
        content: [
          "The most expensive mistake non-technical founders make is choosing a technology because someone recommended it without understanding the tradeoffs. We make these decisions and own the consequences.",
          "We choose boring, proven technology: React, Node.js, PostgreSQL, AWS. Not because it is exciting, but because it is well-documented, widely understood, and easy for your future team to maintain.",
          "Fixed-price contracts protect you from the incentive problem: hourly billing means the longer the project takes, the more the agency makes. Our incentive is to finish on time because overruns cost us, not you.",
          "Before you hire your first engineer or CTO, we help you write the job description, evaluate candidates, and onboard them into a codebase with documentation, architecture guides, and clean code they can understand in a week.",
        ],
        imagePath: `/images/startups/deep-non-technical-founder-2.jpg`,
        imageAlt: "Technology decisions made and explained for non-technical founders",
      },
    ],
    "first-time-founder": [
      {
        title: "The Expensive Mistakes We Prevent",
        content: [
          "First-time founders build too much. The average first MVP we scope has 15-20 features proposed. We ship with 3-5. The ones that actually test the hypothesis. Everything else is a waste of money until users validate the core.",
          "Tech stack selection matters more than most founders realize. The wrong choice at month 1 costs $50-200K to fix at month 18. We choose based on your specific constraints, not what is trending on Hacker News.",
          "Building for yourself instead of your users is the second most expensive mistake. We insist on user testing before features are built. A $2,000 prototype test saves $30,000 in building the wrong thing.",
          "Perfectionism before launch destroys startups. Your product will never feel ready. We push you to ship when the learning threshold is met, not when every pixel is polished.",
        ],
        imagePath: `/images/startups/deep-first-time-founder-1.jpg`,
        imageAlt: "CiroStack guiding first-time founders",
      },
      {
        title: "From First Product to Fundable Company",
        content: [
          "Your MVP exists to learn, not to impress. We build the minimum that produces maximum signal: do users want this? Will they pay? Where do they get stuck? Data answers these questions. Features do not.",
          "We instrument everything from day one. User behavior tracking, funnel analytics, and the dashboards that show you what is working and what is not. Decisions driven by data, not founder intuition.",
          "When you are ready to raise, your product needs to survive technical due diligence. VCs hire CTOs to review codebases. Ours pass because they are built correctly from the start, not cleaned up before the pitch.",
          "The transition from external team to internal team is planned from month one. Documentation, architecture guides, and code quality that lets your first hire be productive in their first week, not their first quarter.",
        ],
        imagePath: `/images/startups/deep-first-time-founder-2.jpg`,
        imageAlt: "First-time founder path from MVP to fundable company",
      },
    ],
    "solo-founder": [
      {
        title: "Your Engineering Department, Without the Overhead",
        content: [
          "You cannot be CEO, sales, marketing, product, customer support, and engineering manager simultaneously. Something breaks. Usually engineering velocity, because code does not complain when you ignore it.",
          "We operate autonomously. Architecture decisions, technical planning, daily execution, and infrastructure management happen without your involvement. You set direction weekly. We execute daily.",
          "Communication is async-first: Loom video updates, Slack messages, documented decisions in Notion. No mandatory standups that fragment your calendar. Your attention stays on customers and growth.",
          "A solo founder's most precious resource is attention. Every hour you spend in engineering meetings is an hour not spent closing customers, building partnerships, or raising funding. We protect that resource.",
        ],
        imagePath: `/images/startups/deep-solo-founder-1.jpg`,
        imageAlt: "CiroStack operating as engineering department for solo founders",
      },
      {
        title: "Building Toward Your First Hire",
        content: [
          "At some point, you will want to hire full-time engineers. That transition should be smooth, not traumatic. We plan for it from day one.",
          "The codebase we deliver is documented, well-structured, and follows conventions that any mid-level engineer can understand. No black-box architecture that only we can maintain.",
          "When you are ready to hire, we help: writing the job description that attracts the right level, evaluating technical candidates, and onboarding your first engineer into a codebase they can own.",
          "The handoff period is gradual. Your new engineer works alongside us for 2-4 weeks. They learn the system with access to the people who built it. Then we step back. No cliff edge.",
        ],
        imagePath: `/images/startups/deep-solo-founder-2.jpg`,
        imageAlt: "Solo founder transitioning from external team to first hire",
      },
    ],
    "repeat-founder": [
      {
        title: "We Match the Standard You Already Know",
        content: [
          "You have worked with agencies before. You know what bad looks like: juniors pretending to be seniors, account managers who cannot answer technical questions, code that works in the demo but falls apart at scale.",
          "Our team is senior-only. The engineers you interview in week one are the engineers building in week eight. No rotation, no handoff to cheaper resources after the proposal is signed.",
          "You get direct access to the engineer writing your code. No account manager filter. When you have a question about architecture, the person who designed it responds. In real-time, not next-sprint.",
          "We push back. When your scope is too large, when a feature is premature, when an assumption needs validation first. You are paying for experienced judgment, not agreeable execution.",
        ],
        imagePath: `/images/startups/deep-repeat-founder-1.jpg`,
        imageAlt: "CiroStack engineering quality for repeat founders",
      },
      {
        title: "Velocity That Matches Your Pace",
        content: [
          "Repeat founders move fast because they have conviction. They have seen the market, validated the opportunity, and committed. They need a team that matches that pace without sacrificing quality.",
          "Daily commits. Weekly milestones. Working software every two weeks. No multi-week dark periods where you wonder what is happening. Progress is visible and continuous.",
          "Architecture designed for your next 18 months, not your next 18 years. We know the difference between necessary infrastructure and premature optimization. Nothing built until it is needed.",
          "When you are ready to hire, the codebase is clean enough to attract senior engineers who want to work in it. Bad code repels good candidates. We build the codebase that makes hiring easier.",
        ],
        imagePath: `/images/startups/deep-repeat-founder-2.jpg`,
        imageAlt: "Fast execution and shipping velocity for experienced founders",
      },
    ],
    "student-startup": [
      {
        title: "Demo Day in 10 Weeks: Here Is How We Get There",
        content: [
          "Your deadline is fixed. Demo day does not move. Budget is constrained. The scope must fit both. We work backward from your deadline and forward from your budget to define what gets built.",
          "We prioritize the features that make the demo compelling: the core user flow, the differentiating interaction, and enough polish that judges see a product, not a prototype.",
          "Student founders worry about looking amateur. Our design work produces interfaces that look like they have a full team behind them. First impressions matter when you have 5 minutes to impress.",
          "We deliver working software, not static mockups. Real user accounts, real data flow, real functionality. Judges and investors can click through it. That credibility is worth more than slides.",
        ],
        imagePath: `/images/startups/deep-student-startup-1.jpg`,
        imageAlt: "CiroStack delivering demo-day-ready products for student founders",
      },
      {
        title: "Understanding What You Built (And What Comes Next)",
        content: [
          "We explain every technical decision in terms you can relay to investors: why this database, why this framework, why this architecture. You leave the engagement technically literate about your own product.",
          "The code we produce is readable and documented. When you join an accelerator and they introduce you to a technical mentor, that mentor can understand the system in an afternoon.",
          "Post-demo-day, your product needs to serve real users. We build to production quality from the start so the demo is also the launch. No 'rebuild properly later' debt.",
          "Budget-appropriate infrastructure: Vercel or Railway free tiers, managed databases, and the configuration that costs $0-20/month until you have revenue or funding to justify more.",
        ],
        imagePath: `/images/startups/deep-student-startup-2.jpg`,
        imageAlt: "Student startup technical education and post-demo growth",
      },
    ],
    "corporate-innovator": [
      {
        title: "Startup Speed Within Enterprise Constraints",
        content: [
          "Corporate innovation fails when it tries to operate like a startup inside a corporation without addressing corporate realities: security reviews, procurement processes, legacy integration requirements, and stakeholder governance.",
          "We produce the documentation your InfoSec team requires before they ask for it: architecture diagrams, data flow maps, encryption specifications, access control matrices, and incident response plans.",
          "Procurement needs fixed-price SOWs with clear deliverables, timelines, and acceptance criteria. We write these in the format your legal team expects, with the insurance and liability coverage they require.",
          "Legacy integration is not a phase, it is a constraint. Your new product must connect to SAP, Salesforce, or the custom internal API built 15 years ago. We design for this integration from the architecture phase.",
        ],
        imagePath: `/images/startups/deep-corporate-innovator-1.jpg`,
        imageAlt: "CiroStack delivering innovation within enterprise governance",
      },
      {
        title: "Managing Stakeholders Without Slowing Delivery",
        content: [
          "Corporate projects have 5-10 stakeholders with different priorities. Marketing wants brand alignment. Legal wants risk mitigation. IT wants security. Sales wants features. We manage these inputs without letting them paralyze delivery.",
          "Steering committee updates are produced automatically from our sprint process: progress reports, risk registers, budget tracking, and the decision log that enterprise governance requires.",
          "Change management is built into the delivery process. When requirements shift after a stakeholder meeting (and they will), we provide change orders with clear impact analysis: what it costs, what it delays, what it enables.",
          "The goal is a product that passes all corporate gates (security, legal, brand, compliance) while still being good enough to compete with startups. We have done this before. We know which gates are negotiable and which are not.",
        ],
        imagePath: `/images/startups/deep-corporate-innovator-2.jpg`,
        imageAlt: "Corporate innovation stakeholder management and governance",
      },
    ],
    "female-led": [
      {
        title: "Equal Partnership, Not an Exception",
        content: [
          "Our pricing is published and consistent. The quote you receive is the same quote any founder receives for equivalent scope. We do not negotiate differently based on who is across the table.",
          "Our engineers are selected for technical excellence and communication quality. Treating founders as peers is not a policy we enforce; it is a hiring filter we apply. Engineers who talk down to clients do not work here.",
          "Your technical input is evaluated on its merit. If you have opinions about architecture, user experience, or technical direction, they are discussed as valid contributions, not dismissed as non-technical interference.",
          "We measure engagement quality monthly. If something in our communication or delivery is not meeting the standard we set, we want to know. Feedback is acted on immediately, not filed and forgotten.",
        ],
        imagePath: `/images/startups/deep-female-led-1.jpg`,
        imageAlt: "CiroStack equal partnership with female-led startups",
      },
      {
        title: "Building Without the Overhead of Proving Yourself",
        content: [
          "Female founders report spending 20-30% of engineering interactions proving credibility that male founders are given automatically. That overhead is eliminated here. Your expertise is assumed.",
          "Senior engineers are assigned to your project based on project complexity, not assumptions about the founder. Every project gets the team caliber that its technical requirements demand.",
          "Direct communication means decisions happen faster. No extra approval cycles, no second-guessing, no requiring additional justification for the same decisions male founders make unchallenged.",
          "The goal is a normal, productive, professional engineering engagement where your gender is irrelevant to how you are treated, what you are charged, or what caliber of work you receive.",
        ],
        imagePath: `/images/startups/deep-female-led-2.jpg`,
        imageAlt: "Professional engineering partnership on equal terms",
      },
    ],
    "african-startup": [
      {
        title: "Engineering for How African Markets Actually Work",
        content: [
          "Standard web architecture assumes broadband, modern devices, and Stripe. African markets have 2G connections, $50 Android phones, and M-Pesa. We build for the real conditions, not Silicon Valley assumptions.",
          "M-Pesa integration requires understanding STK push flows, callback handling, and the reconciliation patterns that differ from card payment APIs. Paystack and Flutterwave have their own integration patterns. We have built with all of them.",
          "USSD is not legacy technology in Africa. It is the primary digital interface for millions of users who do not have smartphones or data plans. We build USSD menu systems that deliver real utility in 5 navigation steps.",
          "Data costs money in African markets. Users on $2/month data budgets will not download a 20MB app or load a 5MB webpage. We optimize for these constraints: compressed assets, lazy loading, and offline-first architecture.",
        ],
        imagePath: `/images/startups/deep-african-startup-1.jpg`,
        imageAlt: "CiroStack building for African market infrastructure realities",
      },
      {
        title: "Pan-African Expansion Without Pan-African Rewrites",
        content: [
          "Each African country has different telecom APIs (Safaricom in Kenya, MTN in Nigeria, Vodacom in Tanzania), different payment providers, and different regulatory requirements. A product that works in Kenya does not automatically work in Nigeria.",
          "We architect for multi-country expansion from day one: payment provider abstraction, telecom integration layers, and configuration-based locale handling. Adding a new country means adding configuration, not rewriting code.",
          "Data localization requirements vary: some countries require user data stored in-country, others allow regional hosting. Our infrastructure supports both without duplicating the entire application stack.",
          "Multi-language support goes beyond translation. Right-to-left layouts for Arabic-speaking markets, locale-aware date and number formatting, and the cultural UX differences between East African and West African user expectations.",
        ],
        imagePath: `/images/startups/deep-african-startup-2.jpg`,
        imageAlt: "Pan-African multi-country architecture and expansion",
      },
    ],
    "diaspora-founder": [
      {
        title: "One Product, Two Markets, Zero Compromise",
        content: [
          "Diaspora founders understand both markets. Their products serve users in their home country and their current country simultaneously. This requires architecture that handles dual-market complexity without feeling complex to users.",
          "Multi-currency is not just exchange rate conversion. Pricing psychology differs ($9.99 does not work in markets with different digit patterns). We implement localized pricing that respects each market's purchasing behavior.",
          "Cross-border payment flows involve two sets of rails, two sets of fees, and two sets of regulatory requirements. We build payment architecture that handles remittance, marketplace payments, and subscriptions across jurisdictions.",
          "User experience must adapt culturally. Name fields (family name first vs. last), address formats, communication preferences (WhatsApp vs. email), and trust signals all differ between markets.",
        ],
        imagePath: `/images/startups/deep-diaspora-founder-1.jpg`,
        imageAlt: "CiroStack building multi-market products for diaspora founders",
      },
      {
        title: "Compliance in Two Jurisdictions Simultaneously",
        content: [
          "Your product must comply with regulations in both markets simultaneously. GDPR in Europe and local data protection in Africa. State licensing in the US and central bank requirements in your home market.",
          "Data residency requirements may conflict: one jurisdiction demands data stored locally, the other demands access to that same data for compliance reporting. We architect solutions that satisfy both without duplicating infrastructure.",
          "Financial regulations for cross-border products are complex. We build the transaction monitoring, reporting, and record-keeping that both jurisdictions require without making the user experience feel bureaucratic.",
          "KYC requirements differ between markets. We implement identity verification flows that satisfy both jurisdictions' requirements while maintaining a single user account that works across borders.",
        ],
        imagePath: `/images/startups/deep-diaspora-founder-2.jpg`,
        imageAlt: "Dual-jurisdiction compliance for cross-border products",
      },
    ],
    "social-enterprise": [
      {
        title: "Maximum Impact Per Technology Dollar",
        content: [
          "Social enterprises have a responsibility to funders, beneficiaries, and boards to spend technology budgets on outcomes, not overhead. Every feature we build must justify its cost in measurable social impact.",
          "We prioritize features by impact-per-dollar: which capabilities reach the most beneficiaries, improve the most outcomes, or save the most operational cost? Technology that does not move the mission forward does not get built.",
          "WCAG AA accessibility is non-negotiable from the first wireframe. Your beneficiaries include people with disabilities, older adults, and users on assistive technology. Accessibility is a design constraint, not a final polish step.",
          "Grant-compatible delivery means milestones aligned with funder reporting periods, documentation that satisfies audit requirements, and budget breakdowns that match the line items in your grant agreement.",
        ],
        imagePath: `/images/startups/deep-social-enterprise-1.jpg`,
        imageAlt: "CiroStack building impact-first technology for social enterprises",
      },
      {
        title: "Technology That Includes, Not Excludes",
        content: [
          "Your users may have limited connectivity, older devices, low digital literacy, or disabilities. Technology choices must respect these constraints or they exclude the very people you exist to serve.",
          "We build for the lowest common denominator of your user base: if 30% of your beneficiaries are on feature phones, the core experience must work on feature phones. Progressive enhancement adds richness for those with capable devices.",
          "Impact measurement infrastructure is built into the product from day one. Outcome tracking, beneficiary counts, and the metrics your funders care about are captured automatically, not manually compiled for reports.",
          "Infrastructure costs are optimized for nonprofit economics: AWS Activate credits, Google for Nonprofits discounts, and architecture that minimizes ongoing hosting costs while maintaining reliability for your beneficiaries.",
        ],
        imagePath: `/images/startups/deep-social-enterprise-2.jpg`,
        imageAlt: "Inclusive technology design for social enterprise beneficiaries",
      },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      {
        title: "From First Call to First Deploy in Days, Not Months",
        content: [
          "Most agencies spend 4-6 weeks on discovery, proposals, and alignment before writing code. By then, your competitor has shipped. We scope in a day, propose in 48 hours, and start building the day you approve.",
          "Ruthless scoping is the key to speed. We identify the 3-5 features that validate your core hypothesis and cut everything else. Not later. Not V2. Cut. What remains ships fast and teaches you what users actually want.",
          "Speed and quality are not in opposition. Clean architecture takes the same time as messy architecture when engineers are experienced. We build production-quality code at sprint speed because our team does not need to learn while building.",
          "Fixed-price, fixed-timeline means we hit the deadline because overruns cost us, not you. There is no incentive to pad estimates or drag projects out. We are motivated to finish on time.",
        ],
        imagePath: `/images/startups/deep-fast-mvp-1.jpg`,
        imageAlt: "CiroStack rapid MVP development process",
      },
      {
        title: "What You Ship Is What You Scale",
        content: [
          "Throwaway prototypes are the most expensive products you can build. You ship them, get users, then spend 3x rebuilding 'properly.' We skip that step by building correctly from the start.",
          "Production-quality MVPs have: automated tests on critical paths, CI/CD pipelines, error monitoring, and architecture that supports 10x growth without a rewrite. This adds 0 weeks to the timeline because experienced engineers work this way by default.",
          "Post-launch iteration is where MVPs succeed or fail. A well-architected codebase lets you ship improvements daily. A messy one means every change takes a week and might break something else.",
          "Your MVP is your product. The 'minimum' refers to features, not quality. Users do not forgive bugs because you call it an MVP. We ship fewer features at higher quality.",
        ],
        imagePath: `/images/startups/deep-fast-mvp-2.jpg`,
        imageAlt: "Production-quality MVP that scales without rewriting",
      },
    ],
    "scaling-tech": [
      {
        title: "Finding the Real Bottleneck (It Is Usually Not What You Think)",
        content: [
          "Teams assume they know what is slow. They are usually wrong. 'The database is slow' often means 'one query is slow and it runs 10,000 times per page load.' We measure before we fix.",
          "Full-stack profiling reveals the actual path from user action to response. Database query times, API processing, network latency, frontend rendering. The bottleneck hides in the gap between assumptions and measurements.",
          "The fix is usually simpler than expected: an index, a cache, a query rewrite, a connection pool. Not a new database. Not a rewrite. Not Kubernetes. Targeted interventions that take 1-2 weeks and improve performance 5-10x.",
          "We produce a prioritized list: these 5 things cause 80% of your performance problems. Fix them in this order. Each fix is independent. You can do them all or stop after the first 3 when performance is acceptable.",
        ],
        imagePath: `/images/startups/deep-scaling-tech-1.jpg`,
        imageAlt: "CiroStack performance profiling and bottleneck identification",
      },
      {
        title: "Making Deployments Boring Again",
        content: [
          "Fear of deploying is a symptom of missing infrastructure: no staging environment, no automated tests, no easy rollback. We fix the infrastructure so shipping changes is routine.",
          "CI/CD pipelines that run automated tests, deploy to staging, and promote to production with a button click. Feature flags that let incomplete features exist in production without being visible to users.",
          "Architecture evolution happens incrementally: the slow service gets replaced by a faster one, traffic shifts gradually, the old code gets deleted. No big-bang migration. No downtime. No coordination across 12 teams.",
          "Monitoring and alerting configured so you know about problems before users report them. Error budgets, latency percentiles, and the dashboards that on-call engineers actually look at.",
        ],
        imagePath: `/images/startups/deep-scaling-tech-2.jpg`,
        imageAlt: "Deployment infrastructure and architecture evolution",
      },
    ],
    "agency-rescue": [
      {
        title: "The Assessment: Truth Before Action",
        content: [
          "We read the entire codebase before saying anything. No prescriptions without diagnosis. No assumptions about what is wrong based on what you have told us. We look at the code and tell you what is actually there.",
          "The assessment produces a clear report: security vulnerabilities (fix immediately), architectural problems (fix soon), code quality issues (fix incrementally), and things that are actually fine (keep as-is).",
          "We estimate repair cost vs. rewrite cost honestly. Sometimes keeping 60% of the existing code and replacing 40% is cheaper than starting over. Sometimes the code is so tangled that a rewrite genuinely saves money. We tell you which.",
          "You receive a written document with our recommendation, cost estimate, and timeline. No sales pitch. No scare tactics. Just an honest assessment of your options with the tradeoffs of each clearly stated.",
        ],
        imagePath: `/images/startups/deep-agency-rescue-1.jpg`,
        imageAlt: "CiroStack codebase assessment and rescue planning",
      },
      {
        title: "Recovery Without Starting Over",
        content: [
          "Total rewrites are expensive and risky. They take 2-3x longer than estimated, and you ship nothing to users during the rebuild. We avoid them unless the math genuinely favors starting fresh.",
          "Stabilization comes first: security holes patched, crash-causing bugs fixed, data-loss risks eliminated. Your product stops embarrassing you in production before we start any new development.",
          "Recovery development builds forward from what exists: new modules replace broken ones, tests get added around fragile code, documentation gets written as we understand the system. Incremental improvement.",
          "We do not charge you to undo what someone else did. We charge you to move forward. The assessment is honest about what happened, but the work is focused on where you are going.",
        ],
        imagePath: `/images/startups/deep-agency-rescue-2.jpg`,
        imageAlt: "Pragmatic project recovery without full rewrite",
      },
    ],
    "fundraising-ready": [
      {
        title: "What Technical Due Diligence Actually Looks For",
        content: [
          "VCs hire experienced CTOs to review your codebase. They look for: security vulnerabilities, architecture sustainability, test coverage, deployment practices, and whether the code matches the growth story in your pitch.",
          "Security findings kill rounds. An unpatched dependency with a known CVE, unencrypted user data, or exposed API keys found during due diligence signals negligence. We scan, patch, and harden before reviewers arrive.",
          "Architecture documentation shows you think about scale. A system diagram, data flow map, and technology rationale demonstrate that your technical decisions are deliberate, not accidental.",
          "Load testing proves your growth narrative is achievable. If you tell investors you can handle 100K users, a load test report proving your architecture handles 100K users makes that claim credible.",
        ],
        imagePath: `/images/startups/deep-fundraising-ready-1.jpg`,
        imageAlt: "CiroStack preparing startups for technical due diligence",
      },
      {
        title: "The Technical Roadmap That Closes Rounds",
        content: [
          "Investors want to know: what gets built next, how long it takes, what it costs, and what team you need. A credible technical roadmap answers all four questions with specifics.",
          "We produce a 12-18 month engineering plan aligned with your fundraising narrative: which features unlock which revenue milestones, which infrastructure investments support which growth targets.",
          "The roadmap includes hiring plan: when you need your first engineer, when you need a second, and when you need a CTO. Investors see that you have planned the team scaling, not just the product scaling.",
          "Technical roadmaps that work are specific: 'Q3: Add enterprise SSO (4 weeks, 1 senior engineer, unlocks $50K+ ACV deals)' not 'Q3: Improve platform.' Investors fund specifics.",
        ],
        imagePath: `/images/startups/deep-fundraising-ready-2.jpg`,
        imageAlt: "Technical roadmap and fundraising preparation",
      },
    ],
    "ai-integration": [
      {
        title: "Defining the AI Feature Before Building It",
        content: [
          "Most AI integration projects fail because nobody defined: what specific user interaction benefits from AI, what 'good output' means for that interaction, and how quality will be measured in production.",
          "We start with the user problem, not the technology. Which user action takes too long, produces inconsistent results, or requires expertise the user does not have? That is where AI adds value.",
          "Quality criteria must be defined before code is written. If the AI is summarizing documents, what makes a summary good? Length? Accuracy? Coverage? These definitions drive every architectural decision.",
          "Failure modes must be designed explicitly. What happens when the AI is wrong? What happens when it is slow? What happens when it does not know? These UX decisions matter as much as the AI pipeline.",
        ],
        imagePath: `/images/startups/deep-ai-integration-1.jpg`,
        imageAlt: "CiroStack defining AI feature requirements before building",
      },
      {
        title: "From Working Demo to Reliable Production",
        content: [
          "Every AI demo works. Production is different: real users ask unexpected questions, provide malformed input, and use the feature in ways your eval dataset never anticipated.",
          "RAG pipeline quality depends on decisions most teams make casually: chunk size, overlap, embedding model, retrieval count, re-ranking strategy. We test each systematically against your actual content and query patterns.",
          "Eval infrastructure is the difference between AI that improves over time and AI that silently degrades. We build automated quality scoring that runs on every deployment and alerts when metrics drop.",
          "Cost management matters: a naive RAG implementation can cost $0.50-$2.00 per query at scale. Semantic caching, efficient retrieval, and smart model routing reduce this 60-80% without quality loss.",
        ],
        imagePath: `/images/startups/deep-ai-integration-2.jpg`,
        imageAlt: "AI feature production reliability and cost management",
      },
    ],
    "tech-debt": [
      {
        title: "Not All Debt Is Equal: Finding What Hurts Most",
        content: [
          "Technical debt is a metaphor that hides a spectrum. Some debt is annoying but harmless. Some debt costs you 30% of engineering velocity. We find the debt that actually hurts and prioritize it.",
          "The audit produces a scored inventory: each piece of debt rated by its impact on developer velocity and production reliability. High-impact debt gets fixed first. Low-impact debt might stay forever.",
          "Common high-impact debt patterns: untested code that breaks on every change, tightly coupled modules that make independent work impossible, missing abstractions that force copy-paste across the codebase.",
          "We do not inventory every imperfect line of code. We find the 5-10 problems that, once fixed, will make your team 2-3x more productive. Focused intervention, not perfectionism.",
        ],
        imagePath: `/images/startups/deep-tech-debt-1.jpg`,
        imageAlt: "CiroStack technical debt assessment and prioritization",
      },
      {
        title: "Paying Down Debt Without Stopping the Business",
        content: [
          "Feature freezes for debt reduction kill morale, frustrate stakeholders, and rarely finish on time. We work alongside your team: they ship features, we reduce debt. Both happen simultaneously.",
          "Strangler fig approach: new, clean modules replace old problematic ones piece by piece. The system gets better incrementally. No big-bang cut-over. No risky migration weekend.",
          "Automated tests grow with each sprint. Every debt item fixed gets wrapped with tests that prevent re-accumulation. Coverage rises naturally as the riskiest code gets the most attention.",
          "Velocity improvement is measurable within 6-8 weeks: sprint commitments get met, estimates become accurate, on-call pages decrease, and new engineers get productive faster.",
        ],
        imagePath: `/images/startups/deep-tech-debt-2.jpg`,
        imageAlt: "Incremental tech debt reduction alongside feature development",
      },
    ],
    "security-compliance": [
      {
        title: "Security Controls That Generate Their Own Evidence",
        content: [
          "The most expensive part of compliance is not implementing controls. It is proving they work, continuously, for every audit cycle. We build controls that produce their own evidence automatically.",
          "Encryption at rest verified by automated scans. Access logs generated by infrastructure configuration. Backup integrity checked by scheduled jobs. Vulnerability scans run weekly and file results automatically.",
          "When your auditor asks for evidence, your system produces it in minutes, not weeks. No engineering scramble before audit. No manually compiling screenshots. Compliance evidence is a system output.",
          "SOC 2 Type II requires 6+ months of continuous evidence. Starting today means your first audit is 6 months away regardless of how fast you implement controls. Every week delayed adds a week to the timeline.",
        ],
        imagePath: `/images/startups/deep-security-compliance-1.jpg`,
        imageAlt: "CiroStack automated security controls and evidence generation",
      },
      {
        title: "From Gap Assessment to Audit Pass",
        content: [
          "We map your current security posture against your target framework: SOC 2, HIPAA, PCI-DSS, or GDPR. Every gap identified, effort estimated, and prioritized by audit impact.",
          "Critical gaps (encryption missing, access controls absent) are fixed immediately. Medium gaps (monitoring incomplete, documentation missing) are scheduled. Low gaps (policy refinements) happen last.",
          "Penetration testing validates that controls work as designed. We run pen tests before your auditor does, fix what we find, and provide the clean report that demonstrates security maturity.",
          "Audit preparation means: documentation organized, questionnaire responses drafted, evidence packages compiled, and the engineering team briefed on what auditors will ask. The audit day itself is calm.",
        ],
        imagePath: `/images/startups/deep-security-compliance-2.jpg`,
        imageAlt: "Security compliance gap assessment to audit pass",
      },
    ],
    "post-pivot": [
      {
        title: "Triaging What Survives the Pivot",
        content: [
          "After a pivot, your codebase is a mix of still-relevant and no-longer-relevant code. The expensive mistake is treating it all as dead. The other expensive mistake is treating it all as alive.",
          "We read everything in 1-2 weeks. Then we categorize: modules that directly serve the new direction (keep), modules that need modification to serve it (adapt), and modules that are dead weight (remove).",
          "Data models often survive pivots even when features do not. User accounts, authentication, payment infrastructure, and admin tooling frequently apply regardless of which product direction you take.",
          "The assessment produces a concrete plan: what we keep (free), what we modify (costs X), what we replace with new code (costs Y). Total cost of the pivot rebuild, not a vague estimate.",
        ],
        imagePath: `/images/startups/deep-post-pivot-1.jpg`,
        imageAlt: "CiroStack post-pivot codebase triage and assessment",
      },
      {
        title: "Shipping the New Direction Fast",
        content: [
          "Post-pivot, speed matters more than perfection. Investors are watching. The team needs a win. Users need to see the new direction. We ship the pivoted product in 6-8 weeks, not 6 months.",
          "Reusing existing infrastructure (auth, payments, deployment) saves 2-4 weeks. New features for the pivoted direction build on top of proven foundations. Maximum reuse, minimum waste.",
          "The pivoted product is still an MVP. Scope is still ruthless. The 3-5 features that validate the new hypothesis ship first. Everything else waits until users confirm the direction is correct.",
          "Team energy is a factor. Visible progress in week one, working software in week three, and user feedback by week six restores the momentum that pivots temporarily kill.",
        ],
        imagePath: `/images/startups/deep-post-pivot-2.jpg`,
        imageAlt: "Rapid execution after startup pivot",
      },
    ],
    "no-tech-team": [
      {
        title: "Your Engineering Department Until You Build One",
        content: [
          "Hiring a CTO takes 6 months. Hiring a senior engineer takes 3-4 months. You do not have that time. Your product needs to exist before your next fundraise, customer deadline, or market window.",
          "We provide complete engineering coverage from day one: frontend development, backend architecture, database design, infrastructure setup, testing, and deployment. No gaps, no missing skills.",
          "Autonomous operation means you do not manage engineers. You set product direction weekly. We make technical decisions, execute daily, and report progress asynchronously. Your time stays on the business.",
          "This is a bridge, not a permanent solution. We are explicitly designed to be replaced by your internal team when the time is right. Everything we build is documented for that handoff.",
        ],
        imagePath: `/images/startups/deep-no-tech-team-1.jpg`,
        imageAlt: "CiroStack as complete engineering department",
      },
      {
        title: "The Transition to Your Own Team",
        content: [
          "The goal is not permanent dependency. It is shipping a product now and building a team later when you have revenue, funding, or proven product-market fit to attract talent.",
          "When you are ready to hire, we help: writing job descriptions that attract the right level, conducting technical interviews, and evaluating candidates against the codebase they will inherit.",
          "Your first hire overlaps with us for 2-4 weeks. They learn the system with access to the people who built it. Architecture walk-throughs, deployment training, and documented operational procedures.",
          "The codebase is explicitly designed for handoff: clean structure, consistent patterns, full documentation, and architecture decisions explained. Your new engineer is productive in their first week.",
        ],
        imagePath: `/images/startups/deep-no-tech-team-2.jpg`,
        imageAlt: "Transition from external team to first engineering hire",
      },
    ],
    "africa-launch": [
      {
        title: "Your Product Was Not Built for This Market",
        content: [
          "Products built for US/European users assume broadband, modern devices, credit cards, and reliable power. African markets break every one of these assumptions. Adaptation is not cosmetic. It is architectural.",
          "Payment infrastructure differs fundamentally: M-Pesa uses STK push (phone prompts), not card forms. Paystack handles bank transfers differently than Stripe handles ACH. The failure modes and reconciliation patterns are unique.",
          "2G connectivity means your 3MB JavaScript bundle does not load. Your high-resolution images timeout. Your real-time features disconnect constantly. Performance optimization is not nice-to-have, it is launch-blocking.",
          "Feature phones are still the primary device for millions of potential users. If your product cannot deliver value via USSD (menu-based text interface) or SMS, you are missing your largest addressable segment.",
        ],
        imagePath: `/images/startups/deep-africa-launch-1.jpg`,
        imageAlt: "CiroStack adapting products for African market realities",
      },
      {
        title: "Launch Strategy That Respects the Market",
        content: [
          "Market entry starts with one country, not the continent. Kenya, Nigeria, and South Africa have different infrastructure, different payment providers, and different regulations. Pick one, succeed there, then expand.",
          "Data localization requirements vary: Nigeria's NDPR, Kenya's DPA, and South Africa's POPIA each have different storage and processing requirements. Architecture must support in-country data residency where mandated.",
          "User research in African markets cannot be done remotely from a Western office. Local testing with actual users on actual devices and actual connectivity reveals problems that remote analysis misses.",
          "Pricing for African markets requires different economics: lower ARPU, higher volume, mobile money transaction costs, and the infrastructure that scales without Western-tier cloud bills making the unit economics impossible.",
        ],
        imagePath: `/images/startups/deep-africa-launch-2.jpg`,
        imageAlt: "African market launch strategy and localization",
      },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { title: "How Fixed-Price Actually Works", content: ["We scope your project in detail: every feature, every screen, every integration. This scope document becomes the contract. The price is quoted against this specific scope and does not change.", "If you want to add features mid-build, we provide a change order: what it adds, what it costs, what it delays. No surprises. No hidden charges. Additions are your choice, not our upsell.", "Milestone payments mean you pay as working software delivers. Not upfront. Not on a schedule. When you can see and test the feature, then you pay for it. Progress is tangible before money moves.", "If we underestimated complexity, the extra engineering time is our cost. That is what fixed price means. The risk of estimation error sits with the team that made the estimate."], imagePath: `/images/startups/deep-fixed-price-mvp-1.jpg`, imageAlt: "CiroStack fixed-price delivery model" },
      { title: "Why Fixed Price Produces Better Software", content: ["Hourly billing incentivizes complexity. More features, more debate, more revisions. Fixed price incentivizes efficiency. We want to finish on time because overruns cost us, not you.", "Scope discipline produces better products. When features must justify their inclusion against a fixed budget, only the features that matter survive. This constraint improves the product.", "Senior engineers estimate accurately. Our fixed-price model works because our team has built 50+ products. They know how long things take. Junior engineers guess. Seniors predict.", "Post-delivery iteration is where fixed-price products win. A clean, well-scoped MVP ships faster, costs less, and provides the data you need to decide what to build next."], imagePath: `/images/startups/deep-fixed-price-mvp-2.jpg`, imageAlt: "Fixed-price incentive alignment" },
    ],
    "dedicated-team": [
      { title: "The Difference Between a Vendor and a Team", content: ["Vendors deliver code and disappear. Teams live in your codebase, understand your users, attend your planning sessions, and make decisions like owners. We build teams, not vendor relationships.", "Context takes months to build: understanding your data model, your user personas, your technical debt, your team dynamics. Engineers who have been in your code for 6 months make better decisions than new hires on day one.", "Dedicated teams operate at your cadence: your sprint length, your release schedule, your communication style. No process mismatch. No translation layer between how you work and how they work.", "The best dedicated teams feel indistinguishable from internal teams. Same tools, same ceremonies, same accountability. The only difference is the contract structure and the ability to scale elastically."], imagePath: `/images/startups/deep-dedicated-team-1.jpg`, imageAlt: "CiroStack dedicated team integration" },
      { title: "Scaling Without the Pain of Hiring", content: ["Adding 2 engineers for a 3-month push: if they are full-time hires, that is 6 months of recruiting, 3 months of onboarding, then the push, then what? Severance? Our model: add engineers in 1-2 weeks, remove when done.", "Team continuity matters. Your dedicated team stays consistent month to month. The same engineers who built the feature maintain it. Knowledge stays on the team, not in documentation that nobody reads.", "Engineering management is included. Sprint planning, backlog grooming, code review, and technical direction happen within the team. You provide product direction. We handle engineering execution.", "When you are ready to hire full-time, your dedicated team helps: they know what skills are missing, what seniority level is needed, and they can onboard new hires into the codebase they know best."], imagePath: `/images/startups/deep-dedicated-team-2.jpg`, imageAlt: "Elastic team scaling without hiring overhead" },
    ],
    "tech-cofounder": [
      { title: "CTO Responsibilities Without CTO Equity", content: ["A technical co-founder typically takes 20-40% equity. That is $2-20M in dilution at Series A valuations. Our model delivers the same responsibilities on a monthly contract. The math is clear.", "Architecture ownership means one person decides what the system looks like and makes every daily decision consistent with that vision. Without this, architecture evolves randomly as individual engineers make local choices.", "Investor confidence requires a named technical leader. Someone who presents the technical roadmap, answers board questions, and represents engineering credibility. Not an anonymous agency. A person with accountability.", "Team building requires CTO-level judgment: which roles to hire first, what seniority level, how to evaluate candidates, and how to structure the team. Individual engineers cannot make these organizational decisions."], imagePath: `/images/startups/deep-tech-cofounder-1.jpg`, imageAlt: "CiroStack tech co-founder engagement model" },
      { title: "From First Hire to Engineering Organization", content: ["Your first engineering hire is the highest-leverage decision you will make. The wrong hire at this stage sets culture, standards, and velocity for the next 2 years. CTO-level judgment guides this decision.", "Interview design matters: what questions reveal senior capability vs. junior confidence? What technical exercises predict on-the-job performance? We design interview processes that identify the right candidates.", "Onboarding your first engineer into the codebase we built is seamless: they overlap with us for 2-4 weeks, learn the system with the people who designed it, and take ownership gradually.", "As the team grows from 1 to 5 to 15, organizational structure evolves. Team topology, reporting lines, and engineering process that works at 3 engineers breaks at 10. We plan for each transition."], imagePath: `/images/startups/deep-tech-cofounder-2.jpg`, imageAlt: "Building engineering team with CTO-level guidance" },
    ],
    "cto-as-a-service": [
      { title: "The Strategy Gap Your Engineers Cannot Fill", content: ["Individual contributors solve problems they are given. CTOs decide which problems to solve, in what order, and with what approach. Without this layer, teams build efficiently in the wrong direction.", "Architecture debates can paralyze engineering teams for weeks. A fractional CTO resolves them in hours: makes the decision, explains the rationale, and the team moves forward.", "Build-vs-buy decisions require experience with both options. Your engineers prefer to build (it is more interesting). A CTO knows when buying saves 6 months and when building is the right investment.", "Technology strategy is not the same as technology execution. Your team executes well. They need someone deciding what to execute, when to migrate, when to scale, and when to stop investing in something."], imagePath: `/images/startups/deep-cto-as-a-service-1.jpg`, imageAlt: "CiroStack fractional CTO strategic guidance" },
      { title: "Board Rooms and Hiring Decisions", content: ["Board members ask questions engineers cannot answer: What is our technical risk? Can we hit $10M ARR on this architecture? When do we need to hire a VP Engineering? A fractional CTO provides these answers.", "Quarterly board updates require translating engineering work into business outcomes. Not 'we refactored the auth module' but 'we reduced enterprise onboarding time from 2 weeks to 2 days, unlocking $500K ACV deals.'", "Hiring strategy at the fractional level: when to hire senior vs. mid-level, when to add a team lead, when to split into squads, and how to evaluate candidates for roles you have not filled before.", "Vendor evaluation (cloud providers, tools, SaaS platforms) requires understanding trade-offs that marketing materials hide. A fractional CTO has evaluated hundreds of tools and knows what questions to ask."], imagePath: `/images/startups/deep-cto-as-a-service-2.jpg`, imageAlt: "Fractional CTO board communication and hiring" },
    ],
    "design-sprint": [
      { title: "Five Days That Save Five Months", content: ["Monday: define the problem. Map user journeys, identify the riskiest assumption, and agree on the specific question the sprint will answer. Alignment happens through structured exercises, not debates.", "Tuesday-Wednesday: sketch solutions individually, then converge on the strongest concept. The team votes with dots, not arguments. The best ideas win regardless of who proposed them.", "Thursday: build a clickable prototype. Not code. Not a full design. A high-fidelity prototype realistic enough that users react authentically. One day. One focused designer. One tangible artifact.", "Friday: test with 5 real users recruited from your target audience. Watch them interact. Listen to their confusion. Hear what they expected. Five interviews reveal 85% of usability issues."], imagePath: `/images/startups/deep-design-sprint-1.jpg`, imageAlt: "CiroStack 5-day design sprint process" },
      { title: "The Output That Drives What Happens Next", content: ["A validated hypothesis means you build with confidence. The prototype worked. Users understood it. Now you know what to build, how it should work, and what users expect. Development spec writes itself.", "A killed hypothesis saves $50-150K. The idea did not work in testing. Users were confused, uninterested, or could not find value. You learned this in 5 days for $15-25K instead of 4 months for $150K.", "Stakeholder alignment is a sprint byproduct. People who disagreed in meetings agree after watching users interact with the prototype. The data resolves debates that opinions could not.", "The sprint prototype often becomes the design specification. Your development team receives a clickable prototype showing exactly how every interaction should work. No ambiguous requirements document needed."], imagePath: `/images/startups/deep-design-sprint-2.jpg`, imageAlt: "Design sprint output and validation results" },
    ],
    "code-audit": [
      { title: "What We Actually Review", content: ["Architecture sustainability: can this system handle 10x your current load? Can a new engineer understand it in a week? Where are the coupling problems that will slow your team?", "Security posture: unpatched dependencies, exposed credentials, unencrypted sensitive data, authentication weaknesses, and the vulnerabilities that matter most for your specific risk profile.", "Code quality: test coverage, error handling, logging, and the patterns that indicate whether this code was written with care or haste. Not style preferences. Functional quality.", "Operational readiness: deployment process, monitoring, backup strategy, and incident response capability. Can this team ship safely? Can they recover when things break?"], imagePath: `/images/startups/deep-code-audit-1.jpg`, imageAlt: "CiroStack code and architecture audit process" },
      { title: "Findings You Can Act On", content: ["Every finding is scored: critical (fix this week), high (fix this month), medium (fix this quarter), low (fix eventually or never). You know exactly where to focus limited engineering time.", "Each finding includes: what is wrong, why it matters, how to fix it, how long the fix takes, and what happens if you do not fix it. Complete information for every decision.", "The audit report is typically 5-10 pages, not 50. We focus on the findings that matter, not exhaustive cataloging of every imperfect line. You read it in 30 minutes and know what to do.", "We have no incentive to find problems that do not exist. The audit is the deliverable. We are not selling follow-on remediation work. Honesty is the entire product."], imagePath: `/images/startups/deep-code-audit-2.jpg`, imageAlt: "Actionable audit findings and remediation planning" },
    ],
    "staff-augmentation": [
      { title: "Engineers Who Contribute from Day One", content: ["Our engineers are senior: 7+ years shipping production software. They read your codebase, understand your patterns, and submit meaningful PRs within their first week. No 3-month ramp-up.", "They join your process fully: your standup, your Slack channels, your PR review flow, your deployment process. From the outside, they are indistinguishable from full-time team members.", "Skill matching is precise. You need a specific skill (DevOps, React, Python, mobile). We place an engineer with exactly that expertise, not a generalist who will figure it out on your timeline.", "Communication is native. Fluent English, Western development culture, real-time timezone availability. No translation overhead. No async-only days. Direct collaboration."], imagePath: `/images/startups/deep-staff-augmentation-1.jpg`, imageAlt: "CiroStack staff augmentation integration" },
      { title: "Flexible Capacity for Real Engineering Needs", content: ["Parental leave coverage: your backend engineer is out for 4 months. Work still needs to happen. We place a replacement who maintains velocity without disrupting team dynamics.", "Skill gaps: your team is strong on frontend but needs a DevOps specialist for a 3-month infrastructure migration. Full-time hire makes no sense. Augmentation fills the gap precisely.", "Sprint push: you need extra capacity for a 6-week feature push before a deadline. Scale up for the push, scale back after. No hiring process, no severance, no commitment beyond the need.", "The exit is clean: when the augmentation need ends, the engineer wraps up, documents any tribal knowledge, and steps back. No organizational disruption. No awkward conversations."], imagePath: `/images/startups/deep-staff-augmentation-2.jpg`, imageAlt: "Flexible engineering capacity for temporary needs" },
    ],
    "retainer": [
      { title: "Predictable Engineering Without Predictable Scope", content: ["Product development is inherently variable. Some months need major features. Some need bug fixes. Some need performance work. A retainer gives you capacity without requiring you to predict what you will need.", "The same engineers work on your product every month. They know your codebase, your users, your tech debt. No re-onboarding between projects. No lost context. Decisions compound as familiarity deepens.", "One monthly invoice at a consistent amount. Budget it quarterly without guessing. Finance loves predictability. Your retainer is a known cost you can plan around.", "Emergency response is included. Production goes down at 2am? Your retainer team responds within SLA. No negotiating a new contract during an incident. Capacity is already reserved."], imagePath: `/images/startups/deep-retainer-1.jpg`, imageAlt: "CiroStack retainer engagement model" },
      { title: "The Retainer That Grows With You", content: ["Start small: 40 hours/month for ongoing maintenance and small features. Scale up: 80 hours/month when a major feature initiative begins. Scale back when the push is complete. Flex within predictable bounds.", "Retainer teams evolve with your product. The engineers who built your core features maintain them, add to them, and know where the bodies are buried. That institutional knowledge has compounding value.", "Quarterly planning sessions align your product roadmap with retainer capacity. We help you decide what fits, what needs to be scoped separately, and what can wait. No surprises at month-end.", "When you eventually hire full-time, your retainer team helps transition. They have been in your code for months or years. They are the best possible onboarding resource for your new hires."], imagePath: `/images/startups/deep-retainer-2.jpg`, imageAlt: "Retainer scaling and long-term partnership" },
    ],
    "nearshore": [
      { title: "The Cost Advantage Without the Communication Tax", content: ["Offshore teams save 60-70% on paper. But async communication, timezone gaps, and cultural misalignment reduce effective velocity 30-40%. Net savings: 20-30% with significant management overhead.", "Nearshore eliminates the communication tax. Within 2 hours of your timezone means: real-time Slack responses, pair programming when needed, and standup attendance at normal hours. Zero async-only days.", "Cost savings of 40-60% are real because they come from cost-of-living economics in nearby markets, not from lower skill levels. Our nearshore engineers have the same experience and standards as local hires.", "The quality test: can you tell which engineers are nearshore and which are local from the code alone? If the answer is no (and it should be), you are getting the same output at lower cost."], imagePath: `/images/startups/deep-nearshore-1.jpg`, imageAlt: "CiroStack nearshore advantage vs offshore" },
      { title: "Integration That Feels Local", content: ["Process alignment is immediate. Our nearshore engineers work in agile sprints, practice code review, maintain CI/CD discipline, and follow testing conventions that match Western engineering culture.", "English fluency at C1+ level means technical discussions happen naturally. Complex architecture decisions, nuanced code review comments, and stakeholder communication all flow without translation overhead.", "Pair programming works. With timezone overlap, your local engineers and nearshore engineers can share screens, debug together, and transfer knowledge in real-time. This is impossible with 8-hour gaps.", "Cultural alignment extends beyond language: communication directness, meeting participation, proactive problem-flagging, and the engineering ownership mentality that Western teams expect."], imagePath: `/images/startups/deep-nearshore-2.jpg`, imageAlt: "Nearshore team integration and communication" },
    ],
    "outsourcing": [
      { title: "Full Delivery Without Full Attention", content: ["You have a defined project. Clear requirements. No internal bandwidth. You do not want to manage a team. You want to hand over requirements and receive working software.", "We own the entire delivery chain: architecture decisions, technology selection, development, testing, deployment, and documentation. One contract. One point of contact. One accountability.", "Milestone-based payment means you pay for results, not effort. Each milestone has acceptance criteria defined upfront. Working software that meets criteria triggers payment. Not hours. Output.", "The handoff is complete by design. We are not building dependency. We are building a product you own and can maintain independently. Documentation, training, and knowledge transfer are deliverables, not extras."], imagePath: `/images/startups/deep-outsourcing-1.jpg`, imageAlt: "CiroStack full-delivery outsourcing model" },
      { title: "Quality That Survives the Handoff", content: ["The most common outsourcing failure: code arrives, the team cannot maintain it, and you call the vendor back (at premium rates). We prevent this by building for handoff from day one.", "Automated test suites mean your team can make changes confidently. Tests catch regressions. Documentation explains architecture. Deployment pipelines ship changes safely. Independence is built in.", "Architecture documentation is not a final-sprint afterthought. It is produced throughout development: decision logs, system diagrams, and the 'why' behind every significant choice.", "Optional training sessions at project completion: we walk your team through the system, answer questions, and ensure they can operate, maintain, and extend the software without us."], imagePath: `/images/startups/deep-outsourcing-2.jpg`, imageAlt: "Outsourcing quality and handoff documentation" },
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
    "ai-startup": [
      "Engineers experienced with RAG pipelines, LLM orchestration, and eval systems",
      "Retrieval quality baseline measured before architecture decisions",
      "Cost modeling at projected query volume before model selection",
      "Eval pipeline with golden datasets established before production launch",
      "Latency budget defined per feature with streaming architecture planned",
      "Hallucination mitigation strategy documented with measurable thresholds",
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      "Weekly plain-English progress updates with business impact explained",
      "Direct Slack access to the engineer building your product",
      "Fixed-price contract with scope defined before work begins",
      "All technical decisions made and explained, not delegated to you",
      "Investor-ready code quality from day one",
      "Future hiring support: job descriptions, candidate evaluation, onboarding",
    ],
    "first-time-founder": [
      "Scope reduction workshop in week one (target: 60-70% feature cut)",
      "Pattern-recognition advisory from 50+ prior product builds",
      "User testing before features are built (prototype validation)",
      "Analytics instrumentation from first deployable build",
      "Honest pushback on scope, timeline, and assumption risks",
      "Technical due diligence readiness from architecture choices forward",
    ],
    "solo-founder": [
      "Fully autonomous operation with weekly direction approval only",
      "Async-first communication (Loom, Slack, Notion documentation)",
      "Complete engineering coverage: frontend, backend, DevOps, QA",
      "No daily meetings or management overhead required",
      "Architecture decisions made independently with rationale documented",
      "Hiring bridge: job descriptions, interviews, onboarding when ready",
    ],
    "repeat-founder": [
      "Senior engineers only, verified before project starts",
      "Direct engineer communication with no account manager layer",
      "Daily commits with continuous visibility into progress",
      "Code quality that passes your personal review standards",
      "Honest pushback on scope and assumptions as standard practice",
      "Architecture designed for 18-month growth, not 18-year speculation",
    ],
    "student-startup": [
      "Scope defined by working backward from demo day deadline",
      "Fixed price within accelerator/student budget ($5K-$15K typical)",
      "Every technical decision explained for your learning",
      "Working product (not mockup) delivered before deadline",
      "Budget-optimized hosting ($0-20/month until revenue)",
      "Post-demo-day code ready for production users without rebuild",
    ],
    "corporate-innovator": [
      "Fixed-price SOW formatted for enterprise procurement",
      "Security documentation produced before InfoSec review",
      "Legacy system integration assessed and planned in week one",
      "Steering committee materials produced from sprint process",
      "Change management process for scope evolution",
      "Enterprise compliance (insurance, NDA, data handling) handled upfront",
    ],
    "female-led": [
      "Published rate card applied identically to all clients",
      "Senior engineers assigned based on project complexity only",
      "Direct communication without intermediary interpretation",
      "Monthly engagement quality survey with action on feedback",
      "Transparent scope and pricing with no assumption-based markup",
      "Escalation path available if communication standards slip",
    ],
    "african-startup": [
      "Mobile money integration expertise (M-Pesa, Paystack, Flutterwave)",
      "Offline-first architecture designed before development begins",
      "USSD/SMS interface testing on actual feature phone hardware",
      "Low-bandwidth optimization (2G-compatible page weights)",
      "Multi-country expansion architecture from day one",
      "Local hosting options assessed for data localization compliance",
    ],
    "diaspora-founder": [
      "Multi-currency pricing architecture designed in week one",
      "Cross-border payment flow mapping before development",
      "Dual-jurisdiction compliance requirements documented upfront",
      "Multi-language and cultural UX adaptation planned",
      "Data residency strategy for both target markets",
      "KYC and identity verification for both jurisdictions",
    ],
    "social-enterprise": [
      "Feature prioritization by impact-per-dollar metric",
      "WCAG AA accessibility requirements from first wireframe",
      "Grant-compatible milestone reporting structure",
      "User research including beneficiaries with disabilities",
      "Budget-optimized infrastructure (nonprofit credits applied)",
      "Impact measurement built into product from day one",
    ],
    // BY CHALLENGE
    "fast-mvp": [
      "48-hour proposal turnaround after first scope conversation",
      "Development starts the day after approval (no multi-week setup)",
      "Two-week sprint demos with working software at each checkpoint",
      "Scope locked before start: no additions without mutual agreement",
      "Fixed price confirmed before first line of code",
      "Launch target date established and tracked from day one",
    ],
    "scaling-tech": [
      "Full-stack performance profiling before any changes are made",
      "Prioritized bottleneck list with fix complexity and impact estimates",
      "Targeted fixes deployed incrementally (not as one big release)",
      "Before/after performance measurements for every intervention",
      "Feature development uninterrupted during performance work",
      "Monitoring dashboards showing improvement trends over time",
    ],
    "agency-rescue": [
      "Complete codebase read-through before any recommendations",
      "Written assessment with salvage-vs-replace analysis per module",
      "Security vulnerabilities identified and severity-ranked immediately",
      "Cost comparison: repair vs. rewrite with timeline for each",
      "Stabilization sprint addressing critical production issues first",
      "Documentation written as the system is understood",
    ],
    "fundraising-ready": [
      "Security vulnerability scan and remediation within first week",
      "Architecture documentation produced for CTO-level review",
      "Load testing at 10x current traffic with detailed report",
      "Technical roadmap aligned to fundraising narrative",
      "Code quality improvements targeting due diligence concerns",
      "Preparation timeline working backward from fundraise date",
    ],
    "ai-integration": [
      "Use case definition workshop before any AI code is written",
      "Quality criteria and eval metrics agreed before implementation",
      "RAG pipeline tuned to your specific content and query patterns",
      "Streaming UI with error handling tested under production conditions",
      "Eval suite with golden dataset running on every deployment",
      "Cost-per-query monitoring and optimization from launch",
    ],
    "tech-debt": [
      "Scored debt inventory prioritized by velocity impact",
      "Parallel workstreams: features continue while debt reduces",
      "Automated tests added to highest-risk code paths first",
      "Velocity metrics tracked weekly to show improvement",
      "No feature freeze required at any point",
      "Prevention mechanisms (CI/CD, code review) to slow re-accumulation",
    ],
    "security-compliance": [
      "Target framework identified and gap assessment in week one",
      "Critical security controls implemented immediately",
      "Evidence collection automated from the start",
      "Penetration testing conducted and remediated before audit",
      "Documentation package prepared for auditor consumption",
      "Timeline working backward from target audit date",
    ],
    "post-pivot": [
      "Complete codebase triage with keep/modify/discard classification",
      "Cost estimate for minimum viable pivot (not full rewrite)",
      "Reuse of existing infrastructure (auth, payments, deployment)",
      "New direction features built on proven foundations",
      "User-facing product in 6-8 weeks (not 6 months)",
      "Existing user data preserved and migrated to new features",
    ],
    "no-tech-team": [
      "Full engineering coverage from day one (no hiring delay)",
      "Autonomous operation with weekly direction approval only",
      "Architecture decisions documented with rationale",
      "Async communication (no daily meetings required)",
      "Hiring support included when you are ready to build internally",
      "Handoff documentation produced throughout (not at the end)",
    ],
    "africa-launch": [
      "Market-specific assessment of infrastructure differences",
      "Payment provider integration (M-Pesa, Paystack, Flutterwave)",
      "Low-bandwidth optimization targeting 2G-compatible performance",
      "USSD/SMS interface for feature phone users",
      "Data localization compliance for target country regulations",
      "Performance testing on representative African networks and devices",
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": ["Detailed scope document with acceptance criteria before pricing", "Fixed price confirmed in writing before development starts", "Milestone payments tied to working software delivery", "Biweekly demos with stakeholder feedback incorporated", "Scope change process: mutual agreement required for additions", "Launch date established and tracked from project start"],
    "dedicated-team": ["Team composition matched to your product needs (2-8 engineers)", "Engineers attend your standups and use your project tools", "Same engineers month-to-month (95% continuity rate)", "Sprint planning and velocity tracking managed within the team", "Scaling up/down within 2 weeks notice", "Quarterly team performance reviews with your feedback"],
    "tech-cofounder": ["Architecture ownership with long-term technical vision documented", "Engineering hiring: job descriptions through onboarding", "Board-ready technical updates produced monthly", "Investor due diligence support and technical representation", "Hands-on development on critical architecture decisions", "Team building strategy aligned to fundraising milestones"],
    "cto-as-a-service": ["8-10 hours weekly of strategic technical engagement", "Architecture review sessions resolving team debates", "Board and investor communication prepared monthly", "Build-vs-buy evaluations for major technology decisions", "Hiring strategy and candidate evaluation as needed", "Technology roadmap updated quarterly against business goals"],
    "design-sprint": ["5-day structured sprint with full facilitation", "User recruitment (5 participants matching target profile)", "Clickable high-fidelity prototype built on Day 4", "User testing sessions conducted and recorded on Day 5", "Sprint report with validated/invalidated hypotheses", "Development specification if hypothesis validated"],
    "code-audit": ["Complete codebase review (architecture, security, quality)", "Written report delivered within 1-2 weeks of engagement start", "Findings scored by severity (critical/high/medium/low)", "Remediation plan with effort estimates per finding", "Executive summary for non-technical stakeholders", "Optional follow-up call to discuss findings and next steps"],
    "staff-augmentation": ["Engineer matched to your specific skill requirement", "Productive contributions within first week", "Full integration into your team process and tools", "3-month minimum engagement with flexible extension", "Weekly check-in on integration quality and satisfaction", "Clean offboarding with knowledge transfer when complete"],
    "retainer": ["Fixed monthly capacity with same engineering team", "Flexible work allocation (features, bugs, performance, ops)", "Priority production incident response within SLA", "Quarterly planning sessions aligning roadmap to capacity", "Monthly progress report and utilization summary", "Scale adjustment with 30-day notice"],
    "nearshore": ["Engineers within ±2 hours of your timezone", "Fluent English (C1+ level verified)", "Full integration into your development process", "Real-time collaboration capability (pair programming, standups)", "Same code quality standards as local team members", "40-60% cost savings vs equivalent local hires"],
    "outsourcing": ["Requirements gathering and scope documentation at project start", "Milestone-based delivery with acceptance criteria per milestone", "Full architecture, development, testing, and deployment ownership", "Complete documentation produced throughout (not at end)", "Handoff training session for your future team", "30-day post-delivery support for bug fixes"],
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
    "ai-startup": [
      "Production RAG pipeline with measured retrieval precision and recall",
      "Complete source code with AI architecture and prompt management documentation",
      "Eval pipeline with golden datasets, regression tests, and quality dashboards",
      "Cost optimization layer with model routing, caching, and usage analytics",
      "Streaming response infrastructure with latency monitoring",
      "Hallucination mitigation documentation with confidence scoring and citation system",
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      "Production application deployed and accessible to users",
      "Complete source code with plain-English architecture documentation",
      "Hosting and infrastructure configured (no server management required)",
      "User analytics dashboard showing key business metrics",
      "Handoff documentation for your future technical hire",
      "Job description template for your first engineering hire",
    ],
    "first-time-founder": [
      "Lean MVP deployed with only hypothesis-validating features",
      "Complete source code with architecture decision log",
      "Analytics and user behavior tracking from launch",
      "Technical due diligence documentation (architecture, security, testing)",
      "Product roadmap based on validated user feedback",
      "Fundraise-ready technical documentation package",
    ],
    "solo-founder": [
      "Production application with all engineering decisions documented",
      "Complete source code with onboarding guide for future engineers",
      "CI/CD pipeline running autonomously (deploy on merge)",
      "Monitoring and alerting configured (issues detected without your attention)",
      "Architecture documentation for future team handoff",
      "First-hire onboarding plan with structured knowledge transfer",
    ],
    "repeat-founder": [
      "Production application with code quality matching your standards",
      "Complete source code reviewable by you personally",
      "Architecture designed for 18 months of growth without rewrite",
      "CI/CD, monitoring, and deployment confidence from day one",
      "Lean documentation (code is self-documenting, decisions are logged)",
      "Codebase that attracts senior engineering candidates",
    ],
    "student-startup": [
      "Working product delivered before demo day deadline",
      "Complete source code with explanatory documentation",
      "Hosting configured at $0-20/month (free tier optimized)",
      "Demo-ready interface with professional design quality",
      "Technical explanation guide for investor conversations",
      "Production-ready architecture (no rebuild needed post-demo)",
    ],
    "corporate-innovator": [
      "Production application passing enterprise security review",
      "Complete source code with enterprise-grade documentation",
      "Legacy system integrations deployed and tested",
      "Security documentation package (architecture, data flows, controls)",
      "Procurement-ready deliverable acceptance documentation",
      "Stakeholder-facing progress reports and decision logs",
    ],
    "female-led": [
      "Production application delivered at published pricing",
      "Complete source code with full documentation and IP ownership",
      "Engineering engagement quality report (communication, delivery, respect)",
      "Transparent timeline and budget tracking throughout engagement",
      "Standard deliverables without gender-based scope assumptions",
      "Full technical handoff documentation for independence",
    ],
    "african-startup": [
      "Application optimized for low-bandwidth African markets",
      "Complete source code with offline-first architecture documentation",
      "Mobile money integration tested with live sandbox environments",
      "USSD/SMS interface deployed and tested on feature phones",
      "Multi-country expansion documentation (add-a-country playbook)",
      "Infrastructure cost analysis at projected African-market scale",
    ],
    "diaspora-founder": [
      "Multi-market application serving both target jurisdictions",
      "Complete source code with multi-market architecture documentation",
      "Cross-border payment flows tested with live sandbox environments",
      "Multi-language interface with cultural UX adaptations",
      "Dual-jurisdiction compliance documentation",
      "Market expansion playbook for additional countries",
    ],
    "social-enterprise": [
      "WCAG AA accessible application tested with assistive technology",
      "Complete source code with accessibility documentation",
      "Impact measurement dashboard with funder-relevant metrics",
      "Grant-compatible milestone delivery documentation",
      "Infrastructure on nonprofit-discounted hosting",
      "Inclusive design documentation proving beneficiary access",
    ],
    // BY CHALLENGE
    "fast-mvp": [
      "Production MVP deployed and serving users within 4-6 weeks",
      "Complete source code with clean architecture documentation",
      "CI/CD pipeline with automated testing on critical paths",
      "Analytics instrumentation measuring core user behaviors",
      "Fixed-price delivery with no overrun charges",
      "Post-launch iteration plan based on user feedback",
    ],
    "scaling-tech": [
      "Performance audit report with prioritized findings",
      "Targeted fixes deployed with before/after measurements",
      "CI/CD pipeline with automated testing and staging environment",
      "Monitoring dashboards showing key performance indicators",
      "Architecture evolution plan for next 12 months of growth",
      "Deployment runbook with rollback procedures",
    ],
    "agency-rescue": [
      "Written assessment with per-module salvage-vs-replace recommendation",
      "Security vulnerabilities patched and verified",
      "Production stability restored (critical bugs fixed)",
      "System documentation (architecture, data flows, deployment)",
      "Recovery development plan with timeline and cost",
      "Clean codebase (or salvaged + new) ready for forward development",
    ],
    "fundraising-ready": [
      "Security audit report with all critical findings remediated",
      "Architecture documentation package for CTO-level review",
      "Load test report proving capacity at projected growth",
      "Technical roadmap (12-18 months) aligned to fundraise narrative",
      "Code quality improvements on due-diligence-visible surfaces",
      "Technical FAQ document anticipating investor questions",
    ],
    "ai-integration": [
      "Production AI feature deployed with monitoring",
      "RAG pipeline tuned and documented for your content type",
      "Eval suite with golden dataset running on every deployment",
      "Streaming UI with error handling and confidence indicators",
      "Quality monitoring dashboard with degradation alerts",
      "Cost-per-query analysis with optimization recommendations",
    ],
    "tech-debt": [
      "Scored debt inventory with prioritized remediation plan",
      "Highest-impact debt items resolved (typically 5-10 items)",
      "Automated test coverage on previously untested critical paths",
      "CI/CD improvements preventing new debt accumulation",
      "Velocity metrics report showing measurable improvement",
      "Remaining debt roadmap with effort estimates for future sprints",
    ],
    "security-compliance": [
      "Gap assessment report against target compliance framework",
      "Security controls implemented and automated",
      "Evidence collection running automatically",
      "Penetration test report with all findings remediated",
      "Audit-ready documentation package",
      "Compliance monitoring dashboard with ongoing status",
    ],
    "post-pivot": [
      "Codebase triage report with cost analysis per module",
      "Pivoted product deployed and serving users in 6-8 weeks",
      "Existing user data migrated to new product direction",
      "Reused infrastructure (auth, payments, deployment) verified",
      "New feature documentation for pivoted direction",
      "Iteration plan for validating new market hypothesis",
    ],
    "no-tech-team": [
      "Production application deployed from zero engineering input",
      "Complete source code with architecture documentation",
      "CI/CD and monitoring running autonomously",
      "Handoff documentation for future engineering hire",
      "Hiring plan (job descriptions, evaluation criteria) when ready",
      "Operational runbook covering all maintenance tasks",
    ],
    "africa-launch": [
      "Product adapted for target African market (low bandwidth, offline)",
      "Payment integrations deployed with live sandbox testing",
      "USSD/SMS interface deployed and tested on feature phones",
      "Performance verified on representative African networks",
      "Data localization compliance for target country",
      "Market expansion playbook for additional African countries",
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": ["Production MVP deployed at the agreed fixed price", "Complete source code with full IP ownership", "Scope document with all acceptance criteria met", "CI/CD pipeline and monitoring configured", "Post-launch bug fix support (30 days included)", "Technical documentation for future development team"],
    "dedicated-team": ["Continuous software delivery at agreed velocity", "Codebase maintained by engineers with deep context", "Sprint reports and velocity metrics", "Scalable team capacity matching your needs", "Knowledge transfer documentation for team transitions", "Quarterly engineering health reports"],
    "tech-cofounder": ["Technical strategy document updated quarterly", "Engineering team hired and onboarded (when applicable)", "Architecture decisions documented with rationale", "Board-ready technical updates (monthly)", "Investor-facing technical documentation", "Codebase built to CTO-level quality standards"],
    "cto-as-a-service": ["Architecture review notes and decisions (weekly)", "Technology strategy document (updated quarterly)", "Board presentation materials (monthly)", "Vendor evaluation reports (as needed)", "Hiring strategy and team architecture plan", "Technical roadmap aligned to business milestones"],
    "design-sprint": ["Sprint report with hypothesis validation results", "Clickable high-fidelity prototype (Figma)", "User testing recordings and synthesis", "Development specification (if hypothesis validated)", "Stakeholder alignment documentation", "Recommendation for next steps (build, pivot, or stop)"],
    "code-audit": ["Written audit report (5-10 pages, prioritized findings)", "Security vulnerability assessment with severity ratings", "Architecture sustainability evaluation", "Prioritized remediation plan with effort estimates", "Executive summary for non-technical stakeholders", "Optional remediation support (quoted separately)"],
    "staff-augmentation": ["Code contributions through your team's standard process", "Knowledge maintained within your codebase and documentation", "Skill gap filled for the duration of the engagement", "Clean offboarding with context transfer to your team", "No proprietary tools or lock-in introduced", "Your codebase, your IP, your process maintained throughout"],
    "retainer": ["Monthly engineering capacity applied to your priorities", "Production stability and incident response", "Ongoing feature development and iteration", "Monthly utilization and progress reports", "Codebase maintained by engineers with long-term context", "Emergency response within agreed SLA"],
    "nearshore": ["Engineering output at local-team quality levels", "Real-time collaboration during your business hours", "Code submitted through your standard review process", "40-60% cost savings documented against local benchmarks", "Same tooling, process, and quality standards as local team", "Flexible capacity scaling with minimal lead time"],
    "outsourcing": ["Complete working software deployed to your infrastructure", "Full source code with IP ownership transferred", "Architecture and deployment documentation", "Automated test suite with meaningful coverage", "CI/CD pipeline configured and operational", "Handoff training completed with your future team"],
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
    "ai-startup": [
      { question: "How do you reduce hallucination in production?", answer: "Source grounding through RAG with verified retrieval, confidence scoring on every output, citation generation that links answers to source documents, and output validation layers that catch factual inconsistencies. We measure hallucination rate continuously and alert when it rises." },
      { question: "How do you manage AI inference costs at scale?", answer: "Model routing directs simple queries to cheaper models (GPT-3.5, Claude Haiku) and reserves expensive models for complex reasoning. Response caching serves repeated queries instantly. Prompt compression reduces token usage 30-50%. Typical result: 50-70% cost reduction vs naive implementation." },
      { question: "What eval infrastructure do you build?", answer: "Golden datasets with human-labeled expected outputs, automated scoring pipelines that run on every deployment, regression detection with alerts, A/B comparison between model versions, and dashboards that show quality trends over time. You know exactly when quality changes." },
      { question: "How do you handle RAG retrieval quality at scale?", answer: "Hybrid search (vector + keyword), domain-specific chunking strategies, re-ranking models, and continuous measurement of precision and recall per query type. As your knowledge base grows, we detect and fix retrieval degradation before users notice." },
      { question: "How long does an AI product take to build?", answer: "A focused AI feature (RAG-powered search, document Q&A) takes 6-8 weeks. A full AI-native product with streaming UI, eval pipeline, and cost optimization takes 10-14 weeks. Adding fine-tuned models adds 4-6 weeks for data preparation and training." },
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { question: "How do I know if you are building the right thing?", answer: "Weekly demos of working software. You see and click through what was built. Plain-English explanations of what each feature does and why it matters. If it does not match your vision, we adjust before the next sprint, not after the project ends." },
      { question: "How do I evaluate your work without technical knowledge?", answer: "You evaluate outcomes: Does it work? Does it match the agreed scope? Is it on time? Is it on budget? We handle code quality, architecture, and technical decisions. You hold us accountable to business results." },
      { question: "What if I need to hire my own engineer later?", answer: "We plan for this from day one. Clean code, full documentation, and architecture guides mean your first hire gets productive in their first week. We also help write job descriptions and evaluate candidates when you are ready." },
      { question: "How is fixed pricing different from hourly?", answer: "Hourly billing means the slower the work goes, the more you pay. Fixed price means we agree on scope and cost before starting. If we underestimated complexity, that is our problem. Your bill does not change." },
      { question: "How long does a typical project take?", answer: "Most MVPs take 6-10 weeks. We define scope in the first week and give you an exact timeline before work begins. The timeline does not change unless you add scope (which requires mutual agreement and a revised quote)." },
    ],
    "first-time-founder": [
      { question: "How do you decide what to cut from my feature list?", answer: "We ask one question per feature: does this validate your core hypothesis? If the answer is no, it waits. The goal is to learn whether users want your product, not to build a complete product before learning anything." },
      { question: "What if my idea changes during development?", answer: "It probably will, and that is fine. Two-week sprints mean you can change direction every 14 days with minimal waste. We build for learning, not for permanence. Pivoting mid-project is normal, not a failure." },
      { question: "How do I know which tech stack is right?", answer: "You do not need to know. We assess your product requirements (real-time features, mobile needs, data complexity, team plans) and recommend the stack that fits. We explain why in business terms so you can discuss it with advisors." },
      { question: "Will investors care about the code quality?", answer: "At Series A and beyond, yes. VCs hire CTOs to review codebases during due diligence. We build to that standard from day one so your code is an asset during fundraising, not a liability that reduces your valuation." },
      { question: "How long should my MVP take?", answer: "4-8 weeks for most products. If the MVP scope takes longer than 8 weeks, the scope is too large. We will tell you what to cut. The goal is to get in front of users fast and learn, not to build a finished product." },
    ],
    "solo-founder": [
      { question: "How much of my time does this require?", answer: "About 1 hour per week: a 30-minute direction check-in plus async Slack responses. We operate autonomously on architecture, daily decisions, and execution. You steer, we row." },
      { question: "How do you make decisions without me?", answer: "We document decisions with rationale in Notion or your preferred tool. You can review anytime. For reversible decisions, we decide and inform. For irreversible ones (database choice, major architecture), we present options and wait for your input." },
      { question: "What happens when I am ready to hire?", answer: "We help transition: write the job description, evaluate candidates, and overlap with your first hire for 2-4 weeks of knowledge transfer. They inherit a documented, clean codebase they can maintain independently." },
      { question: "Can you handle everything? Frontend, backend, DevOps?", answer: "Yes. Our team covers full-stack development, infrastructure, testing, and deployment. One engagement replaces the 3-5 roles you would need if building an internal team. No gaps, no coordination overhead." },
      { question: "How long until I have a shipped product?", answer: "6-10 weeks for most MVPs. We scope aggressively, build lean, and ship fast. You have a product in front of users within 2 months, generating the data that informs what to build next." },
    ],
    "repeat-founder": [
      { question: "How senior are your engineers actually?", answer: "7+ years average experience shipping production software. The engineer you interview in week one builds your product in week eight. No rotation, no bait-and-switch. You can verify by reviewing their commit history on your project." },
      { question: "How fast can you move?", answer: "Daily commits from day one. Working software every two weeks. We match the velocity of experienced founders who know what they want. No multi-week dark periods wondering what is happening." },
      { question: "Will you push back on my decisions?", answer: "Yes. If your scope is too large, if a feature is premature, if an assumption needs testing first, we say so. You are paying for judgment, not compliance. We have seen 50+ projects. Some of those opinions will save you months." },
      { question: "What is your communication style?", answer: "Direct. Engineer-to-founder. No account manager filtering information. You ask a question, the person who knows the answer responds. Usually the same day. We do not hide behind process when a direct conversation is faster." },
      { question: "How long does a project typically take with you?", answer: "6-8 weeks for an MVP. 10-14 weeks for a more complete product. We scope precisely and deliver on time because senior engineers estimate accurately and do not need ramp-up time." },
    ],
    "student-startup": [
      { question: "Can you work within a $5,000-$15,000 budget?", answer: "Yes. We scope to your budget. $5K gets a focused MVP with 2-3 core features. $10-15K gets a more complete product with polish. We tell you honestly what is achievable within your constraints." },
      { question: "Can you guarantee delivery before demo day?", answer: "We have never missed a demo day deadline. We scope backward from your date, build in buffer for revisions, and deliver 1-2 weeks early so you have time to practice your demo with real software." },
      { question: "Will I understand my own product technically?", answer: "Yes. Every architecture decision is explained. Every technology choice comes with a reason you can articulate. When investors ask technical questions, you answer from understanding, not memorized talking points." },
      { question: "What happens after demo day?", answer: "The code is yours. It is production-quality, not a throwaway prototype. You can continue development yourself, with us, or with another team. The product serves real users without needing a rebuild." },
      { question: "Do you work with student teams or just solo student founders?", answer: "Both. If you have a technical co-founder, we can augment their work. If you are non-technical, we handle everything. If you have a team of 3 non-technical co-founders, we still handle everything. Communication adjusts to your setup." },
    ],
    "corporate-innovator": [
      { question: "Can you pass our security review?", answer: "Yes. We produce architecture diagrams, data flow maps, encryption specifications, access control matrices, and penetration test results proactively. Most InfoSec reviews pass within 2-4 weeks when documentation is prepared in advance." },
      { question: "How do you handle our procurement process?", answer: "Fixed-price SOWs with clear deliverables, acceptance criteria, and timelines. Professional liability insurance, NDA compliance, and the vendor onboarding documentation your procurement team requires. We have done this before." },
      { question: "Can you integrate with our legacy systems?", answer: "Yes. We have integrated with SAP, Salesforce, Oracle, ServiceNow, and custom internal APIs of varying age and documentation quality. We build adapter layers that isolate your new product from legacy complexity." },
      { question: "How do you handle stakeholder changes?", answer: "Change requests are formalized with impact analysis: what it costs, what it delays, what it enables. Approved changes update the SOW. This gives stakeholders a feedback mechanism without derailing the project." },
      { question: "How long does a corporate innovation project take?", answer: "8-14 weeks for the product itself, plus 2-6 weeks for procurement and security review processes that happen before development starts. We can run security documentation preparation in parallel with procurement." },
    ],
    "female-led": [
      { question: "How do I know pricing is actually equal?", answer: "Our rate card is published. We will share it before scoping begins. Your project is priced by complexity and duration, not by assumption about the founder. If you want to compare with other clients' quotes for similar scope, we are transparent." },
      { question: "What if I experience disrespect from an engineer?", answer: "Report it immediately. We have a direct escalation path (founder to our CEO, no intermediary). The issue is addressed within 24 hours. If the behavior repeats, the engineer is removed from your project. No tolerance policy." },
      { question: "How do you ensure senior engineers are assigned fairly?", answer: "Project complexity determines team assignment. We document why each engineer is assigned to each project. If you want to verify, we share the team's experience and credentials. Same verification available to all clients." },
      { question: "Do you measure engagement quality?", answer: "Monthly surveys sent to all clients. Communication quality, delivery satisfaction, and respect metrics tracked. Results reviewed by leadership. Below-threshold scores trigger immediate intervention." },
      { question: "How long does a typical project take?", answer: "Same as any equivalent project: 6-10 weeks for an MVP, 10-16 weeks for complex products. Timeline is determined by scope complexity, not founder demographics. We scope and quote identically for all clients." },
    ],
    "african-startup": [
      { question: "Which payment integrations do you support?", answer: "M-Pesa (Safaricom, Vodacom), Paystack, Flutterwave, Chipper Cash, and MTN Mobile Money. Each has different integration patterns, settlement timelines, and reconciliation requirements. We know the production edge cases." },
      { question: "How do you handle offline-first for African markets?", answer: "Local SQLite storage, operation queuing, background sync on connectivity, and conflict resolution for concurrent offline edits. The app works fully without internet, which is the normal state in many use cases." },
      { question: "Can you build USSD interfaces?", answer: "Yes. We design USSD menu trees that deliver utility in 5 navigation steps on any basic phone. SMS fallback for asynchronous communication. Tested on actual feature phone hardware, not just emulators." },
      { question: "How do you handle multi-country expansion?", answer: "Architecture with abstraction layers for payment, telecom, and localization. Adding a new country means configuration changes, not code rewrites. Each country's regulatory and technical requirements handled in isolation." },
      { question: "How long does an African-market product take to build?", answer: "Web platform: 8-12 weeks. Adding offline mobile app: +6-8 weeks. USSD interface: +4-6 weeks. Mobile money integration depends on provider sandbox access (typically 2-4 weeks per provider)." },
    ],
    "diaspora-founder": [
      { question: "How do you handle multi-currency complexity?", answer: "Currency abstraction layer that handles: localized pricing per market, exchange rate management, settlement in different currencies, and the reporting that satisfies both jurisdictions' financial requirements." },
      { question: "Can you build cross-border payment flows?", answer: "Yes. Remittance, marketplace payments, subscription billing across jurisdictions. We handle dual KYC, correspondent banking relationships (through APIs like Wise or CurrencyCloud), and the regulatory reporting both sides require." },
      { question: "How do you handle dual-jurisdiction compliance?", answer: "We map requirements for both jurisdictions in the discovery phase. Architecture is designed to satisfy both simultaneously: data residency through multi-region hosting, dual privacy policies, and the audit trail both regulators expect." },
      { question: "Can you build for right-to-left and left-to-right languages?", answer: "Yes. Our frontend architecture supports bidirectional layouts, locale-aware formatting (dates, numbers, currencies), and cultural UX adaptation. Adding a new language or locale is configuration, not redesign." },
      { question: "How long does a multi-market product take?", answer: "Single-market MVP: 8-12 weeks. Adding second market (currency, payment, compliance): +4-6 weeks. Multi-language interface: +2-3 weeks. Full dual-market product with cross-border payments: 14-18 weeks total." },
    ],
    "social-enterprise": [
      { question: "How do you handle our limited budget?", answer: "We scope to your budget. $10K gets a focused tool with 2-3 core features. $20-30K gets a more complete platform. We prioritize features by impact-per-dollar and cut everything that does not directly serve your mission." },
      { question: "How do you ensure accessibility?", answer: "WCAG AA compliance from the first wireframe: proper heading hierarchy, screen reader labels, keyboard navigation, color contrast ratios, and alt text. Tested with real assistive technology (VoiceOver, NVDA), not just automated scanners." },
      { question: "Can you produce grant-compatible deliverables?", answer: "Yes. Milestone reports, budget breakdowns, outcome metrics, and deliverable documentation formatted for your specific funder's requirements. We have worked with USAID, Gates Foundation, and private foundation reporting standards." },
      { question: "How do you measure impact?", answer: "We build impact tracking into the product: beneficiary counts, outcome indicators, and the dashboard that shows progress against your theory of change. Data captured automatically, not manually compiled for reports." },
      { question: "How long does a social enterprise project take?", answer: "6-10 weeks for most tools. Accessibility testing adds 1-2 weeks to ensure proper compliance. Grant-aligned milestones are scheduled to match your funder's reporting periods." },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { question: "Can you really deliver in 4-6 weeks?", answer: "Yes. Most of our MVPs ship in 4-6 weeks. The key is ruthless scoping: 3-5 features maximum. If the scope requires more time, we tell you what to cut, not how many more weeks to add. Speed comes from focus." },
      { question: "Is a fast MVP just a prototype that gets thrown away?", answer: "No. We build production-quality code: clean architecture, automated tests on critical paths, and deployment pipelines. What you ship to your first users is what you scale when traction arrives. No rebuild required." },
      { question: "What if we need to change scope mid-project?", answer: "Small adjustments happen within the budget. Significant scope changes get a transparent change order: what it adds, what it costs, what it delays. We protect the timeline by default and change it only with your explicit agreement." },
      { question: "How fast can you start?", answer: "Proposal within 48 hours of our first conversation. Development starts the day after you approve. No multi-week discovery phase, no 3-week contract negotiation. We move at the speed your market requires." },
      { question: "What about post-launch support?", answer: "Bug fixes are included for 30 days after launch. Beyond that, we offer retainer arrangements for ongoing iteration. But the goal of the MVP is to learn, so most clients use post-launch data to define their next sprint scope." },
    ],
    "scaling-tech": [
      { question: "Do we need to rewrite everything?", answer: "Almost never. Most scaling problems come from 3-5 specific bottlenecks. Fix those and performance improves 5-10x. We recommend rewrites only when repair genuinely costs more than replacement, which is rare." },
      { question: "How long until we see improvement?", answer: "Measurable improvement within 2-4 weeks. The first fixes target the highest-impact bottlenecks. You will see response time improvements, reduced error rates, or successful deployments within the first sprint." },
      { question: "Can you work alongside our existing team?", answer: "Yes. We often work as a performance-focused squad alongside your feature team. They continue shipping features. We identify and fix the infrastructure and architecture problems. Both workstreams run in parallel." },
      { question: "How do you find the bottlenecks?", answer: "Full-stack profiling: APM tools on every service, database query analysis, infrastructure utilization metrics, and frontend performance measurement. We measure everything, rank by impact, and fix in priority order." },
      { question: "Will fixing performance break existing features?", answer: "Each fix is deployed independently with automated tests. We use feature flags and incremental rollouts so problems are caught early. If a fix introduces issues, it is rolled back within minutes, not hours." },
    ],
    "agency-rescue": [
      { question: "How do you assess the damage?", answer: "We read the entire codebase: architecture structure, test coverage, security posture, dependency health, and deployment configuration. Assessment takes 1-2 weeks and produces a written report with specific recommendations." },
      { question: "Do you always recommend a full rewrite?", answer: "No. Rewrites are expensive and risky. Most projects have 40-60% salvageable code. We identify what works, fix what is broken, and only replace modules where repair costs exceed rebuild costs." },
      { question: "What if the code is really, truly terrible?", answer: "Sometimes it is. In those cases (typically under 20% of rescues), a ground-up rewrite is genuinely cheaper. We tell you honestly when that is the case, with the math to prove it." },
      { question: "How do you prevent the same problems from recurring?", answer: "CI/CD pipelines, automated testing, code review processes, and documentation standards established during recovery. The infrastructure that prevents quality from degrading again." },
      { question: "How long does a rescue project take?", answer: "Assessment: 1-2 weeks. Stabilization (critical bugs, security): 2-4 weeks. Recovery development (forward progress): 6-12 weeks depending on scope. Total from start to shipping features: 8-16 weeks." },
    ],
    "fundraising-ready": [
      { question: "How long before our raise should we start?", answer: "6-8 weeks minimum. Security hardening, architecture documentation, load testing, and roadmap preparation each take 1-2 weeks and can run partially in parallel. Starting 8 weeks before investor meetings is ideal." },
      { question: "What do investors actually look for in technical due diligence?", answer: "Security vulnerabilities (immediate red flags), architecture sustainability (can this scale?), test coverage (is the team disciplined?), deployment practices (is shipping reliable?), and code quality (could we hire engineers to work in this?)." },
      { question: "What if they find something bad?", answer: "If we prepare you, they will not. We run the same review an investor-hired CTO would run, fix everything they would flag, and document everything they would want to see. When their reviewer arrives, they find a clean system." },
      { question: "Can you produce a technical roadmap for our pitch?", answer: "Yes. 12-18 month engineering plan with: features tied to revenue milestones, infrastructure investments tied to growth targets, team scaling plan, and budget estimates. Specific enough for investors who ask hard questions." },
      { question: "How much does fundraise preparation cost?", answer: "Depends on current state. Well-built products need 2-4 weeks of polish ($8-15K). Products with security debt need 4-8 weeks ($15-30K). We assess first and give you an exact quote before committing." },
    ],
    "ai-integration": [
      { question: "We just want to add ChatGPT to our product. Is it that complicated?", answer: "The API call is easy. Making it work reliably in production is the challenge: handling hallucination, managing latency, controlling costs, maintaining quality over time, and designing UX that sets correct expectations. That is what we build." },
      { question: "How do you prevent the AI from hallucinating?", answer: "RAG (retrieval-augmented generation) grounds responses in your verified data. Confidence scoring flags uncertain outputs. Citation requirements force source attribution. Eval pipelines measure hallucination rate continuously." },
      { question: "How much does AI infrastructure cost at scale?", answer: "A naive implementation costs $0.50-$2.00 per query. With semantic caching, efficient retrieval, and smart model routing, we reduce this to $0.05-$0.20 per query. We build cost monitoring from day one so you are never surprised." },
      { question: "How do you measure whether the AI feature is working?", answer: "Automated eval suites with human-verified golden datasets. Quality scores computed on every deployment. Regression alerts when metrics drop. User feedback loops that improve the system over time." },
      { question: "How long does AI integration take?", answer: "Simple features (summarization, Q&A) take 6-8 weeks. RAG with domain-specific tuning takes 10-14 weeks. Products with full eval infrastructure and quality monitoring take 12-16 weeks. Complexity depends on your accuracy requirements." },
    ],
    "tech-debt": [
      { question: "How do you prioritize which debt to fix first?", answer: "Impact scoring: each debt item rated by how much it slows development velocity and how much it risks production stability. High-impact debt (things that cost you hours per week) gets fixed first. Low-impact debt might stay indefinitely." },
      { question: "Do we need to stop building features while you fix debt?", answer: "No. We work alongside your feature team. Debt reduction and feature development run in parallel using the strangler fig approach: new modules replace old ones incrementally without blocking anyone." },
      { question: "How quickly will we see velocity improvement?", answer: "6-8 weeks typically. After the highest-impact debt items are resolved, engineers estimate more accurately, changes break fewer things, and sprint commitments start being met consistently." },
      { question: "How do you prevent debt from re-accumulating?", answer: "CI/CD pipelines with quality gates, automated testing on new code, code review standards, and the engineering discipline that comes from working in a clean codebase. Prevention is built into the delivery process." },
      { question: "How long does a tech debt engagement take?", answer: "Initial audit: 1-2 weeks. Active remediation: 8-12 weeks (running alongside your feature team). After that, the highest-impact debt is resolved and your team maintains the new standards independently." },
    ],
    "security-compliance": [
      { question: "How long does SOC 2 preparation take?", answer: "SOC 2 Type I: 8-12 weeks of control implementation plus the audit itself. SOC 2 Type II: requires 6+ months of evidence collection after controls are in place. Start today and your earliest Type II audit is 6-8 months away." },
      { question: "Can you help with multiple frameworks?", answer: "Yes. SOC 2, HIPAA, PCI-DSS, GDPR, and ISO 27001. Many controls overlap between frameworks, so achieving one makes the next faster. We map shared controls so you do not implement the same thing twice." },
      { question: "Do you handle the audit itself?", answer: "We prepare you for the audit: controls implemented, evidence organized, documentation compiled, and responses drafted. You choose the auditor (we recommend several). We support you through the process but the relationship is between you and your auditor." },
      { question: "What if we just need to pass a customer security questionnaire?", answer: "That is faster: 2-4 weeks to implement the controls they ask about and prepare honest responses. We help you answer the specific questions with evidence, not just checkboxes." },
      { question: "How much does compliance preparation cost?", answer: "SOC 2 Type I preparation: $20-40K depending on gap severity. HIPAA compliance: $15-30K. Customer security questionnaire preparation: $5-10K. We assess gaps first and provide exact quotes." },
    ],
    "post-pivot": [
      { question: "Do we need to rewrite from scratch?", answer: "Usually not. Most pivots share 40-60% of the previous codebase: auth, payments, admin tools, deployment infrastructure. We identify what applies and reuse it. Full rewrites are recommended only when the math clearly favors them." },
      { question: "How fast can we ship the pivoted product?", answer: "6-8 weeks for most pivots. Reusing existing infrastructure saves 2-4 weeks compared to starting from zero. We scope the minimum that validates the new direction and ship it fast." },
      { question: "What happens to our existing users and data?", answer: "User accounts and data are preserved and migrated to the new product. Existing users are transitioned to the new experience. No data loss, no forced re-registration." },
      { question: "How do you decide what code to keep?", answer: "Three categories: keep (directly serves new direction), modify (serves with changes), discard (no longer relevant). We read everything, categorize it, and present the cost of each option. You approve the plan." },
      { question: "How long does the assessment take?", answer: "1-2 weeks for the triage. Then we present: what to keep, what to change, what to build new, total cost, and timeline. Development starts immediately after your approval." },
    ],
    "no-tech-team": [
      { question: "How much of my time does this require?", answer: "About 1 hour per week: one 30-minute direction check-in plus occasional Slack responses. We operate autonomously on architecture, daily decisions, and execution. You manage the business, we build the product." },
      { question: "How do I know you are building the right thing?", answer: "Biweekly demos of working software. You see and interact with what was built. If it does not match your vision, we adjust before the next sprint. You are never more than 2 weeks from a course correction." },
      { question: "What happens when I want to hire my own engineers?", answer: "We help: write the job description, evaluate candidates, and overlap with your first hire for 2-4 weeks of knowledge transfer. The codebase is documented and structured for handoff from day one." },
      { question: "Can you really cover frontend, backend, and DevOps?", answer: "Yes. Our team includes full-stack engineers who handle all of it. One engagement, complete coverage. No coordination between multiple vendors, no gaps between specialties." },
      { question: "How long until I have a shipped product?", answer: "6-10 weeks for most MVPs. We scope in the first week, build in sprints, and ship when the core features are complete. You have a live product serving users within 2-3 months of starting." },
    ],
    "africa-launch": [
      { question: "Can you adapt our existing product for African markets?", answer: "Yes. We assess your current architecture, identify what breaks (payment, performance, connectivity assumptions), and implement the adaptations needed: mobile money, offline capability, low-bandwidth optimization, USSD fallback." },
      { question: "Which African countries have you launched in?", answer: "Kenya, Nigeria, Ghana, South Africa, Tanzania, and Uganda. Each has different payment infrastructure, telecom APIs, and regulatory requirements. We know the landscape from production experience." },
      { question: "How do you handle mobile money integration?", answer: "M-Pesa (STK push), Paystack, Flutterwave, and MTN Mobile Money. Each has unique integration patterns, settlement timelines, and webhook behaviors. We have production experience with the edge cases documentation skips." },
      { question: "Do we need separate apps for African markets?", answer: "Usually not. The same codebase serves all markets with configuration for: payment provider, locale, asset compression level, and offline capability. One codebase, market-specific behavior via configuration." },
      { question: "How long does Africa market adaptation take?", answer: "Payment integration: 3-4 weeks. Low-bandwidth optimization: 2-3 weeks. Offline capability: 4-6 weeks. USSD interface: 4-6 weeks. Full adaptation (all of the above): 10-14 weeks depending on your current architecture." },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { question: "What if the project costs more than estimated?", answer: "That is our problem. Fixed price means the estimation risk is ours. If we underestimated complexity, we absorb the extra cost. Your invoice does not change." },
      { question: "What if I want to add features mid-project?", answer: "We provide a change order: what the addition costs, what it delays, and whether it is worth it. No additions happen without your explicit approval and a revised written agreement." },
      { question: "How do milestone payments work?", answer: "Payment is tied to delivered working software. You see the feature, test it, confirm it meets acceptance criteria, then pay. Typically 3-4 milestones per project. No large upfront deposits." },
      { question: "What if the final product does not match the scope?", answer: "Acceptance criteria are defined per feature in the scope document. If delivered software does not meet those criteria, we fix it at no additional cost. The scope document is the contract." },
      { question: "How long does a fixed-price MVP take?", answer: "4-8 weeks for most MVPs. The scope document (produced in week 1) includes an exact timeline. That timeline is committed, not estimated. We deliver on the date we agreed." },
    ],
    "dedicated-team": [
      { question: "How is this different from staff augmentation?", answer: "Staff augmentation adds individual engineers to your team. A dedicated team is a complete unit: they plan sprints, manage technical decisions, and own delivery outcomes. Less management overhead, more ownership." },
      { question: "How long does onboarding take?", answer: "1-2 weeks to full productivity. Senior engineers read your codebase, attend your ceremonies, and submit meaningful PRs within the first week. No 3-month ramp-up period." },
      { question: "Can I scale the team up and down?", answer: "Yes. Add engineers with 2 weeks notice. Remove with 2 weeks notice. No hiring cycles, no severance, no morale damage. Capacity matches your needs month to month." },
      { question: "What if an engineer is not a good fit?", answer: "We replace them within 1-2 weeks. No awkward performance conversations. No severance negotiations. We find the right fit for your team and culture." },
      { question: "What is the minimum commitment?", answer: "3 months. After that, month-to-month with 30-day notice. Most clients stay 12-18 months because the value compounds as context deepens." },
    ],
    "tech-cofounder": [
      { question: "How is this different from hiring a CTO?", answer: "No equity dilution. No 6-month recruiting process. No risk of a bad full-time hire. Monthly contract with CTO-level responsibilities. When you are ready to hire a full-time CTO, we help with the transition." },
      { question: "Do you write code or just advise?", answer: "Both. Architecture is implemented, not just designed. Critical path features are built directly. Technical leadership means owning outcomes, not just providing opinions." },
      { question: "Can you represent us to investors?", answer: "Yes. Board presentations, due diligence support, investor meetings, and the technical credibility that comes from a named leader with a track record." },
      { question: "What happens when we hire a full-time CTO?", answer: "Graceful transition: we work alongside your new CTO for 1-2 months, transfer context, and step back. The codebase, documentation, and team are ready for independent operation." },
      { question: "What does this cost compared to a full-time CTO?", answer: "Typically 30-50% of a full-time CTO salary (which ranges $250-400K). You get the same strategic value at a fraction of the cost, without equity dilution or long-term commitment." },
    ],
    "cto-as-a-service": [
      { question: "How many hours per week is typical?", answer: "8-10 hours. Enough for: weekly architecture review, biweekly team planning, monthly board preparation, and ad-hoc decisions. Not full-time. Focused strategic time." },
      { question: "How is this different from the tech co-founder engagement?", answer: "Tech co-founder is full-time leadership and execution. CTO-as-a-service is part-time strategy. If you have engineers who execute well but need direction, CTO-as-a-service is the right model." },
      { question: "Can you help us hire?", answer: "Yes. Job architecture, role definitions, interview design, candidate evaluation, and offer strategy. We do not recruit (that is a different service), but we ensure you hire the right people." },
      { question: "What if we eventually need a full-time CTO?", answer: "We help you hire one. We know exactly what profile your company needs because we have been in the role. We write the JD, evaluate candidates, and onboard the hire." },
      { question: "What is the minimum commitment?", answer: "3 months. After that, month-to-month. Most engagements last 6-12 months until the company hires a full-time CTO or the team grows enough to not need external strategy." },
    ],
    "design-sprint": [
      { question: "What do we need to prepare?", answer: "A clear problem statement, access to 5 target users for Friday testing (we help recruit), and your key stakeholders available for the full 5 days. We handle everything else." },
      { question: "What if the sprint kills our idea?", answer: "That is the second-best outcome. Killing a bad idea in 5 days for $15-25K saves $50-150K of building the wrong thing. The sprint pays for itself by preventing waste." },
      { question: "Can we do a remote sprint?", answer: "Yes. Miro for collaboration, Figma for prototyping, and Zoom for user testing. Remote sprints work well with disciplined facilitation. In-person is slightly better for team dynamics." },
      { question: "What happens after the sprint?", answer: "If validated: we produce a development specification and can begin building immediately. If invalidated: we document what was learned and recommend the next hypothesis to test." },
      { question: "How much does a design sprint cost?", answer: "$15-25K depending on complexity and user recruitment requirements. Includes facilitation, prototyping, user testing, and the sprint report. Five days, complete validation." },
    ],
    "code-audit": [
      { question: "How long does an audit take?", answer: "1-2 weeks from start to delivered report. Small codebases (under 50K lines): 1 week. Large codebases or complex architectures: 2 weeks. Timeline agreed before we start." },
      { question: "Will you try to sell us remediation work?", answer: "No. The audit is the deliverable. We provide findings and recommendations. If you want help fixing things, we can quote that separately. But many clients take our report to their existing team." },
      { question: "What if the code is fine?", answer: "Then we tell you it is fine. We have no incentive to find problems that do not exist. A clean audit report is a valid and valuable outcome." },
      { question: "Who is the audience for the report?", answer: "Two sections: executive summary for non-technical stakeholders (2 pages), and detailed findings for engineers (5-8 pages). Both audiences get what they need." },
      { question: "How much does an audit cost?", answer: "$5-15K depending on codebase size and scope (full audit vs. security-only vs. architecture-only). We scope and price before starting." },
    ],
    "staff-augmentation": [
      { question: "How fast can you place an engineer?", answer: "1-2 weeks from agreement to first day. We match skills from our bench of pre-vetted senior engineers. No 3-month recruiting process." },
      { question: "What if the engineer is not a good fit?", answer: "We replace them within 1-2 weeks at no additional cost. Fit is non-negotiable. If the engineer does not integrate well with your team, we find someone who does." },
      { question: "Do they follow our process or bring their own?", answer: "Yours. 100%. Your standup cadence, your PR review process, your code style guide, your deployment procedure. They adapt to you, not the other way around." },
      { question: "What is the minimum engagement?", answer: "3 months. After that, month-to-month with 30-day notice. This ensures enough time for the engineer to become productive and for you to see meaningful value." },
      { question: "How do you ensure quality?", answer: "Pre-vetting: 7+ years experience, technical interview, reference checks. During engagement: weekly integration check-ins, PR quality monitoring, and your direct feedback acted on immediately." },
    ],
    "retainer": [
      { question: "How many hours per month is typical?", answer: "40-80 hours/month is most common. Smaller products: 20-40h. Growth-stage products with active development: 80-120h. We recommend based on your product's needs." },
      { question: "What if I do not use all the hours one month?", answer: "Unused hours roll over for one month (up to 50% of monthly allocation). This gives you flexibility without losing value in quiet months." },
      { question: "Can I change what the hours are used for?", answer: "Yes. Features one month. Bug fixes the next. Performance work after that. The capacity is reserved. How you use it is flexible within each month." },
      { question: "What about emergency production issues?", answer: "Included in your retainer with priority SLA (typically 4-hour response). No separate contract needed. No negotiation during an incident. We respond immediately." },
      { question: "What is the minimum commitment?", answer: "3 months. After that, month-to-month with 30-day notice. Most retainer clients stay 12+ months because the value of consistent engineers with deep context is significant." },
    ],
    "nearshore": [
      { question: "Where are your nearshore engineers located?", answer: "Latin America primarily: Colombia, Argentina, Mexico, and Brazil. Within 1-2 hours of US Eastern/Central time. European clients: Eastern Europe within 1-2 hours of CET." },
      { question: "How do you verify English fluency?", answer: "C1+ level verified through technical interviews conducted entirely in English. Our engineers discuss complex architectural concepts, write documentation, and participate in meetings without communication friction." },
      { question: "Is the quality actually the same as local hires?", answer: "Yes. Same interview standards, same code review expectations, same engineering discipline. The cost difference comes from economics, not quality. We would not place an engineer who could not pass a local hiring bar." },
      { question: "Can they attend our standups?", answer: "Yes. That is the point. Within 2 hours of your timezone means standups at normal times for both parties. Real-time collaboration during your full business day." },
      { question: "What is the cost structure?", answer: "Monthly rate per engineer, 40-60% below equivalent local market rates. No hidden fees. No per-hour billing. Flat monthly rate with the same predictability as a salary." },
    ],
    "outsourcing": [
      { question: "How do we ensure quality without managing the team?", answer: "Milestone acceptance criteria defined upfront. Each milestone reviewed and approved before payment. Automated test suites verify functionality. Code review standards maintained internally. You evaluate output, not process." },
      { question: "What about communication during the project?", answer: "Biweekly milestone demos. Weekly written progress updates. Slack access for questions. You are informed without being involved in daily decisions. Minimal time investment from your side." },
      { question: "What if the delivered software does not meet requirements?", answer: "Milestone acceptance criteria are the contract. If software does not meet criteria, we fix it before payment is due. No ambiguity. Requirements are specific and testable." },
      { question: "Can our team maintain it after handoff?", answer: "Yes. Documentation, architecture guides, deployment procedures, and optional training are included in every delivery. We build for independence, not dependency." },
      { question: "How long does a typical outsourced project take?", answer: "8-16 weeks for most projects. Simple applications: 6-8 weeks. Complex platforms with integrations: 12-16 weeks. Timeline agreed in the SOW before work begins." },
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
    "ai-startup": ["RAG-powered enterprise search products serving Fortune 500 companies", "AI writing assistants processing 500K+ generations monthly", "Document intelligence platforms extracting data from unstructured PDFs", "AI coding tools with context-aware autocomplete and code review"],
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
    // BY FOUNDER TYPE
    "non-technical-founder": ["First-time app founders who launched without writing a line of code", "Domain experts who turned industry knowledge into SaaS products", "Consultants who productized their services into scalable platforms", "Entrepreneurs who needed technology partners, not technology lessons"],
    "first-time-founder": ["First-time founders who shipped MVPs in 6 weeks or less", "Founders who validated hypotheses before burning through runway", "Technical founders who needed experienced architecture guidance", "Business founders who needed honest technical partners"],
    "solo-founder": ["Solo SaaS founders who scaled to $1M ARR without hiring engineers", "Single founders who went from idea to funded with shipped product as proof", "Solopreneurs who needed full engineering teams without management overhead", "Founders who transitioned from external team to first hire smoothly"],
    "repeat-founder": ["Serial entrepreneurs on their 2nd or 3rd venture moving at speed", "Experienced founders who rejected three agencies before choosing us", "Technical founders who needed senior engineers matching their own standards", "Repeat founders who shipped new products in under 8 weeks"],
    "student-startup": ["Y Combinator applicants who needed working products for interviews", "University accelerator teams who delivered before demo day", "Student founders who impressed investors with working software", "Hackathon winners who turned projects into real companies"],
    "corporate-innovator": ["Fortune 500 innovation labs building customer-facing products", "Corporate venture teams launching internal startup concepts", "Enterprise R&D groups prototyping new service offerings", "Digital transformation teams building alongside legacy systems"],
    "female-led": ["Female founders who received consistent pricing and senior resources", "Women-led startups who scaled from MVP to Series A with our team", "Female technical founders who needed execution partners matching their pace", "Women entrepreneurs who found equal treatment after poor experiences elsewhere"],
    "african-startup": ["Kenyan fintech startups integrating M-Pesa for rural payments", "Nigerian logistics platforms tracking deliveries across Lagos", "Ghanaian agritech companies serving smallholder farmers via USSD", "Pan-African SaaS companies expanding across 5+ countries"],
    "diaspora-founder": ["US-based founders serving Nigerian remittance markets", "UK diaspora founders building property platforms for home markets", "European founders connecting African suppliers with global buyers", "Canadian diaspora founders building cross-border payment platforms"],
    "social-enterprise": ["Education nonprofits reaching 50,000+ students with accessible tools", "Health organizations serving beneficiaries in low-connectivity regions", "Impact measurement platforms tracking outcomes for 100+ programs", "Accessibility-first platforms serving users with visual impairments"],
    // BY CHALLENGE
    "fast-mvp": ["Founders who beat competitors to market by shipping in 5 weeks", "Startups that raised seed rounds with live products, not pitch decks", "Teams who validated hypotheses in 6 weeks instead of 6 months", "Companies that turned investor interest into demos within 30 days"],
    "scaling-tech": ["Platforms that went from 4-second to 200ms response times", "Teams that restored deployment confidence after months of fear", "Products that survived 10x traffic growth without downtime", "Companies that reduced on-call pages by 70% in 8 weeks"],
    "agency-rescue": ["Startups rescued from $200K of unusable agency code", "Products stabilized after previous teams disappeared mid-project", "Companies that recovered from zero-documentation handoffs", "Teams that got back on track after 6+ months of wasted development"],
    "fundraising-ready": ["Series A companies that passed technical due diligence without findings", "Startups whose load test reports strengthened investor confidence", "Companies whose security posture improved their valuation", "Founders who closed rounds faster with credible technical roadmaps"],
    "ai-integration": ["Products that added AI features with 98%+ accuracy in production", "Companies that reduced customer support load 60% with AI automation", "Platforms that built eval infrastructure catching quality regressions early", "Teams that controlled AI costs to under $0.10 per query at scale"],
    "tech-debt": ["Teams that doubled sprint velocity within 8 weeks of debt reduction", "Companies that reduced on-call incidents 70% through targeted fixes", "Products where new engineer onboarding dropped from 3 months to 3 weeks", "Codebases that went from deployment-fear to daily shipping confidence"],
    "security-compliance": ["Startups that passed SOC 2 Type II on first attempt", "Healthcare companies achieving HIPAA compliance without slowing delivery", "Fintech platforms passing PCI-DSS with zero remediation items", "Companies whose compliance posture accelerated enterprise sales cycles"],
    "post-pivot": ["Startups that shipped pivoted products in 6 weeks (not 6 months)", "Companies that reused 60% of existing code after major direction changes", "Teams that preserved all user data through complete product pivots", "Founders who re-validated with users faster the second time around"],
    "no-tech-team": ["Non-technical founders who shipped products without hiring engineers", "Companies that went from zero code to live product in 8 weeks", "Founders who successfully transitioned from external to internal team", "Startups that raised funding with shipped products as proof of execution"],
    "africa-launch": ["US products that successfully launched in Kenyan and Nigerian markets", "Platforms serving 40,000+ users via USSD in rural areas", "Companies that integrated 3+ African payment providers in one sprint", "Products optimized from 4MB to under 500KB for 2G performance"],
    // BY ENGAGEMENT
    "fixed-price-mvp": ["Founders who launched MVPs at exact quoted price (zero overruns)", "Startups that shipped in 4-6 weeks with production-quality code", "Companies that budgeted their runway confidently with fixed engineering costs", "Founders who chose fixed-price after hourly agencies tripled their estimates"],
    "dedicated-team": ["Growth-stage companies with dedicated teams of 4-6 engineers for 12+ months", "Startups that scaled teams from 2 to 8 for product launches and back down", "Companies whose dedicated teams outperformed internal hires on velocity metrics", "Organizations that used dedicated teams as bridges while hiring full-time"],
    "tech-cofounder": ["Non-technical founders who raised Series A with our technical leadership", "Startups that built engineering teams from zero under CTO-level guidance", "Companies whose board confidence increased with named technical leadership", "Founders who avoided $2M+ equity dilution by contracting CTO responsibilities"],
    "cto-as-a-service": ["Startups where fractional CTO resolved 6 months of architecture debates in 2 weeks", "Companies that hired correctly on first attempt with CTO-guided interview processes", "Organizations whose board presentations improved with technical leadership communication", "Teams whose velocity doubled after someone owned technical direction"],
    "design-sprint": ["Sprints that validated product direction and went straight to development", "Sprints that killed hypotheses (saving $50-150K each in avoided development)", "Stakeholder groups that aligned after months of disagreement through sprint process", "Product teams that used sprint outputs as development specifications"],
    "code-audit": ["Acquisition targets assessed for technical risk before deal closure", "Startups that used audit reports to prioritize engineering investment", "Companies that passed investor due diligence after audit-driven remediation", "Teams that received honest clean-bill-of-health audits confirming quality"],
    "staff-augmentation": ["Teams that maintained velocity during engineer parental leave", "Companies that completed infrastructure migrations with specialist augmentation", "Organizations that filled senior skill gaps for 3-6 month project needs", "Teams that integrated augmented engineers indistinguishably from full-time staff"],
    "retainer": ["Products maintained and improved by same engineers for 18+ months", "Companies with predictable monthly engineering budgets and flexible allocation", "Organizations with 4-hour emergency response without separate contracts", "Teams that transitioned from retainer to internal hires with zero context loss"],
    "nearshore": ["Companies achieving 50% cost savings with identical code quality metrics", "Teams where nearshore engineers participate in real-time pair programming daily", "Organizations that could not distinguish nearshore PRs from local engineer PRs", "Startups that scaled engineering capacity 3x without scaling budget 3x"],
    "outsourcing": ["Complete products delivered milestone-by-milestone without daily management", "Companies whose internal teams maintained outsourced code independently post-handoff", "Organizations that received documented, tested, deployment-ready software on schedule", "Teams that used outsourced deliveries as foundations for internal development"],
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
    "ai-startup": [
      { text: "Our hallucination rate dropped from 8% to under 0.5% after CiroStack rebuilt our RAG pipeline. Enterprise customers stopped flagging inaccuracies and started signing annual contracts.", name: "Daniel K.", role: "Founder, AI Research Platform" },
      { text: "CiroStack cut our inference costs by 65% without any quality loss. Model routing and caching alone saved us $18,000 per month. That turned our unit economics profitable.", name: "Priya S.", role: "CEO, AI Writing Assistant" },
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
    // BY FOUNDER TYPE
    "non-technical-founder": [
      { text: "I understood every decision they made because they explained it in my language. For the first time, I felt like a participant in my own product development, not a spectator writing checks.", name: "Lisa H.", role: "Non-Technical Founder, Service Platform" },
      { text: "Fixed price saved my sanity. I knew what I was paying, what I was getting, and when it would be done. No surprises. My previous agency tripled their estimate by week four.", name: "Michael R.", role: "Domain Expert Turned Founder" },
    ],
    "first-time-founder": [
      { text: "They cut my 18-feature MVP to 4 features. I was angry. Then we launched in 5 weeks and 3 of those 4 features turned out to be wrong anyway. If we had built all 18, we would have wasted $80,000 learning what $15,000 taught us.", name: "Jason K.", role: "First-Time Founder, B2B SaaS" },
      { text: "CiroStack told me my timeline was unrealistic in the first meeting. Every other agency said 'sure, 6 weeks.' CiroStack said '10 weeks or cut scope.' They were right. And they delivered in 9.", name: "Amara S.", role: "First-Time Founder, Consumer App" },
    ],
    "solo-founder": [
      { text: "I spend 1 hour per week on engineering. One 30-minute check-in and a few Slack messages. CiroStack handles everything else. My time goes to customers and fundraising where it belongs.", name: "David N.", role: "Solo Founder, Analytics Platform" },
      { text: "When I was ready to hire my first engineer, CiroStack helped me write the job description, evaluate candidates, and onboarded my hire in 2 weeks. Smoothest transition I could have asked for.", name: "Rebecca T.", role: "Solo Founder, HR Tech" },
    ],
    "repeat-founder": [
      { text: "I have built three companies. CiroStack is the first external team that matches the quality and speed I expect. Senior engineers, direct communication, and code I can actually read. Finally.", name: "David N.", role: "Serial Entrepreneur, Third Venture" },
      { text: "They pushed back on my feature scope in week one. My previous agency would have billed me for all of it. CiroStack said no, validated two assumptions first, and saved me 6 weeks of building the wrong thing.", name: "Sarah K.", role: "Repeat Founder, Marketplace" },
    ],
    "student-startup": [
      { text: "Demo day was in 9 weeks. Budget was $8,000. CiroStack delivered a working product in 7 weeks with enough polish that two VCs asked for follow-up meetings. We raised our pre-seed round 3 months later.", name: "Chris P.", role: "Student Founder, Now Series A" },
      { text: "I understood my own product for the first time after working with CiroStack. They explained every decision. When investors asked technical questions, I answered from understanding, not memorized scripts.", name: "Khadija M.", role: "MBA Student Founder" },
    ],
    "corporate-innovator": [
      { text: "CiroStack passed our InfoSec review in 3 weeks. Most vendors take 3 months. They had documentation ready before we asked for it. That alone saved our project timeline by 2 months.", name: "Robert J.", role: "VP Innovation, Fortune 500" },
      { text: "Legacy SAP integration that our internal team said would take 6 months. CiroStack delivered it in 8 weeks with an adapter pattern that our IT team actually praised. That never happens.", name: "Jennifer L.", role: "Head of Digital, Insurance Company" },
    ],
    "female-led": [
      { text: "After two agencies that quoted me 40% above market rate, CiroStack charged me exactly what they charge everyone. I verified. Same scope, same price, same senior engineers. What a concept.", name: "Amanda C.", role: "Female Founder, EdTech" },
      { text: "I do not have to prove my technical knowledge to earn respect from this team. My input is taken seriously the first time. After 3 previous agencies where that was not the case, this is refreshing.", name: "Dr. Monica L.", role: "Female Founder, HealthTech" },
    ],
    "african-startup": [
      { text: "CiroStack built our M-Pesa integration in 3 weeks. Our previous agency (US-based) spent 2 months and never got reconciliation working. CiroStack knew exactly how STK push callbacks behave in production.", name: "Joseph M.", role: "Founder, Kenyan Fintech" },
      { text: "40,000 farmers access market prices through USSD menus CiroStack designed. On $15 phones. With no internet. That is the engineering challenge that matters in our market, and they solved it.", name: "Grace A.", role: "CEO, AgriTech Social Enterprise" },
    ],
    "diaspora-founder": [
      { text: "One product serving users in London and Lagos. Multi-currency, cross-border payments, dual-language interface. CiroStack built it as one system, not two separate products duct-taped together.", name: "Ade O.", role: "UK-Based Nigerian Founder" },
      { text: "KYC in two jurisdictions, payment settlement across borders, and a UX that feels local in both markets. CiroStack understood the complexity because they have built this exact pattern before.", name: "Fatima H.", role: "Canadian-Somali Founder, Remittance Platform" },
    ],
    "social-enterprise": [
      { text: "Our platform serves users with visual impairments. CiroStack built with screen readers from day one, not as an afterthought. Our beneficiaries navigate the system independently. That is the impact we exist to create.", name: "Margaret W.", role: "Director, Accessibility Nonprofit" },
      { text: "Every feature justified by impact per dollar. CiroStack cut 60% of what we asked for and delivered the 40% that actually moved our outcome metrics. Our funders were thrilled with the results-per-grant-dollar.", name: "Benjamin T.", role: "Executive Director, Education Social Enterprise" },
    ],
    // BY CHALLENGE
    "fast-mvp": [
      { text: "Proposal in 2 days. Started building on Monday. Shipped in 5 weeks. Our competitor launched 3 weeks later and we already had users. Speed was the difference between winning and losing that market.", name: "Marcus T.", role: "Founder, B2B Marketplace" },
      { text: "CiroStack cut my 15-feature spec to 4 features. I pushed back hard. Then we launched in 4 weeks and 2 of those features turned out to be wrong. If we had built all 15, we would have wasted 3 months learning what 4 weeks taught.", name: "Rachel K.", role: "Founder, Consumer SaaS" },
    ],
    "scaling-tech": [
      { text: "Response times went from 4 seconds to 180ms. They found the problem in 3 days (a missing database index compounding with an N+1 query). The fix took 2 hours. The diagnosis was the hard part.", name: "Kevin L.", role: "CTO, Analytics Platform" },
      { text: "We had not deployed on a Friday in 8 months. After CiroStack fixed our CI/CD and added automated testing, we deploy twice a day, any day. The fear is gone.", name: "Samantha W.", role: "VP Engineering, SaaS Company" },
    ],
    "agency-rescue": [
      { text: "Previous agency charged us $180K for code with zero tests, no documentation, and architecture that crashed at 50 concurrent users. CiroStack assessed the damage in a week, salvaged 40%, and had us shipping features again in 6 weeks.", name: "Tom R.", role: "CTO, Consumer App" },
      { text: "CiroStack told us 60% of our code was salvageable. Every other consultant said rewrite from scratch. CiroStack was right. We saved $120K and 4 months by keeping what worked.", name: "Diana K.", role: "Founder, Healthcare Startup" },
    ],
    "fundraising-ready": [
      { text: "The CTO our lead investor hired to review our code found zero critical issues. He told them the architecture was 'unusually clean for a seed-stage company.' CiroStack prepared us for exactly what he looked for.", name: "Andrew S.", role: "Founder, Series A Company" },
      { text: "Load test report showing we handle 50K concurrent users was the single most impactful slide in our Series A deck. Investors stopped asking 'can you scale?' because we had proof.", name: "Michelle P.", role: "CEO, B2B SaaS" },
    ],
    "ai-integration": [
      { text: "Our AI summarizes legal documents with 97% accuracy and cites every source. CiroStack built the eval pipeline that catches the 3% before users see it. That pipeline is worth more than the AI feature itself.", name: "Nathan B.", role: "Founder, Legal AI" },
      { text: "AI cost per query went from $0.85 to $0.08 after CiroStack implemented semantic caching and efficient retrieval. Same quality. 90% cost reduction. That changed our unit economics completely.", name: "Jessica T.", role: "CTO, AI Writing Platform" },
    ],
    "tech-debt": [
      { text: "Sprint velocity doubled in 7 weeks. Not because we hired more engineers. Because CiroStack fixed the 5 things that were costing us 60% of our time. Same team, twice the output.", name: "Paul M.", role: "VP Engineering, Series B Startup" },
      { text: "New engineers used to take 3 months to get productive. After CiroStack's debt reduction and documentation sprint, our last hire shipped their first feature in week two.", name: "Linda C.", role: "CTO, Growth-Stage SaaS" },
    ],
    "security-compliance": [
      { text: "SOC 2 Type II audit passed with zero findings. Our auditor said it was the smoothest startup audit he had conducted. CiroStack's evidence automation made the entire process feel routine.", name: "Steven H.", role: "CEO, Enterprise SaaS" },
      { text: "Three enterprise deals ($180K combined ARR) were blocked by security questionnaires we could not answer honestly. CiroStack implemented the controls in 6 weeks. All three deals closed the following month.", name: "Karen D.", role: "Founder, Compliance Platform" },
    ],
    "post-pivot": [
      { text: "CiroStack said 55% of our code still applied to the new direction. They were right. We shipped the pivoted product in 7 weeks. A full rewrite would have taken 4-5 months and we would have missed our fundraising window.", name: "Nina S.", role: "Founder, Post-Pivot Startup" },
      { text: "The team was demoralized after the pivot. CiroStack shipped visible progress in week one. By week three we had working software in the new direction. Energy came back immediately.", name: "Jason R.", role: "CEO, Marketplace (Second Direction)" },
    ],
    "no-tech-team": [
      { text: "I went from zero code to a live product with paying users in 9 weeks. Without CiroStack, I would still be interviewing CTO candidates. The product exists because they exist.", name: "Rebecca T.", role: "Solo Founder, HR Tech" },
      { text: "When I raised my seed round, investors asked who built the product. I said CiroStack. They said the code quality was better than most funded startups with full-time engineers. That closed the round.", name: "David M.", role: "Non-Technical Founder, Fintech" },
    ],
    "africa-launch": [
      { text: "Our US product went from unusable to 40,000 active users in Kenya within 3 months of CiroStack's adaptation. M-Pesa integration, offline mode, and 2G optimization. They understood the market immediately.", name: "Aisha N.", role: "Founder, Expanding to East Africa" },
      { text: "Page weight went from 3.8MB to 420KB. Load time on 2G dropped from 45 seconds to 4 seconds. That is the difference between a product that works in Africa and one that does not. CiroStack made it work.", name: "Emmanuel O.", role: "CTO, Pan-African Platform" },
    ],
    // BY ENGAGEMENT
    "fixed-price-mvp": [
      { text: "Fixed price means I sleep at night. No surprise invoices, no scope creep conversations. Just software shipping on schedule at the price we agreed. After two agencies that tripled their estimates, this was transformative.", name: "Chris P.", role: "Founder, MVP Client" },
      { text: "They quoted $28K. They delivered for $28K. In 6 weeks. I have never worked with a development partner where the final invoice matched the proposal. CiroStack is the only one.", name: "Laura M.", role: "Founder, B2B SaaS MVP" },
    ],
    "dedicated-team": [
      { text: "Our dedicated team of 4 engineers has been with us for 18 months. They feel like employees, not vendors. They know our codebase better than our internal team does.", name: "Rachel O.", role: "VP Engineering, Growth Stage" },
      { text: "We scaled from 2 to 6 engineers for our product launch, then back to 3 after. Try doing that with full-time hires. The flexibility alone is worth the engagement model.", name: "James T.", role: "CTO, Series B Startup" },
    ],
    "tech-cofounder": [
      { text: "Investors stopped asking who our CTO was after CiroStack's technical lead presented our roadmap at the board meeting. They provided the credibility we needed without the equity we could not afford to give.", name: "Sarah K.", role: "Non-Technical Founder, Series A" },
      { text: "CiroStack hired our first 3 engineers, designed our architecture, and built our product. When we finally hired a full-time CTO, she said the foundation was better than what she inherited at her last funded startup.", name: "Michael D.", role: "Founder, Fintech Startup" },
    ],
    "cto-as-a-service": [
      { text: "Our engineers are talented but they were stuck in 3-month architecture debates. CiroStack's fractional CTO resolved them in one session. Velocity doubled because someone finally owned the direction.", name: "Daniel F.", role: "CEO, Developer Tools Company" },
      { text: "Board members stopped asking uncomfortable technical questions after CiroStack started producing our monthly updates. The translation from engineering work to business outcomes was exactly what we needed.", name: "Andrea L.", role: "Founder, Healthcare SaaS" },
    ],
    "design-sprint": [
      { text: "The sprint killed our original hypothesis on Day 5. We were devastated. Then we realized it saved us $120K of building the wrong thing. Best $20K we ever spent.", name: "Ryan W.", role: "Founder, Consumer App" },
      { text: "Five stakeholders who could not agree for 3 months aligned in 5 days. Watching users interact with the prototype ended every argument. Data beats opinions.", name: "Catherine H.", role: "VP Product, Enterprise SaaS" },
    ],
    "code-audit": [
      { text: "CiroStack found 3 critical security issues our internal team missed. No sugarcoating, no upselling. Just a clear report that said: fix these immediately, fix these soon, and these are fine. Exactly what we needed.", name: "Mark S.", role: "CTO, Acquired Startup" },
      { text: "The audit was 8 pages. Not 80. Five things to fix first, clearly prioritized. My team started working the same day they read it. Most useful $8K we have spent on engineering.", name: "Laura K.", role: "VP Engineering, Series A" },
    ],
    "staff-augmentation": [
      { text: "Our augmented engineer submitted a meaningful PR on day 3. Not a typo fix. A real feature. Senior engineers who can read a codebase and contribute immediately are rare. CiroStack delivered one.", name: "Jonathan H.", role: "Engineering Manager, Growth Startup" },
      { text: "We needed a DevOps specialist for 4 months. Hiring full-time made no sense. CiroStack placed someone who migrated our infrastructure, documented everything, and left us fully independent.", name: "Amy R.", role: "CTO, SaaS Platform" },
    ],
    "retainer": [
      { text: "Same two engineers for 14 months. They know our codebase better than anyone. Monthly cost is predictable. Emergency response is included. We budget engineering like a utility bill now.", name: "Brian C.", role: "Founder, E-commerce Platform" },
      { text: "Some months we need 80 hours of feature work. Some months we need 20 hours of maintenance. Same invoice either way. The flexibility within a predictable budget is exactly what we needed.", name: "Sandra M.", role: "CEO, B2B Marketplace" },
    ],
    "nearshore": [
      { text: "I genuinely cannot tell which PRs are from our nearshore engineers and which are from our SF team. Same quality, same communication, same code review standards. At 45% lower cost.", name: "Derek W.", role: "VP Engineering, Series B" },
      { text: "Pair programming with our nearshore team works because they are 1 hour off our timezone. We tried offshore (8 hours off) first. The communication tax ate all the cost savings. Nearshore is the sweet spot.", name: "Lisa H.", role: "CTO, Collaboration Tool" },
    ],
    "outsourcing": [
      { text: "Requirements in. Working software out. Monthly demos. Milestone payments. Our internal team took over the codebase without a single question we could not answer from the documentation.", name: "Gregory T.", role: "VP Product, Enterprise Company" },
      { text: "We outsourced a complete product build and our team maintained it independently for 2 years without calling CiroStack back once. That is what proper handoff documentation looks like.", name: "Monica J.", role: "Director Engineering, Mid-Size Company" },
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
