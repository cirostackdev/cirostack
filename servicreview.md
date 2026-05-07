# Service Applications Review

Cross-reference of what each startup's "Service Applications" section cards promise vs. what the corresponding service page actually covers.

---

## Summary

All 51 startup pages reference exactly 4 service slugs: `websites`, `apps`, `ux-ui-design`, `devops`. Each startup has 4 cards (one per service). The service pages are written as general-purpose offerings, while the startup cards make highly domain-specific claims. This creates gaps where the service page does not explicitly support what the startup card promises a visitor clicking through.

### Coverage Rating

| Service Page | Fully Covered | Partially Covered | Not Covered |
|---|---|---|---|
| Custom Software Development (`websites`) | 6 startups | 18 startups | 27 startups |
| Mobile Apps Development (`apps`) | 4 startups | 15 startups | 32 startups |
| UX & UI Design (`ux-ui-design`) | 10 startups | 16 startups | 25 startups |
| DevOps Consulting (`devops`) | 12 startups | 20 startups | 19 startups |

---

## Service Page: Custom Software Development (`/services/websites`)

### What the page explicitly covers:
- Custom UI/UX design tailored to brand identity
- Mobile-first responsive layouts
- Built-in Technical SEO best practices
- Headless CMS integration
- Performance optimization (Core Web Vitals)
- Deep analytics and conversion tracking setup
- Technologies: React, Next.js, Tailwind CSS, TypeScript, Vercel, Framer Motion
- Industries listed: SaaS, E-commerce, Healthcare, Financial Services, Real Estate, Professional Services

### Gaps by startup (card claims NOT present on the service page):

| Startup | Card Claims (Missing from Service Page) |
|---|---|
| **fintech** | PCI-DSS compliance, tokenization, fraud scoring, multi-rail payment support (ACH, wire, card, crypto) |
| **healthtech** | HIPAA-compliant video (WebRTC), waiting rooms, screen sharing, automatic phone failover |
| **edtech** | LMS, course creation tools, progress tracking, assessment engines, adaptive learning, 500K concurrency |
| **proptech** | MLS-compliant property search, geospatial queries, saved searches, alerts |
| **legaltech** | Matter management, document assembly, time tracking, billing systems for legal workflows |
| **ai-startup** | RAG pipelines, vector databases, embedding pipelines, retrieval ranking, prompt management, model orchestration |
| **logistics-tech** | Real-time fleet tracking, vehicle status, driver assignment, route visualization, dispatch |
| **ecommerce** | Composable commerce backends, product catalog, cart, checkout, order management (partial: "headless CMS" listed but not commerce) |
| **b2b-saas** | Multi-tenant architecture, tenant isolation, admin consoles, usage dashboards, self-serve onboarding |
| **consumer-apps** | Backend services for feeds, profiles, notifications, real-time features (chat, reactions, live updates) |
| **web-app** | Full-stack with Node.js/Python backend, server-side rendering, API layer, database design, real-time (partially covered) |
| **mobile-app** | React Native cross-platform development (this belongs on the apps page) |
| **ai-product** | RAG pipelines, inference infrastructure, vector databases, embedding pipelines |
| **saas-platform** | Multi-tenant core, subscription enforcement layer, feature gating by plan |
| **marketplace** | Two-sided marketplace, listing management, search/discovery, matching logic |
| **api-product** | RESTful/GraphQL API architecture, endpoint design, authentication (API keys, OAuth), pagination |
| **data-platform** | ELT pipeline architecture, dbt transformations, event stream extractors |
| **iot** | Fleet dashboards, device management, remote configuration, device segmentation |
| **internal-tools** | Admin panels, approval workflows, data entry interfaces, operations dashboards |
| **embedded** | Bare-metal/RTOS firmware, HAL layer, communication stack (completely unrelated to web development) |
| **fast-mvp** | "MVP shipped in 4-6 weeks" framing (process claim, not a capability gap per se) |
| **scaling-tech** | Full-stack bottleneck identification, database query profiling, API response time analysis |
| **agency-rescue** | Codebase assessment, security vulnerability analysis, salvage-vs-replace recommendations |
| **fundraising-ready** | Security hardening, vulnerability remediation, encryption verification, access control audit |
| **ai-integration** | RAG pipelines, AI-native features, model orchestration, streaming responses |
| **tech-debt** | Codebase analysis, debt scoring by velocity impact and reliability risk |
| **security-compliance** | Security controls as code, encryption enforcement, access logging, MFA, network segmentation |
| **post-pivot** | Module-by-module salvage/replace assessment, surgical modifications to existing code |

### Startups with reasonable coverage:
- **non-technical-founder** ("End-to-end product build" = generic enough)
- **first-time-founder** ("MVP Development" = generic enough)
- **solo-founder** ("Autonomous Development" = generic)
- **repeat-founder** ("Senior Engineering" / code quality = generic)
- **student-startup** ("Demo Day MVP" = generic product build)
- **fixed-price-mvp** ("Scoped MVP Development" = generic)

---

## Service Page: Mobile Apps Development (`/services/apps`)

### What the page explicitly covers:
- Cross-platform mobile apps (iOS & Android from single codebase)
- Progressive Web Applications (PWAs)
- Complex state management and real-time data synchronization
- Robust user authentication (biometric security, SSO)
- Third-party API and legacy system integration
- Scalable, highly available backend microservice architectures
- Technologies: React Native, Flutter, Node.js, PostgreSQL, AWS, Firebase
- Industries listed: FinTech, HealthTech, Logistics, E-commerce, On-Demand Services, EdTech

### Gaps by startup (card claims NOT present on the service page):

| Startup | Card Claims (Missing from Service Page) |
|---|---|
| **fintech** | Plaid, Stripe Connect, Open Banking connectors, account linking, balance verification, transaction history |
| **healthtech** | EHR Integration, FHIR R4, HL7v2, Epic/Cerner/Allscripts/Athenahealth vendor integrations |
| **edtech** | Offline video playback, progress sync, push notifications for learning habits (offline partially implied) |
| **proptech** | Digital closing platforms, multi-party document/signature/approval coordination |
| **legaltech** | Contract automation, template engines with conditional logic, jurisdiction detection, clause libraries |
| **ai-startup** | Conversational/generative/agentic interfaces, streaming response UIs, confidence indicators, source citations |
| **logistics-tech** | Turn-by-turn navigation, delivery queue management, proof-of-delivery capture, offline in tunnels |
| **ecommerce** | One-tap checkout, personalized recommendations, push notifications timed to buying patterns |
| **b2b-saas** | SAML/OIDC authentication, SCIM user provisioning, audit logging, RBAC for enterprise procurement |
| **consumer-apps** | Gesture-driven navigation, 60fps performance, offline caching (partially covered by native performance claims) |
| **web-app** | WebSocket infrastructure, live cursors, shared editing, presence indicators (not mobile apps) |
| **mobile-app** | Swift (iOS) and Kotlin (Android) native development, AR features, HealthKit/Google Fit (partially covered) |
| **ai-product** | Streaming response UI, confidence indicators, source citations, feedback mechanisms |
| **saas-platform** | Stripe/Chargebee integration, usage metering, invoice generation, dunning sequences |
| **marketplace** | Stripe Connect, escrow, split payments, seller payouts, refund flows, accounting reconciliation |
| **api-product** | Interactive API docs, code samples, sandbox environments, developer dashboard, key management |
| **data-platform** | Semantic layer, materialized views, BI integration (Metabase, Looker) |
| **iot** | Application firmware, hardware abstraction, power management, OTA update mechanism |
| **internal-tools** | Multi-step approval chains, conditional routing, automated notifications, system integration |
| **embedded** | Web dashboards for fleet management, firmware distribution, telemetry collection |
| **corporate-innovator** | SAP, Salesforce, Oracle, custom internal API integrations |
| **african-startup** | M-Pesa, Paystack, Flutterwave, USSD payment, mobile money reconciliation |
| **diaspora-founder** | Cross-border payments, currency conversion, settlement, regulatory reporting |
| **fast-mvp** | Feature set reduction to essentials, structured scoping (process, not tech) |
| **scaling-tech** | Database indexing, query optimization, caching layers, connection pooling |
| **agency-rescue** | Security patches, crash-causing bugs, data-loss risk fixes, production stabilization |
| **fundraising-ready** | Architecture documentation, system diagrams, technology rationale for investor CTOs |
| **ai-integration** | Golden dataset creation, automated quality scoring, regression detection, A/B testing for AI |
| **tech-debt** | Strangler fig refactoring, incremental module replacement |
| **post-pivot** | Surgical code modifications, maximum reuse of existing code |

### Startups with reasonable coverage:
- **non-technical-founder** ("Feature prioritization and scope management" = process)
- **first-time-founder** ("Technical Advisory" / guidance = reasonable)
- **solo-founder** ("Technical Leadership" = architecture decisions)
- **student-startup** ("Technical Education" = learning alongside delivery)

---

## Service Page: UX & UI Design (`/services/ux-ui-design`)

### What the page explicitly covers:
- In-depth user research, surveys, and persona development
- Strategic information architecture and user flow mapping
- Low-fidelity wireframing and rapid structural prototyping
- High-fidelity visual design, typography, color theory
- Comprehensive, scalable Design System creation
- Rigorous usability testing and heuristic evaluations
- Technologies: Figma, Adobe XD, Framer, Maze, Miro, Webflow
- Industries listed: SaaS, E-commerce, FinTech, HealthTech, Education, Media

### CRITICAL MISMATCHES (cards reference this slug but describe non-design work):

| Startup | Card Claims (Completely Unrelated to UX/UI) |
|---|---|
| **scaling-tech** | "System Design Review": architecture evolution planning, growth projection assessment |
| **agency-rescue** | "Architecture Recovery": architecture diagrams, data flow docs, deployment procedures from code analysis |
| **fundraising-ready** | "Load Testing": simulated traffic at 10x, breaking point identification, performance reports |
| **tech-debt** | "Testing Implementation": automated test coverage, integration and unit tests |
| **security-compliance** | "Gap Assessment": SOC 2/HIPAA/PCI-DSS/GDPR posture analysis, remediation planning |
| **code-audit** | "Architecture Evaluation": scalability assessment, coupling problems, growth plan analysis |
| **tech-cofounder** | "Investor Relations": board updates, due diligence support, technical roadmap presentations |
| **cto-as-a-service** | "Board Communication": monthly board updates, investor reports, engineering-to-business translation |
| **staff-augmentation** | "Team Integration": code style adoption, PR process alignment, documentation standards |
| **nearshore** | "Process Alignment": sprint planning, retrospectives, code review culture, CI/CD expectations |
| **outsourcing** | "Documentation & Handoff": architecture guides, deployment procedures, code docs, training |
| **repeat-founder** | "Architecture Review": second opinions on architecture, stack selection, scaling strategy |
| **dedicated-team** | "Technical Leadership": architecture guidance, code reviews, quality standards |

These 13 startups use the `ux-ui-design` slug for cards that have zero relation to UX/UI design. A user clicking "Learn more" on these cards will land on a design services page when they expected architecture, testing, or leadership content.

### Domain-specific design gaps (valid design work but not on the page):

| Startup | Card Claims (Design work, but domain not covered) |
|---|---|
| **fintech** | Compliance dashboard design, regulatory reporting interfaces |
| **healthtech** | Accessible clinical-grade interfaces, WCAG AA + health literacy |
| **proptech** | Map interfaces with draw-to-search, property cards, geospatial browsing patterns |
| **legaltech** | Attorney-facing interfaces, 6-minute billing increments design constraints |
| **ai-startup** | Human-AI interaction design, confidence scores, source presentation, latency UX |
| **ai-product** | Human-AI interaction design, confidence indicators, correction flows |
| **logistics-tech** | Split interfaces: dispatcher dashboards + one-handed driver app UX |
| **iot** | Real-time device maps, telemetry visualizations, alert management |
| **embedded** | LED patterns, button interactions, companion app flows, pairing UX |
| **african-startup** | Low-bandwidth design, $50 devices, limited digital literacy |
| **social-enterprise** | WCAG AA, screen reader compatible, tested with assistive technology |
| **ai-integration** | AI UX: confidence indicators, source citations, loading states for AI |

### Startups with reasonable coverage:
- **ecommerce** ("Checkout and product page design" = conversion UX, covered)
- **b2b-saas** ("Admin, analytics, and settings interfaces" = dashboard design, covered)
- **consumer-apps** ("Retention and engagement UX" = behavioral design, partially covered)
- **web-app** ("Dashboard and workflow interface design" = covered)
- **mobile-app** ("Touch-first interface design" = partially covered)
- **non-technical-founder** ("User-tested interface design" = generic, covered)
- **first-time-founder** ("Product Design" = generic, covered)
- **student-startup** ("Pitch-Ready Design" = visual polish, covered)
- **design-sprint** ("User Testing" = 5 user interviews, covered by usability testing)
- **fixed-price-mvp** ("Lean interface design" = generic, covered)

---

## Service Page: DevOps Consulting (`/services/devops`)

### What the page explicitly covers:
- Advanced CI/CD pipeline design, optimization, and implementation
- Container orchestration (Docker and Kubernetes)
- GitOps workflow implementation (ArgoCD, Flux)
- Profound observability, centralized logging, metrics aggregation
- Automated infrastructure security scanning (DevSecOps)
- Incident response planning and blameless post-mortem culture
- Technologies: GitHub Actions, Kubernetes, Docker, ArgoCD, Prometheus, Datadog
- Industries listed: SaaS, FinTech, Logistics, Media Streaming, E-commerce, Healthcare

### Gaps by startup (card claims NOT present on the service page):

| Startup | Card Claims (Missing from Service Page) |
|---|---|
| **fintech** | Zero-downtime deployment, database replication, disaster recovery for financial systems |
| **healthtech** | HIPAA infrastructure, BAA-covered configs, encryption in logs, automated compliance evidence |
| **edtech** | Adaptive bitrate transcoding, multi-CDN strategy, per-student streaming cost optimization |
| **proptech** | PostGIS indexing, tile servers, geospatial query caching (<200ms) |
| **legaltech** | Privilege-boundary enforcement at infrastructure level, chain of custody audit trails |
| **ai-startup** | Model deployment pipelines, A/B testing for models, cost dashboards, eval suites |
| **logistics-tech** | Sub-second GPS update processing, efficient storage, replay capability, geofence alerting |
| **ecommerce** | Edge caching, image optimization pipelines, auto-scaling for flash sales (partially: observability covers monitoring) |
| **b2b-saas** | Tenant-aware infrastructure, per-tenant resource limits, feature flags per plan |
| **consumer-apps** | WebSocket infrastructure, push notification pipelines, event-driven architecture |
| **ai-product** | Model deployment, A/B testing infrastructure, quality monitoring dashboards, eval suites |
| **iot** | MQTT broker clusters (EMQX, HiveMQ), TimescaleDB/InfluxDB for telemetry, edge computing |
| **embedded** | Hardware-in-the-loop testing, automated firmware builds, OTA delivery, staged rollout for devices |
| **african-startup** | Edge caching near African users, compressed assets, hosting costs for low-revenue markets |
| **diaspora-founder** | Multi-region deployment, data residency compliance |
| **data-platform** | Snowflake/BigQuery/Redshift config, Airflow/Dagster orchestration, data freshness alerting |
| **saas-platform** | Tenant-aware deployments, per-tenant isolation, feature flags per plan, multi-tenant ops tooling |
| **marketplace** | Fraud scoring, content moderation queues, user verification, dispute resolution (labeled as infra) |
| **ai-integration** | Vector database hosting, model API management, caching layers, cost monitoring per query |

### Startups with reasonable coverage:
- **web-app** ("Cloud Infrastructure" = AWS/Vercel, auto-scaling, monitoring = good match)
- **mobile-app** ("Mobile DevOps" = Fastlane, TestFlight, CI/CD = partially covered by CI/CD)
- **fast-mvp** ("Instant Infrastructure" = Vercel/AWS + CI/CD = covered)
- **first-time-founder** ("Launch Infrastructure" = CI/CD, monitoring, error tracking = covered)
- **solo-founder** ("Full Operations" = hosting, deployments, security patches = covered)
- **non-technical-founder** ("Infrastructure & Launch" = deployment + monitoring = covered)
- **student-startup** ("Budget-Optimized Infrastructure" = free-tier hosting = partially)
- **scaling-tech** ("Deployment Modernization" = CI/CD, staging, feature flags, rollback = covered)
- **tech-debt** ("DevOps Remediation" = CI/CD, quality gates, monitoring = covered)
- **fixed-price-mvp** ("Launch Infrastructure" = CI/CD + hosting = covered)
- **retainer** ("Infrastructure Management" = server management, monitoring = covered)
- **code-audit** ("Remediation Planning" = prioritized fix plan = reasonable)

---

## Critical Issues (Ranked by Severity)

### 1. SEVERE: 13 startups misuse `ux-ui-design` slug for non-design content

The following startup cards link to the UX/UI Design service page but describe work completely unrelated to design:

- `scaling-tech` → "System Design Review" (architecture)
- `agency-rescue` → "Architecture Recovery" (documentation)
- `fundraising-ready` → "Load Testing" (performance)
- `tech-debt` → "Testing Implementation" (QA)
- `security-compliance` → "Gap Assessment" (compliance audit)
- `code-audit` → "Architecture Evaluation" (tech assessment)
- `tech-cofounder` → "Investor Relations" (board comms)
- `cto-as-a-service` → "Board Communication" (stakeholder mgmt)
- `staff-augmentation` → "Team Integration" (process alignment)
- `nearshore` → "Process Alignment" (agile methodology)
- `outsourcing` → "Documentation & Handoff" (knowledge transfer)
- `repeat-founder` → "Architecture Review" (tech strategy)
- `dedicated-team` → "Technical Leadership" (code review)

**Recommendation:** These need either (a) a new service slug (e.g., `technical-advisory` or `architecture`) or (b) the cards should link to a more appropriate service page, or (c) the UX/UI Design service page should be split into "Design" and "Technical Advisory."

### 2. HIGH: `websites` slug used for firmware, data pipelines, IoT platforms

The Custom Software Development page describes web platform development (React, Next.js, responsive layouts, SEO), but these startups use the slug for completely different product types:

- `embedded` → Bare-metal/RTOS firmware development
- `data-platform` → ELT pipeline architecture with dbt
- `iot` → Device management fleet dashboards
- `api-product` → RESTful/GraphQL API architecture (no frontend)

**Recommendation:** Either expand the `websites` service page to cover "Custom Software Development" more broadly (backend, APIs, firmware, data), or create new service slugs for these distinct categories.

### 3. HIGH: `apps` slug used for non-mobile work

The Mobile Apps page describes iOS/Android/PWA development, but these startups use it for:

- `web-app` → WebSocket/real-time collaboration (not mobile)
- `data-platform` → Semantic layer and BI integration (not mobile)
- `api-product` → Developer portal and API documentation (not mobile)
- `embedded` → Cloud backend and device management platform (not mobile)
- `fundraising-ready` → Technical documentation for investors (not development)
- `ai-integration` → Eval infrastructure and quality measurement (not mobile)
- `tech-debt` → Strangler fig refactoring (not mobile)
- `scaling-tech` → Database optimization and caching (not mobile)

**Recommendation:** Similar to above, the service page title could be broadened to "Application & Product Development" or distinct slugs should be used.

### 4. MEDIUM: Domain-specific capabilities absent from all 4 service pages

No service page mentions:
- AI/ML infrastructure (RAG, vector databases, model serving, eval pipelines)
- Compliance frameworks (HIPAA, PCI-DSS, SOC 2, FSMA 204)
- IoT protocols (MQTT, LoRaWAN, time-series databases)
- Payment integrations (Stripe Connect, M-Pesa, Paystack)
- Geospatial systems (PostGIS, tile servers)
- Real-time systems (WebSocket at scale, GPS tracking)
- Firmware/embedded development

These are referenced by 20+ startup pages but have zero presence on any service page a user would land on.

---

## Recommendations

1. **Immediate fix (highest impact):** Remove the `ux-ui-design` slug from the 13 cards that describe non-design work. Replace with `software-auditing` or a new `technical-advisory` slug.

2. **Rename service slugs for clarity:**
   - `websites` → Could be renamed internally to `development` since it's used for all primary build work
   - `apps` → Could be renamed to `product-development` since it covers more than mobile

3. **Expand service page content to match promises:** Add domain-specific sections or at minimum a "What this looks like for [vertical]" section on each service page that addresses the specific claims made by startup cards linking to it.

4. **Consider adding service pages for:**
   - AI/ML Development (already exists at `/services/ai` and `/services/ai-ml` but not linked by startup cards)
   - Security & Compliance (exists at `/services/security-audit` but not used)
   - Data Engineering (exists at `/services/data-engineering` but not used)

5. **Alternatively:** Accept that the 4-slug system is intentionally reductive (funneling all traffic to 4 service pages) and add "industry-specific application" sections to each service page that address the diverse claims made by startup cards.
